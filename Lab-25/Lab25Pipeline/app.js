const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.get('/text', (req, res) => {
	res.send('Testing');
});

app.get('/feature', (req, res) => {
        res.send('This is my feature');
});


PORT = 3000;

app.listen(PORT,() => {
	console.log(`Server running on http://localhost:${PORT}`);
});
