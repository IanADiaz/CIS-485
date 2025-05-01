// const express = require('express');
// const db = require('../database');
// const router = express.Router();
// // Get all users
// router.get('/', async (req, res) => {
// try {
//     const result = await db.query('SELECT * FROM users');
// res.json(result.rows);
// } catch (error) {
// res.status(500).json({ error: 'Failed to fetch users' });
// }
// });

// // Add a user
// router.post('/', async (req, res) => {
//     const { name, email } = req.body;
//     try {
//     const result = await db.query(
//     'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
//     [name, email]
//     );
//     res.status(201).json(result.rows[0]);
//     } catch (error) {
//     res.status(500).json({ error: 'Failed to add user' });
//     }
//     });

// module.exports = router;

// src/routes/users.js
const express = require('express');
const db = require('../database');
const router = express.Router();

// Handler: fetch all users
const getAllUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Handler: create a new user
const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
};

// Register with router (for Express)
router.get('/', getAllUsers);
router.post('/', createUser);

// Export both for different consumers
module.exports = {
  router,
  routes: [
    { method: 'get', path: '/', handler: getAllUsers },
    { method: 'post', path: '/', handler: createUser }
  ]
};
