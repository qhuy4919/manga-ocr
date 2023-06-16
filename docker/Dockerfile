FROM 3.10.12-alpine3.17

RUN apk update
COPY . ./app
WORKDIR /app
RUN pip install -r requirements.txt

CMD ["python", "server.py"]