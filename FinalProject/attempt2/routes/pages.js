const express = require('express');
const authController = require('../controllers/auth');
const notesController = require('../controllers/notesController');


const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
  console.log('Cookies received on GET /:', req.cookies);

  // const showExpiredMessage = req.cookies.tokenExpired === '1';
  const showExpiredMessage = req.query.expired === '1';

  console.log('showExpiredMessage:', showExpiredMessage);

  // res.clearCookie('tokenExpired'); 

  res.render('index', {
    user: req.user,
    showExpiredMessage
  });
});
// router.get('/', authController.checkUser, (req, res) => {
//   res.render('index', {
//     user: req.user  
//   });
// });

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/profile', authController.isLoggedIn, (req, res) => {
  //console.log(req.user);
  if( req.user ) {
    res.render('profile', {
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
  
});

router.get('/update', authController.isLoggedIn, (req, res) => {
  if( req.user ) {
    res.render('update', {
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
});


// ------------------------------------------------------------------------------------------------
router.get('/subjects', notesController.isLoggedIn, (req, res) => {
  if( req.user ) {
    res.render('subjects', {
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/uploadNotes', authController.isLoggedIn, (req, res) => {
  if( req.user ) {
    const subject = req.query.subject;
    res.render('uploadNotes', {
      subject,
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
});

// router.get('/updateNotes', authController.isLoggedIn, (req, res) => {
//   if( req.user ) {
//     res.render('updateNotes', {
//       user: req.user
//     });
//   } else {
//     res.redirect('/login');
//   }
// });

// ------------------------------------------------------------------------------------------------

// router.get('/chat', authController.isLoggedIn, (req, res) => {
//   const subject = req.query.subject;
//   if( req.user ) {
//     res.render('chat', {
//       subject,
//       user: req.user
//     });
//   } else {
//     res.redirect('/login');
//   }
// });

// ------------------------------------------------------------------------------------------------

router.get('/about', authController.isLoggedIn, (req, res) => {
  res.render('about', {
    user: req.user
  });
});

// ------------------------------------------------------------------------------------------------

router.get('/401', (req, res) => {
  res.status(401).render('401');
});

router.get('/404', (req, res) => {
  res.status(404).render('401');
});

module.exports = router;