const express = require('express');
const router = express.Router();
const chatsController = require('../controllers/chatsController');



router.get('/chat', chatsController.isLoggedIn, (req, res) => {   //this is used
  const subject = req.query.subject;
  if( req.user ) {
    res.render('chat', {
      subject,
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/:subject', chatsController.isLoggedIn, chatsController.getChatRoom, (req, res) => {
    if( req.user ) {
        res.render('chat', {
          subject: req.params.subject,
          user: req.user,
          token: req.cookies.jwt
        });
      } else {
        res.redirect('/login');
      }
});

router.post('/', chatsController.isLoggedIn, chatsController.createMessage);

router.put('/api/message/:messageid', chatsController.isLoggedIn, chatsController.updateMessage); //this is used

router.delete('/api/message/:messageid', chatsController.isLoggedIn, chatsController.deleteMessage); //this is used

module.exports = router;
