const fetch = require('node-fetch');

const processListOfCoordinates = require("./processListOfCoordinates.js")

module.exports = async (fileName) => {
  try {
	let listOftextboxes = await sendMessageToServer(7575, fileName, "detect all textboxes")
	
	if(!listOftextboxes || listOftextboxes === '[[]]') {
		return {
			success: false,
			content: '',
		}
	};
	return {
		success: true,
		content: listOftextboxes,
	}
	// return processListOfCoordinates(listOftextboxes)
  } catch (error) {
	return {
		success: false,
		content: '',
	}
  }
} 

async function sendMessageToServer(serverPort, fileName, thisMessage) { 
	console.log("🚀 ~ file: requestAllTextboxes.js:29 ~ sendMessageToServer ~ fileName:", fileName)
	try {
		const response = await fetch(`http://localhost:${serverPort}/`, {
			method: 'POST', // or 'PUT'
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({file_name: fileName, message: thisMessage, })
			
		})

		const textData = await response.json()
		return textData

	} catch (error) {
	}

}