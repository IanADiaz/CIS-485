const express = require('express');
const notesController = require('../controllers/notesController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/insertNotes', notesController.isLoggedIn, upload.single('file'), notesController.insertNotes);

router.get('/download/:fileid', notesController.isLoggedIn, notesController.downloadNote);

router.get('/displayNotes/:subject', notesController.isLoggedIn, notesController.displayNotes);
    
router.get('/updateNotes/:fileid', notesController.renderUpdateNotePage);
router.put('/updateFilename', notesController.isLoggedIn, notesController.updateNotes, (req, res) => {
    if( req.user ) {
        res.render('profile', {
          user: req.user
        });
      } else {
        res.redirect('/login');
      }
});

router.delete('/deleteNotes/:fileid', notesController.isLoggedIn, notesController.deleteNotes);

module.exports = router;