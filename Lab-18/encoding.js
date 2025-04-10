const readline = require('readline');
const fs = require('fs');
const path = require('path');

function encodeBase64(data) {
	return Buffer.from(data).toString('base64');
}

function decodeBase64(encodedData) {
	return Buffer.from(encodedData, 'base64').toString('utf-8');
}

function encodeImage(imagePath,outputTextFile) {
	try {
		const imageData = fs.readFileSync(imagePath);
		const base64String = imageData.toString('base64');
		fs.writeFileSync(outputTextFile, base64String);
		console.log('\nImage before encoding:', imageData);
		console.log('\nImage after encoding:', base64String);
		console.log(`\nEncoded Image saved to ${outputTextFile}`);
	}
	catch (error) {
		console.log("\nError encoding image:", error.message);
	}
}

encodeImage('randomPic.jpg', 'imageOutputText.txt');

function decodeImage(outputTextFile, outputImagePath) {
	try {
		const base64String = fs.readFileSync(outputTextFile, 'utf-8');
		const imageBuffer = Buffer.from(base64String, 'base64');
		fs.writeFileSync(outputImagePath, imageBuffer);
		console.log(`\nDecoded image saved to ${outputImagePath}`);
		console.log('\nRetrieved Base64 String:', base64String);
		console.log('\nImage after decoding:', imageBuffer);
	}
	catch (error) {
		console.error("\nError decoding image:", error.message);
	}
}
decodeImage('imageOutputText.txt', 'randomPic.jpg');

const read = readline.createInterface({
        input: process.stdin,
        output: process.stdout
});

read.question("Type what you want encoded:", function(input) {

        const encoded = encodeBase64(input);
        console.log("Encoded:", encoded);

        const decoded = decodeBase64(encoded);
        console.log("Decoded:", decoded);
        read.close();
});
