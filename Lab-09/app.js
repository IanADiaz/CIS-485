// const express = require ('express');
// const fs = require('fs')
// const app = express();

// app.use(express.json());

// ////const fortunes = JSON.parse(fs.readFileSync('fortunes.json', 'utf8'));

// app.get('/', (req, res) => {
// 	res.send('Welcome to the fortunes API');
// });

// app.get('/fortunes', (req, res) => {
// 	const index = parseInt(req.query.count) | Math.floor(Math.random()*fortunes.length);
// 	const selectedFortunes = fortunes[index];
// 	////const count = parseInt(req.query.count);
// 	////if (!isNaN && count < 0) {
// 	////	res.json(fortunes.slice(0, count));
// 	////}
// 	////else {
// 	////	const index = Math.floor(Math.random()*fortunes.length);
// 	////	res.json(fortunes[index]);
// 	////}
// 	res.json(selectedFortunes);
// });

// app.post('/submit', (req, res) => {
// 	const { name, message } = req.body;
// 	if (!name || !message) {
// 		return res.status(400).json({ error: 'Name and Message are required' });
// 	}
// 	res.json({ success: true, response: `Thanks ${name}!, Your Message: "${message}"`})
// });

// const port = 3000;
// app.listen(port, () => {
// 	console.log(`Server running on http://localhost:${port}`)
// });


const express = require('express');
const fs = require('fs')
const app = express();
app.use(express.json());

const fortunes = JSON.parse(fs.readFileSync('fortunes.json', 'utf8'));
// Route to get fortunes based on the query parameter `count`
app.get('/fortunes/:id?', (req, res) => {
	let id =  req.query.id;
	if (id !== undefined) {
		id = parseInt(id);
		if (id >= 0 && id < fortunes.length) {
		  return res.json(fortunes[id]);
		} else {
		  return res.status(404).json({ error: 'Fortune not found' });
		}
	  }


	// Parse the count parameter; default to 1 if not provided
  	const count = parseInt(req.query.count) || 1;
  	const selectedFortunes = [];
  	for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    selectedFortunes.push(fortunes[randomIndex]);
  }
  res.json(selectedFortunes);
});

app.post('/addFortune', (req, res) => {
	const { newFortune } = req.body;
  	if (!newFortune) {
		return res.status(500).json({ error: 'Please provide a new fortune' });
  	}
  	fortunes.push(newFortune);
  	fs.writeFile('fortunes.json', JSON.stringify(fortunes), (err) => {
		if (err) {
	  		return res.status(500).json({ error: 'An error occurred while saving your new fortune' });
		}
	res.json({ success: true, response: `Thanks for the new fortune, you added: "${newFortune}"` });
  	});
});

// Route to accept POST data and respond with a custom message
app.post('/submit', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }
  res.json({ success: true, response: `Thanks, ${name}! Your message was: "${message}"` });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
