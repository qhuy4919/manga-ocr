from flask import Flask
from flask import request
import requests

import json
import cv2
import os 
from time import sleep

from getListOfCroppedTextboxImagesInfo import getListOfCroppedTextboxImagesInfo

import sys
sys.path.insert(0, '../../Modules/')


userSettingsPath = open("./app-config.json", encoding='utf8')
userSettings = json.load(userSettingsPath)
pythonFlaskServerPortNumber = userSettings["Manga_Rikai_OCR"]["pythonFlaskServerPortNumber"]


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/", methods = ['POST'])


def sendTextboxesToMainServer():
    data = request.get_json()
    message = data.get("message")
    fileName = data.get("file_name")
    

    print('fileName', fileName)

    if (message == "detect all textboxes"):
        # in case of images not detected restart
        try:
            listOfTextboxCoordinates = getListOfTextBoxes(fileName)
            
        except cv2.error as e:
            print("#########################################")
            print("cv2 error, restart now")
            print("#########################################")

            sleep(0.3)
            listOfTextboxCoordinates = getListOfTextBoxes(fileName)
        print(listOfTextboxCoordinates)
        return json.dumps(listOfTextboxCoordinates)
    
    if (message == "get all textboxes info"):
        listOfTextboxCoordinates = getListOfTextBoxes(fileName)
        listOfTextboxInfo = getListOfCroppedTextboxImagesInfo(listOfTextboxCoordinates)
        return json.dumps(listOfTextboxInfo)

    if (message == "close server"):
        shutdown_server()

    return json.dumps(fileName)

def getListOfTextBoxes(fileName):
    url = 'http://localhost:7676/'
    myobj = {'message': 'detect text in image', 'file_name': fileName}
    result = requests.post(url, json = myobj)
    return result.json()

def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

if __name__ == "__main__":
    print(pythonFlaskServerPortNumber)
    app.run(host='0.0.0.0', port=7575)
