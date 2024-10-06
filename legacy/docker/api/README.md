# API component
This is Express server to face internet and receives requests

## Build:
```sh
docker build -f docker/api/Dockerfile -t qhuy/manga_ocr_api:latest .
```

## Run:
```sh
docker run -d --rm --name manga_ocr_api --net=host qhuy/manga_ocr_api:latest
```