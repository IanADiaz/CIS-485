const express = require('express');
const basicAuth = require('basic-auth');
const app = express();

//hardcoded credentials
const users = {
	admin: "admin1",
	user: "password",
};

//auth middleware
function basicAuthMiddleware(req, res, next) {
	const user = basicAuth(req);
	if (user && users[user.name] === user.pass) {
		req.user = user.name;
		next();
	}
	else {
		res.set('WWW-Authenticate', 'Basic realm="example"');
		res.status(401).send('Unauthorized');
	}
}

//protected route using middleware
app.get('/basic-protected', basicAuthMiddleware, (req, res) => {
	res.send(`Hello, ${req.user}. You accessed this protected route.`);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
