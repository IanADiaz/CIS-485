import express from 'express';
import multer from 'multer';
import path from 'path';
import asciify from 'asciify-image';
import fs from 'fs';
import stripAnsi from 'strip-ansi';

const app = express();
const port = 3000;

const upload = multer({dest:'uploads/'});

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.send(`
		<!DOCTYPE html>
		<link rel="stylesheet" href="style.css">
		<h1>Upload Image Here</h1>
		<form action="ascii" method="POST" enctype="multipart/form-data">
			<input type="file" name="image" accept="image/*" required>
			<button type="submit">Convert to ASCII</button>
		</form>
		</html>
		`);
});

app.post('/ascii', upload.single('image'), async (req, res) => {
	if(!req.file) {
		return res.status(400).send("No File Uploaded.");
	}
	
	const filePath = req.file.path;
	//const options = {fit: 'box', width: 500, height: 100};
	const options = {fit: 'width', width: 100};


	try{
		const asciiArt = await asciify(filePath, options);
		const output = stripAnsi(asciiArt);
		await fs.promises.unlink(filePath);
		res.send(`<pre>${output}</pre><br><a href="/">Upload Another: </a>`);
	}
	catch (error) {
		console.error(error);
		res.status(500).send("Error processing image.");
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
