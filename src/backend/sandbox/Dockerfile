FROM ubuntu:18.04
# COPY sources.list /etc/apt/sources.list
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y autoconf
RUN apt-get install -y automake
RUN apt-get install -y curl
RUN apt-get install -y cmake --fix-missing
RUN apt-get install -y git
RUN apt-get install -y libtool
RUN apt-get install -y make
RUN git clone --depth=1 https://github.com/tsl0922/ttyd.git /ttyd 
RUN cd /ttyd && env BUILD_TARGET=x86_64 ./scripts/cross-build.sh

FROM ubuntu:18.04
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y g++ --fix-missing
RUN apt-get install -y python3
COPY --from=0 /ttyd/build/ttyd /usr/bin/ttyd

EXPOSE 7681
WORKDIR /root

CMD ["ttyd", "bash"]