import re
import hashlib

import requests

from typing import Union

from fastapi import APIRouter, WebSocket
from pydantic import BaseModel

from backend.logger import Logger
from backend.base import Response
from fastapi.responses import HTMLResponse
from backend.utils.sandbox_pool import ChPool

router = APIRouter()
logger = Logger(__name__, log_file="heartbeat.log")
sandbox_pool = ChPool()


@router.websocket("/api/v1/ws/sandbox")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        with sandbox_pool.get_sandbox() as sandbox:
            await websocket.send_text(str(sandbox.port))
            data = await websocket.receive_text()
