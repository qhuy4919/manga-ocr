const fs = require('fs')

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
require("dotenv").config();
const base64Img = require('base64-img');
const fetch = require('node-fetch');
const exec = require('child_process').exec;

const translateTextInImage = require("./imgTranslation.js")
const requestAllTextBoxes = require("./requestAllTextboxes.js")
const imgToText = require("./requestOCR.js")
let translateTextOffline = require("./translateTextOffline.js")


// const listOfVariablesData = require("./app-config.json")
const HTTPserverPortNumber = process.env.EXPRESS_WEB_API_PORT

app.use(cors({ origin: '*' }))
app.use(bodyParser.json({ limit: '100mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))


function closeTranslationAggregator() {
  exec('taskkill /f /im TranslationAggregator.exe');
};

function removeImageBase64Prefix(base64Img) {
  const normalizeImageBase64 = base64Img.split(',');

  return normalizeImageBase64[1];
}

async function detectAllTextboxes(imageFile, res) {
  Promise.resolve(saveImageInStorage(imageFile, res)).then(fileName => {
    Promise.resolve(requestAllTextBoxes(fileName)).then(result => {
      if (!result.success) {
        res.status(500).json({
          succes: false,
          content: 'server internal error',
        })
      }
      else {
        res.status(200).json({
          succes: true,
          content: JSON.stringify(result.content),
        })
      }
    })
  })

}

async function extractTextFromImage(imageFile, res) {
  // base64Img.img(imageFile, '.', 'croppedImage', function (err, filepath) { });
   Promise.resolve(saveImageInStorage(imageFile, res)).then(fileName => {
    Promise.resolve(imgToText(fileName))
      .then(result => {
        if (!result.success) {
          res.status(500).json({
            succes: false,
            content: 'OCR server error',
          })
        }
        else {
          res.status(200).json({
            succes: true,
            content: JSON.stringify(result.content),
          })
        }
      })
  });
}

async function saveImageInStorage(imageBase64, res) {
  try {
    const storageServerResponse = await fetch('http://localhost:1606/upload-base64', {
      method: 'POST',
      body: JSON.stringify({
          image: removeImageBase64Prefix(imageBase64),
        }),
      headers: { 'Content-Type': 'application/json' },

    });

    return await storageServerResponse.json().then((result) => {
      return result.data.file_name;  
    })

  } catch (error) {
     res.status(500).json({
          succes: false,
          content: 'Storage server error',
        })
      }
}

app.post('/', async function (req, res) {
  const body = req.body;
  let content = body.content
  let message = body.message

  if (!body.content) {
    res.json({
      status: 400,
      error: 'Invalid content'
    })
  }

  if (message == "translate cropped image") {
    translateCroppedImage(content, res)
  }

  else if (message == "translate text") {
    let translatedText = await translateTextOffline(body.content)
    res.send(JSON.stringify(translatedText))
  }

  else if (message == "detect all textboxes") {
    await detectAllTextboxes(content, res)
  }

  else if (message == "extract text in cropped image") {
    await extractTextFromImage(content, res)
  }

  else if (message == "save translation data to file") {
    let translationData = content
    fs.writeFileSync('translationData.json', JSON.stringify(translationData, null, 4));
    res.send(JSON.stringify("translation data saved"))
  }

  else if (message == "close translation aggregator") {
    // closeTranslationAggregator()
    res.send(JSON.stringify("done"))
  }

  else if (message == "close everything") {
    process.exit()
  
  }
});

app.get('/loaderio', async function (req, res) {
  res.send('loaderio-1e7e59df7a3a49a844cd4a1dceae421f');
})

app.listen(HTTPserverPortNumber,  '0.0.0.0', function (err) {
  if (err) {
    throw err;
  }

  console.log(`Server started on port ${HTTPserverPortNumber}`);
});