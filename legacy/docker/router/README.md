# Router component
This is Router component, sits between API component and the two AI servers. Runs Flask.

## Build:
```sh
docker build -f docker/router/Dockerfile -t qhuy/manga_ocr_router:latest .
```

## Run:
```sh
docker run -d --rm --name manga_ocr_router --net=host qhuy/manga_ocr_router:latest
```