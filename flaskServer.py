from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin

from timeit import default_timer as timer

import json

import requests
from OCR_Interface import OCR_Interface

ocr_interface = OCR_Interface()

app = Flask(__name__)

cors = CORS(app)
from PIL import Image
app.config['CORS_HEADERS'] = 'Content-Type'

def getImagefromExpress(imageName):
    url = f'http://localhost:1606/image/{imageName}'
    img = Image.open(requests.get(url, stream=True).raw)
    return img

@app.route("/", methods = ['POST'])
@cross_origin()
def sendImage():
    data = request.get_json()
    message = data.get("message")
    fileName = data.get("file_name")

    print("this message", message)

    if (message == "change ocr model to Tesseract"):
        ocr_interface.changeOCRmodel("Tesseract OCR")
        return json.dumps("done changing model")
    
    if (message == "stop auto pasting ocr output to clipboard"):
        ocr_interface.pasteToClipboardState = False
        return json.dumps("done stopping auto pasting ocr output to clipboard")

    if (message == "convert image to text"):
        start = timer()
        inputImagePath = getImagefromExpress(fileName)
        ocrOutput = ocr_interface.imageToText(inputImagePath)
        end = timer()
        print('processing time: ',end - start)
        return json.dumps(ocrOutput.strip())

    if (message == "close server"):
        shutdown_server()

def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=14267)


