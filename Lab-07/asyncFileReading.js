const fs = require('fs').promises;

async function readFromFile(filename) {
	try {
		const data = await fs.readFile(filename, 'utf-8');
		console.log(`Data from file: ${data}`);
	}
	catch (error) {
		console.error(`Error reading from file: ${error}`);
	}
}

readFromFile('asyncFile.txt');
