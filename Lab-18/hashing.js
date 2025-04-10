const crypto = require('crypto');
const readline = require('readline');

function hashData(input) {
	const hash = crypto.createHash('sha256');
	hash.update(input);
	return hash.digest('hex');
}

const read = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

read.question("Type something here:", function(input) {
	console.log("Plaintext:", input);
	console.log("SHA-256 HASH:", hashData(input));
	read.close();
});
