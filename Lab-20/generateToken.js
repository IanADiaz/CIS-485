//const express = require('express');
const jwt = require('jsonwebtoken');
//const app = express();

//app.use(express.json());


function generateJWT(payload, secretkey) {
	const token = jwt.sign(payload, secretkey, { algorithm: 'HS256', expiresIn: '1h' });
	return token;
}

const args = process.argv.slice(2);

if (args.length !== 2) {
	console.error('Usage: node generateToken.js <payload as JSON> <secret key>');
	process.exit(1);
}

const payload = JSON.parse(args[0]);
const secretkey = args[1];

try { 
	const token = generateJWT(payload, secretkey);
	console.log('Generated JWT: ', token);
}
catch (error) {
	console.error('Error generating JWT: ', error.message);
}

//app.listen(3003, () => console.log('Server running on http://localhost:3003');
