from ocr import MangaOcr

class Manga_OCR_Interface:
    def __init__(self):
        self.pretrained_model_name_or_path='OCR Model'
        self.force_cpu=False
        self.manga_ocr_model = MangaOcr(self.pretrained_model_name_or_path, self.force_cpu)
        self.listOfSupportedLanguages = ["japanese_Manga"]
        self.currentOCRlanguage = "japanese_Manga" #not doing anything at the moment, just to sync with Tesseract class

    def imageToText(self, inputImagePath):
        result = self.manga_ocr_model(inputImagePath)
        print(result)
        return result


class OCR_Interface:
    def __init__(self):
        self.OCR_Model = Manga_OCR_Interface()
    
    def imageToText(self, inputImagePath):
        return self.OCR_Model.imageToText(inputImagePath)


# ocr_interface = OCR_Interface()        
# ocr_interface.imageToText("easy.png")

# manga_ocr_interface = Manga_OCR_Interface()
# manga_ocr_interface.imageToText("hardCase.png")