const express = require('express');
const path = require('path');
const app = express();

// Define the directory for static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up the server to listen on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});
