FROM ubuntu:22.04

RUN apt update && apt upgrade -y
RUN apt -y install software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt -y install python3.10
RUN apt -y install python3-pip
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

WORKDIR /app
COPY . ./
RUN pip3 install -r requirements.txt
CMD ["python3.10", "flaskServer.py"]