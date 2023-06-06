from Manga_OCR_Interface import Manga_OCR_Interface
# from Tesseract_OCR_Interface import Tesseract_OCR_Interface
import pyperclip


class OCR_Interface:
    def __init__(self):
        self.Manga_OCR_Model = Manga_OCR_Interface()
        # self.Tesseract_OCR_Model = Tesseract_OCR_Interface()
        self.currentOCRmodel = self.Manga_OCR_Model
        self.listOfAvailableModels = ["Manga OCR, Tesseract OCR"]
        self.listOfSupportedLanguages = {"Manga OCR": self.Manga_OCR_Model.listOfSupportedLanguages}
        self.pasteToClipboardState = True

    def imageToText(self, inputImagePath):
        result = self.currentOCRmodel.imageToText(inputImagePath)
        if (self.pasteToClipboardState == True):
            pyperclip.copy(result)
            pyperclip.paste()
        return result

    def getListOfSupportedLanguages(self):
        return self.listOfSupportedLanguages

    def changeOCRmodel(self, nameOfModel):
        if (nameOfModel == "Manga OCR"):
            self.currentOCRmodel = self.Manga_OCR_Model
        # elif (nameOfModel == "Tesseract OCR"):
        #     self.currentOCRmodel = self.Tesseract_OCR_Model

    def changeOCRlanguage(self, nameOfModel, languageName):
        self.changeOCRmodel(nameOfModel)
        self.currentOCRmodel.currentOCRlanguage = languageName