# Docker scripts
To dockerize the app, runs this at Project root directory:
```bash
docker build -t qhuy/manga_ocr_web:latest -f docker/Dockerfile .
```

Then, to run the container (in background mode), and map to port 3000 on host, run the following:
```bash
docker run --rm -d --name manga_ocr_web -p 3000:80 qhuy/manga_ocr_web:latest
```