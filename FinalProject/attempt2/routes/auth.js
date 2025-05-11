const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();
          
router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/', authController.isLoggedIn);

router.get('/update', authController.isLoggedIn, (req, res) => {
    res.render('update'); // No update logic, just show the form
  });

router.get('/about', authController.isLoggedIn, (req, res) => {
    res.render('about');
  });  

router.put('/update', authController.isLoggedIn, authController.update); //finish this bs by tonight 4/1

router.delete('/delete', authController.isLoggedIn, authController.delete);// this too if you want a clear mind and week

module.exports = router;