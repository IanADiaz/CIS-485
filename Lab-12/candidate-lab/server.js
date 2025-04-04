const express = require('express');
const fs = require('fs');
//const { platform } = require('os');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let candidates = JSON.parse(fs.readFileSync('candidates.json', 'utf8'));

app.get('/', (req, res) => {
	res.send('Welcome to the Fictitious Political Candidates Server');
});

app.get('/candidates', (req, res) => {
	// let doubleFilter = candidates;
	// const { party, platform } = req.query;

	// if (party) {
	// 	doubleFilter = doubleFilter.filter(c => c.party === party);
	// }
	// if (platform) {
	// 	doubleFilter = doubleFilter.filter(c => c.platform === platform)
	// }
	// else {
	// 	res.status(500).json({ message: 'No candidates found' });
	// }
	// res.json(doubleFilter);
	
	let candidatesHTML = candidates.map(candidate =>
		`<div style="border: 1px solid black; padding: 10px; margin: 10px;">
			<h2>${candidate.name}</h2>
			<p><strong>Party:</strong> ${candidate.party}</p>
			<p><strong>Platform:</strong> ${candidate.platform}</p>
			<p><strong>Slogan:</strong> ${candidate.slogan}</p>
		</div>`).join('');
		
	res.send(
		`<html>
			<head>
				<title>Candidate List</title>
				<style>
					body {
						font-family: Arial, sans-serif;
					}
					.candidate-box {
						display: flex;
						flex-wrap: column;
						border: 1px solid #ccc;
						padding: 15px;
						margin: 10px 0;
						background-color: #f9f9f9;
						border-radius: 5px;
					}
					.candidate-box h2 {
						margin: 0 0 10px;
						font-size: 24px;
					}
				</style>
			</head>
			<body>
				<h1>All Politcial Candidates</h1>
				${candidatesHTML}
			</body>
		</html>
		`);
});

app.get('/addCandidate', (req, res) => {
	res.send(`
	<html>
	<head>
		<title>Add A New Candidate</title>
	</head>

	<body>
		<h1> Add a New Political Candidate </h1>
		<form action="/addCandidate" method="POST">
			<label for="name"> Name: </label><br>
			<input type="text" id="name" name="name"><br>

			<label for="party"> Party: </label><br>
			<input type="text" id="party" name="party"><br>

			<label for="platform"> Platform: </label><br>
			<input type="text" id="platform" name="platform"><br>

			<label for="slogan"> Slogan: </label><br>
			<input type="text" id="slogan" name="slogan"><br><br>

			<input type="submit" value="Submit">
		</form>
	</body>
	</html>	
	`);
});

app.post('/addCandidate', (req, res) => {
	const { name, party, platform, slogan } = req.body;

	if (!name || !party || !platform || !slogan) {
		return res.status(400).send(
			`
			<html>
				<body>
					<h1> 400 Bad Request </h1>
					<p> All fields must be filled out. (name, party, platform, slogan) </p>
					<a href="/addCandidate"> Go back to the form </a>				
				</body>
			</html>
			`
		);
	}
	const newCandidate = {
		id: candidates.length + 1,
		name: name,
		party: party,
		platform: platform,
		slogan: slogan
	};
	candidates.push(newCandidate);

	fs.writeFileSync('candidates.json', JSON.stringify(candidates, null, 2));

	res.redirect('/candidates');
});

app.get('/candidates/:id', (req, res) => {
	const candidateID = parseInt(req.params.id);	//changing params to query breaks this route from working properly

	if (isNaN(candidateID)) {
		return res.status(400).send(
			`
			<html>
				<body>
					<h1>400 Bad Request</h1>
					<p>Invalid Candidate ID. Please use a numeric value ID.</p>
					<a href='/candidates'> Go back to candidate list </a>
				</body>
			</html>
			`);
	}

	const candidate = candidates.find(c => c.id === candidateID);

	if (!candidate) {
		return res.status(404).send(
			`
			<html>
				<body>
					<h1>404 Not Found</h1>
					<p>Candidate with ID ${candidateID} was not found.</p>
					<a href="/candidates">Go back to candidate list</a>
				</body>
			</html>
			`);	
	}
	res.send(
		`
		<html>
			<body>
				<h1> Candidate Details </h1>
				<h2>${candidate.name}</h2>
				<p><strong>Party:</strong> ${candidate.party}</p>
				<p><strong>Platform:</strong> ${candidate.platform}</p>
				<p><strong>Slogan:</strong> ${candidate.slogan}</p>
				<a href="/candidates">Go back to candidate list</a>
			</body>
		</html>
		`);

});

app.use((error, request, response, next) => {
	console.error(error.stack);
	response.status(500).send(
		`
		<html>
			<body>
				<h1> 500 Internal Server Error </h1>
				<p>Something went wrong with the server lol</p>
				<a href="/candidates">Go back to candidate list</a>
			</body>
		</html>


		`);
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/search', (req, res) => {
	const { party, platform } = req.query;
	let filteredCandidates = candidates;
	
	if (party) {
		filteredCandidates = filteredCandidates.filter(c => c.party === party);
	}
	if (platform) {
		fildteredCandidates = filteredCandidates.filter(c => c.platform.includes(platform));
	}
	if (filteredCandidates.length > 0) {
		res.json(filteredCandidates);
	}
	else {
		res.status(404).json({ message: 'No candidates found' });
	}
});

app.post('/filter', (req, res) => {
	const {platform, slogan} = req.body;
	let filteredCandidates = candidates;

	if (platform) {
		filteredCandidates = filteredCandidates.filter(c => c.platform.includes((platform)));	
	}
	if (slogan) {
		filteredCandidates = filteredCandidates.filter(c => c.slogan.includes(slogan));
	}
	if (filteredCandidates.length > 0) {
		res.json(filteredCandidates);
	}
	else {
		res.status(404).json({ message: 'No Candidates found' });
	}
});

