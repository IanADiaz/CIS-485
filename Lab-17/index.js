const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8000;

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'lab_17',
	password: 'postgres',
	port: 5432,
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('Lab 17, \n Students database with CRUD operations');
});

app.post('/students', async (req, res) => {
	const { fName, lName, dob, gender } = req.body;
	try {
    	const result = await pool.query(
	'INSERT INTO students (fName, lName, dob, gender) VALUES ($1, $2, $3, $4) RETURNING *',
      [fName, lName, dob, gender]
    );
    res.status(201).json(result.rows[0]);
  	} 
  	catch (error) {
    	res.status(500).send(error.message);
  	}
});

app.get('/students', async (req, res) => {
	try {
    	const result = await pool.query('SELECT * FROM students');
    	res.status(200).json(result.rows);
  	} 
  	catch (error) {
    	res.status(500).send(error.message);
  	}
});

app.put('/update/:id', async (req, res) => {
	const { id } = req.params;
	const { fName, lName, dob, gender } = req.body;
	try {
		const result = await pool.query(
			'UPDATE students SET fname = $1, lName = $2, dob = $3, gender = $4 WHERE id = $5 RETURNING *',
			[fName, lName, dob, gender, id]
		);
	res.status(200).json(result.rows[0]);
	}
	catch (error) {
		res.status(500).send(error.message);
	}
}
);

app.delete('/delete/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await pool.query('DELETE FROM students WHERE id = $1', [id]);
		res.status(204).send();
	} 
	catch (error) {
		res.status(500).send(error.message);
	}
});

// app.post('/student-schedule', async (req, res) => {
// 	const { id, fName, lName, DOB, gender } = req.body;
// 	try {
// 	  const result = await pool.query(
// 		'INSERT INTO MedicalLogs (patientID, date, title, description) VALUES ($1, $2, $3, $4) RETURNING *',
// 		[patientID, date, title, description]
// 	  );
// 	  res.status(201).json(result.rows[0]);
// 	} catch (error) {
// 	  res.status(500).send(error.message);
// 	}
//   });
  
//   // Read all logs for a students
//   app.get('/medical-logs/:patientID', async (req, res) => {
// 	const { patientID } = req.params;
// 	try {
// 	  const result = await pool.query('SELECT * FROM MedicalLogs WHERE patientID = $1', [patientID]);
// 	  res.status(200).json(result.rows);
// 	} catch (error) {
// 	  res.status(500).send(error.message);
// 	}
//   });
  
//   // Update
//   app.put('/medical-logs/:patientID/:date/:title', async (req, res) => {
// 	const { patientID, date, title } = req.params;
// 	const { description } = req.body; // Assuming you might want to update the description
// 	try {
// 	  const result = await pool.query(
// 		'UPDATE MedicalLogs SET description = $1 WHERE patientID = $2 AND date = $3 AND title = $4 RETURNING *',
// 		[description, patientID, date, title]
// 	  );
// 	  if (result.rows.length > 0) {
// 		res.status(200).json(result.rows[0]);
// 	  } else {
// 		res.status(404).send('Medical log not found.');
// 	  }
// 	} catch (error) {
// 	  res.status(500).send(error.message);
// 	}
//   });
  
//   // Delete
//   app.delete('/medical-logs/:patientID/:date/:title', async (req, res) => {
// 	const { patientID, date, title } = req.params;
// 	try {
// 	  const result = await pool.query(
// 		'DELETE FROM MedicalLogs WHERE patientID = $1 AND date = $2 AND title = $3',
// 		[patientID, date, title]
// 	  );
// 	  if (result.rowCount > 0) {
// 		res.status(204).send();
// 	  } else {
// 		res.status(404).send('Medical log not found.');
// 	  }
// 	} catch (error) {
// 	  res.status(500).send(error.message);
// 	}
//   });

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
