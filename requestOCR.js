const fetch = require('node-fetch');
const path = require("path");

// this API call will get absolute path of an image not in this folder and pass it to the python OCR server
module.exports = async function sendMessageToServer(thisContent) {  
	let fullImagePath = path.resolve(thisContent);
	console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&")
	console.log(fullImagePath);
	

	try {
		let result = await fetch(`http://localhost:14267/`, {
			method: 'post',
			body:    JSON.stringify({content: fullImagePath, message: "convert image to text"}),
			headers: { 'Content-Type': 'application/json' },
		})

		const textData = await result.json();

		console.log('first', textData);
		
		return {
			success: true,
			content: textData
		}

	} catch (error) {
		return {
			success: false,
			content: '',
		}
	}
	
}

// sendMessageToServer("easy.png", "convert image to text")