const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');	
const path = require('path');
//const redis = require('redis');
//const RedisStore = require('connect-redis').default;

//const store = new RedisStore({client});
//const client = redis.createClient();
//client.connect().catch(console.error);

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(session({						//middleware that fires for every request made to server
	//store: new RedisStore({ client }),
	secret: 'secret-key',		//key that is used to sign the session ID cookie
	resave: false,				//create a new session even if its the same user/browser for every request to the server
	saveUninitialized: false,	
	cookie: { secure: false }
}));

app.get('/themeToggle', (req, res) => {
	const currentTheme = req.cookies.theme || 'light';
	const setTheme = currentTheme === 'light' ? 'dark' : 'light';
	res.cookie('theme', setTheme, { maxAge: 90000000 });
	res.sendStatus(200);
});

app.get('/home', (req, res) => {
	res.send('Welcome to the home page');
	// res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
	console.log('Server is running on http://localhost:3000');
});

app.get('/setCookie', (req, res) => {
	res.cookie('username', 'student', { maxAge: 900000, httpOnly: true });
	res.send('Cookie has been set!');
});

app.get('/getCookie', (req, res) => {
	const username = req.cookies.username;
	res.send(`Username stored in cookie: ${username}`);
});

app.get('/deleteCookie', (req, res) => {
	res.clearCookie('username');
	res.send('Cookie deleted');
});

app.get('/login', (req, res) => {
	req.session.user = { username: 'student' };
	res.send('You are logged in');
});

app.get('/profile', (req, res) => {
	if (req.session.user) {
		res.send(`Welcome, ${req.session.user.username}`);	
	}
	else {
		res.send('Please log in first');
	}
});

app.get('/logout', (req, res) => {
	req.session.destroy(error => {
		if (error) {
			return res.send('Error logging out');
		}
		res.clearCookie('connect.sid');
		res.send('You have logged out');
	});
});
