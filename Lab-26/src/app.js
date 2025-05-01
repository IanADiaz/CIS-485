const express = require('express');
//const userRoutes = require('./routes/users');
const { router: userRoutes } = require('./routes/users');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use('/users', userRoutes);

app.get('/', (req, res) => {
	res.send('Testing page');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
