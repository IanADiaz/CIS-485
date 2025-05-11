const { Pool } = require('pg');  // Importing the Pool class from the pg library

// Set up PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: Number(process.env.DATABASE_PORT)
});
// Test the connection to the database
pool.connect((error) => {
    if (error) {
        console.error('Error connecting to PostgreSQL database:', error.message);
        process.exit(1); // Exit if connection fails
    }
    else {
        console.log('Connected to PostgreSQL database successfully!');
    }
});

module.exports = pool; // Export the pool for use in other modules