const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const SECRET_KEY = "12345";

//hardcoded user
const users = {
	user1: { password: "password", role: "admin" },
	user2: { password: "000", role: "user" } 
};

app.post('/login', (req, res) => {
	const {username, password} = req.body;

	if (users[username] && users[username].password === password) {
		const token = jwt.sign({username, role: users[username].role}, SECRET_KEY, {expiresIn: '1h'});
		res.json({token});
	}
	else {
		res.status(401).send('Invalid Credentials');
	}
});

function verifyJWT(req, res, next) {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) return res.status(403).send('Missing Token');

	jwt.verify(token, SECRET_KEY, (error, decoded) => {
		if (error) return res.status(403).send('Invalid Token');
		//my version of role based auth (single)
		if (decoded.role !== 'admin') return res.status(403).send('Acess Denied');
		
		req.user = decoded;
		next();
	});
}

//function authorizeRoles(...allowedRoles) {
//	return (req, res, next) => {
//	const token = req.headers.authorization?.split(' ')[1];
//	if (!token) return res.status(401).send('Token missing');
//	jwt.verify(token, SECRET_KEY, (err, decoded) => {
//		if (err) return res.status(403).send('Invalid token');
//		req.user = decoded;
//		// Check if the user's role is allowed
//		if (!allowedRoles.includes(req.user.role)) {
//			return res.status(403).send('Access forbidden: insufficient permissions');
//		}	
//		next();
//		});
//	};
//}

// Example protected route with role-based access
//app.get('/admin', authorizeRoles('admin'), (req, res) => {
//	res.send('Welcome to the admin area');
//});

app.get('/jwt-protected', verifyJWT, (req, res) => {
	res.send(`Hello, ${req.user.username}. You accessed this protected route as an Admin.`);
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));
