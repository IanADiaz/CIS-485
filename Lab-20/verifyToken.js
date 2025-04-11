const jwt = require('jsonwebtoken');

function verifyJWT(token, secretkey) {
	try {
		const decoded = jwt.verify(token, secretkey, { algorithms: ['HS256'] });
		console.log('Token is valid. Payload: ', decoded);
	}
	catch (error) {
		console.error('Invalid token: ', error.message);
	}
}

const args = process.argv.slice(2);

if (args.length !== 2) {
	console.log('Usage: node verifyJWT.js <JWT> <secret key>');
	process.exit(1);
}

const token = args[0];
const secretkey = args[1];

verifyJWT(token, secretkey);
