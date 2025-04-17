const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const app = express();
const PORT = 3000;


const SECRET = 'my_super_secret_key';


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


const users = [];


app.use((req, res, next) => {
	if (req.path.startsWith('/account/')) {
    	return next();
	}

	const token = req.cookies.token;
  	if (!token) {
    		const returnUrl = encodeURIComponent(req.originalUrl);
    		return res.redirect(`/account/login-page?returnUrl=${returnUrl}`);
  	}
  	try {
    		jwt.verify(token, SECRET);
    		next();
	} 
	catch (error) {
    		const returnUrl = encodeURIComponent(req.originalUrl);
    		return res.redirect(`/account/login-page?returnUrl=${returnUrl}`);
  	}
});

app.get('/home', (req, res) => {
	res.send('<h1>Home Page</h1><p>Welcome to the home page.</p>');
});

app.get('/about', (req, res) => {
	res.send('<h1>About Page</h1><p>About Us.</p>');

app.get('/contact', (req, res) => {
	res.send('<h1>Contact Page</h1><p>Contact page.</p>');
});

app.get('/account/login-page', (req, res) => {
	const returnUrl = req.query.returnUrl || '/home';
  	res.send(`
    		<h1>Login</h1>
    		<form method="POST" action="/account/login">
      		<input type="hidden" name="returnUrl" value="${returnUrl}" />
      		<label for="username">Username:</label>
      		<input type="text" id="username" name="username" required /><br/>
      		<label for="password">Password:</label>
      		<input type="password" id="password" name="password" required /><br/>
      		<button type="submit">Login</button>
    		</form>
  	`);
});

app.get('/account/sign-up-page', (req, res) => {
  res.send(`
    <h1>Sign Up</h1>
    <form method="POST" action="/account/sign-up">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required /><br/>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required /><br/>
      <button type="submit">Sign Up</button>
    </form>
  `);
});

app.post('/account/sign-up', async (req, res) => {
  	const { username, password } = req.body;
	const existingUser = users.find(user => user.username === username);
  	if (existingUser) {
        return res.status(400).send('Username already exists.');
 	}
  	
	const hashedPassword = await bcrypt.hash(password, 10);
  	users.push({ username, password: hashedPassword });
  	res.status(201).send('User created.');
});

app.post('/account/login', async (req, res) => {
	const { username, password, returnUrl } = req.body;
  	const user = users.find(user => user.username === username);
  	if (!user) {
    		return res.status(400).send('Invalid username or password.');
  	}
  	
	const match = await bcrypt.compare(password, user.password);
  	
	if (!match) {
    		return res.status(400).send('Invalid username or password.');
  	}
  	
	const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  	res.cookie('token', token, { httpOnly: true, secure: false });
  	res.redirect(returnUrl || '/home');
});

app.post('/account/logout', (req, res) => {
  	res.clearCookie('token');
  	res.redirect('/account/login-page');
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

