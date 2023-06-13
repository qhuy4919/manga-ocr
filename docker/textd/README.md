# Text Detect Component
This is one of the 2 AI component, detect text. Runs Flask.

## Build:
```sh
docker build -f docker/textd/Dockerfile -t qhuy/manga_ocr_textd:latest .
```

## Run:
```sh
docker run -d --rm --name manga_ocr_textd --net=host qhuy/manga_ocr_textd:latest
```