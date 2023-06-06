const fetch = require('node-fetch');

module.exports = async function sendMessageToServer() {  
	let result = await fetch(`http://localhost:14267/`, {
			method: 'post',
			body:    JSON.stringify({content: "no content", message: "change ocr model to Tesseract"}),
			headers: { 'Content-Type': 'application/json' },
		})
	return result.json()
}

