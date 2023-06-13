# `OCR` component
This is `OCR` component, sits between API component and the two AI servers. Runs Flask.

## Build:
```sh
docker build -f docker/ocr/Dockerfile -t qhuy/manga_ocr_ocr:latest .
```

## Run:
```sh
docker run -d --rm --name manga_ocr_ocr --net=host qhuy/manga_ocr_ocr:latest
```