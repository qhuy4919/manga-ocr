from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
import requests
from PIL import Image
from waitress import serve
import io 

import json
import textDetector 

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
print("text detection server ready")
print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

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

    print("CRAFT payload", data)
    if (message == "detect text in image"):
        
        inputImage = getImagefromExpress(fileName)
        
        print('@@@@@@@@@@@@@huy@@@@@@@@@@@@@@@@@@@')

        result = textDetector.detectText(inputImage)
        return json.dumps(result)

    if (message == "close server"):
        shutdown_server()

    return json.dumps("hello")

def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

if __name__ == "__main__":
    serve(app, host='0.0.0.0', port=7676)
