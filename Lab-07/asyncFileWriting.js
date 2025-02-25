const fs = require('fs/promises');

async function writeToFile(filename, content) {
	try{
		await fs.writeFile(filename, content);
		console.log(`Data successfully written to ${filename}`);
	}
	catch (error) {
		console.log(`Error writing to file: ${filename}`);
	}
}

const data = 'This is the first sentence in the txt file.';
writeToFile('asyncFile.txt', data);
