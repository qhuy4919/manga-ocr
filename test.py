from ocr import MangaOcr

pretrained_model_name_or_path='OCR Model'
force_cpu=False
img_or_path="hardCase.png"

mocr = MangaOcr(pretrained_model_name_or_path, force_cpu)
text = mocr(img_or_path)
print(text)
