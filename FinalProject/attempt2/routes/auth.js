const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();
          
router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

// router.get('/', authController.isLoggedIn);
router.get('/', authController.isLoggedIn, (req, res) => {
  console.log('Cookies received on GET /:', req.cookies);

  // const showExpiredMessage = req.cookies.tokenExpired === '1';
  const showExpiredMessage = req.query.expired === '1';

  // res.clearCookie('tokenExpired'); 

  res.render('index', {
    user: req.user,
    showExpiredMessage
  });
});

router.get('/update', authController.isLoggedIn, (req, res) => {
    res.render('update'); // No update logic, just show the form
  });

router.get('/about', authController.isLoggedIn, (req, res) => {
    res.render('about');
  });  

router.put('/update', authController.isLoggedIn, authController.update);

router.delete('/delete', authController.isLoggedIn, authController.delete);

module.exports = router;