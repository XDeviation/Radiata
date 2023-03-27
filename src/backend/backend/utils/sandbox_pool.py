import threading
import socket
import docker
import time
import random
from backend.logger import Logger

socket.setdefaulttimeout(3)
logger = Logger(__name__, log_file="auth.log")


def socket_port(ip, port):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = s.connect_ex((ip, port))
        if result == 0:
            return True
        return False
    except:
        return True


class Sandbox:
    def __init__(self) -> None:
        port = random.randint(9000, 10000)
        while socket_port("localhost", port):
            port += 1
        self.port = port
        self.time = time.time()
        self.client = docker.from_env()
        self.container = self.client.containers.run(
            "xdeviation/sandbox:latest", detach=True, ports={"7681/tcp": self.port}
        )

    def __del__(self) -> None:
        try:
            self.container.stop()
        except Exception as e:
            logger.exception(e)

    def stop(self) -> None:
        try:
            self.container.stop()
        except Exception as e:
            logger.exception(e)


from contextlib import contextmanager
from typing import Generator


class ChPoolError(Exception):
    """A generic exception that may be raised by ChPool"""


class TooManyConnections(ChPoolError):
    """Raised when attempting to use more than connections_max clients."""


class ChPool:
    # pylint: disable=too-many-instance-attributes
    def __init__(self, **kwargs):
        self.connections_min = kwargs.pop("connections_min", 1)
        self.connections_max = kwargs.pop("connections_max", 20)

        self.connection_args = {"host": kwargs.pop("host", "localhost"), **kwargs}
        self.closed = False
        self._pool = []
        self._used = {}

        # similar to psycopg2 pools, _rused is used for mapping instances of conn
        # to their respective keys in _used
        self._rused = {}
        self._keys = 0
        self._lock = threading.Lock()

        for _ in range(self.connections_min):
            self._connect()

    def _connect(self, key: str = None) -> Sandbox:
        sandbox = Sandbox()
        if key is not None:
            self._used[key] = sandbox
            self._rused[id(sandbox)] = key
        else:
            self._pool.append(sandbox)
        return sandbox

    def _get_key(self):
        self._keys += 1
        return self._keys

    def pull(self, key: str = None) -> Sandbox:
        self._lock.acquire()
        try:
            if self.closed:
                raise ChPoolError("pool closed")

            if key is None:
                key = self._get_key()

            if key in self._used:
                return self._used[key]

            if self._pool:
                self._used[key] = sandbox = self._pool.pop()
                self._rused[id(sandbox)] = key
                return sandbox

            if len(self._used) >= self.connections_max:
                raise TooManyConnections("too many connections")
            return self._connect(key)
        finally:
            self._lock.release()

    def push(self, sandbox: Sandbox = None, key: str = None, close: bool = False):
        self._lock.acquire()
        try:
            if self.closed:
                raise ChPoolError("pool closed")
            if key is None:
                key = self._rused.get(id(sandbox))
                if key is None:
                    raise ChPoolError("trying to put unkeyed client")
            if len(self._pool) < self.connections_min and not close:
                # TODO: verify connection still valid
                if time.time() - sandbox.time < 3600:
                    self._pool.append(sandbox)
            else:
                sandbox.stop()

            # ensure thread doesn't put connection back once the pool is closed
            if not self.closed or key in self._used:
                del self._used[key]
                del self._rused[id(sandbox)]
        finally:
            self._lock.release()

    def cleanup(self):
        self._lock.acquire()
        try:
            if self.closed:
                raise ChPoolError("pool closed")
            for sandbox in self._pool + list(self._used.values()):
                try:
                    sandbox.stop()
                # TODO: handle problems with stop
                except Exception:
                    pass
            self.closed = True
        finally:
            self._lock.release()

    @contextmanager
    def get_sandbox(self, key: str = None) -> Generator[Sandbox, None, None]:
        """A clean way to grab a client via a contextmanager.
        Args:
            key: If known, the key of the client to grab.
        Yields:
            Client: a clickhouse-driver client
        """
        sandbox = self.pull(key)
        try:
            yield sandbox
        finally:
            self.push(sandbox=sandbox)
