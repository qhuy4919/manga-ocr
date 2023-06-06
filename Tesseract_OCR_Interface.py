import pytesseract

class Tesseract_OCR_Interface:
    def __init__(self):
        pytesseract.pytesseract.tesseract_cmd = r'Tesseract-OCR\\tesseract.exe'
        self.currentOCRlanguage = "jpn_vert"
        self.listOfSupportedLanguages = pytesseract.get_languages(config='')
        
    def checkIfLanguageIsVertical(self):
        if "_vert" in self.currentOCRlanguage:
            return True
        else:
            return False

    def imageToText(self, inputImagePath):
        #psm 5 is suitable for vertical while psm 6 is suitable for horizontal text
        custom_oem_psm_config = r'--oem 1 --psm 5'

        if (self.checkIfLanguageIsVertical()):
            custom_oem_psm_config = r'--oem 1 --psm 5'
        else:
            custom_oem_psm_config = r'--oem 1 --psm 6'

        result = pytesseract.image_to_string(inputImagePath, lang=self.currentOCRlanguage, config=custom_oem_psm_config)
        return result
    
    
# tesseract_ocr_interface = Tesseract_OCR_Interface()
# print(tesseract_ocr_interface.imageToText("easy.png"))