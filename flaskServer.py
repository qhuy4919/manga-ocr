from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin

from waitress import serve

import json
import textDetector 

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
print("text detection server ready")
print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

@app.route("/", methods = ['POST'])
@cross_origin()

def sendImage():
    data = request.get_json()
    message = data.get("message")
    content = data.get("content")

    print("this content", content)
    if (message == "detect text in image"):
        imagePath = content
        result = textDetector.detectText(imagePath)
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
