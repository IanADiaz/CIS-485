const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json());

app.use(session({
	secret: '12345',
	resave: false,
	saveUnitinalized: true,
	cookie: { secure: false }
}));

const users = {
	user1: { password: "password", role: "admin" },
	user2: { password: "pass", role: "user" }
};

app.post('/session-login', (req, res) => {
	const {username, password} = req.body;

	if (users[username] && users[username].password === password) {
		req.session.user = username;
		const role = users[username].role;
		req.session.role = role;
		res.send(`Logged in as ${username}, privelege: ${role}`);
	}
	else {
		res.status(401).send('Invalid credentials');
	}
});

app.post('/session-logout', (req, res) => {
	req.session.destroy();
	res.send('Logged Out');
});

function requireLogin(req, res, next) {
	if (req.session.user && req.session.role === 'admin') {
		next();
	}
	else {
		res.status(401).send('Login first with admin priveleges');
	}
}

app.get('/session-protected', requireLogin, (req, res) => {
	res.send(`Hello, ${req.session.user}. You accessed this protected route`);
});

app.listen(3002, () => console.log('Server running on http://localhost:3002'));

