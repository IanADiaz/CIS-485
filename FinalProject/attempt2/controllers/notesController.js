const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const pool = require('../db');
const JWT_SECRET = process.env.JWT_SECRET;

// exports.isLoggedIn = async (req, res, next) => {
//     if (req.cookies.jwt && req.cookies.jwt !== 'logout') {
//       try {
//         const decoded = await promisify(jwt.verify)(
//           req.cookies.jwt, 
//           process.env.JWT_SECRET
//         );
//         console.log(decoded) //remove later
  
//         const result = await pool.query('SELECT * FROM users WHERE userid = $1', [decoded.userid]);
  
//         if (!result.rows || result.rows.length === 0) {
//           // return next();
//           return res.status(401).send('Unauthorized');
//         }
  
//         req.user = result.rows[0];
//         // return next();
  
//       } catch (error) {
//         console.log(error);
//         //return next(); //change to res.statsus(401).send('Unauthorized') if you want to block access
//         return res.status(401).send('Unauthorized');
//       }
//     } 
//     // else {
//       // next(); //no token or set to 'logout'
//     // }
// };

exports.isLoggedIn = async (req, res, next) => {
  try {
    // const publicPaths = ['/', '/login', '/register', '/401', '/404', '/about'];
    // if (publicPaths.includes(req.path)) return next();
    // get token from cookie
    const token = req.cookies?.jwt;
    if (!token) {
      // return res.redirect("/login");
      res.locals.user = null;
      req.user = null;
      if (isProtectedRoute(req.path)) return res.redirect("/401");
      return next();
    }

    //  verify 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.userid;

    // get user from database
    const result = await pool.query("SELECT * FROM users WHERE userid = $1", [userid]);
    const user = result.rows[0];

    if (!user) {
      // return res.redirect("/login");
      res.locals.user = null;
      req.user = null;
      if (isProtectedRoute(req.path)) return res.redirect("/401");
      return next();
    }

    // attatch user to request for later access
    req.user = user;
    res.locals.user = user; // for  {{#if user}}...
    next();

  } catch (err) {
    console.error("JWT verification failed or Invalid Token:", err.message);
    res.clearCookie('jwt'); // Clear the cookie if token is invalid
    res.locals.user = null;
    req.user = null;
    // return res.redirect("/401");
    if (isProtectedRoute(req.path)) return res.redirect("/401");
    return next();
  }
};
function isProtectedRoute(path) {
  const publicPaths = ['/', '/login', '/register', '/401', '/404', '/about'];
  return !publicPaths.includes(path.toLowerCase());
}

const getNotesBySubject = async (userid, subject) => {
  const result = await pool.query(
    'SELECT fileid, subject, filename, filesize, mimetype, uploadtime FROM uploadedfiles WHERE userid = $1 AND LOWER(subject) = LOWER($2) ORDER BY uploadtime DESC',
    [userid, subject]
  );
  return result.rows;
};

exports.displayNotes = async (req, res) => {
    try {
        const subject = req.params.subject;
        const userid = req.user.userid;

        const files = await getNotesBySubject(userid, subject);

        console.log('File retrieved:', files); //remove later
  
        res.status(200).render('subjectNotes', { files, subject }); // send "files" array to handlebars view  | just added ".status(200)" 5/6/2025, need to test if it works in console
  
        } catch (error) {
        //console.error('Error loading uploaded files:', error);
        res.status(401).send('Acess Denied');
    }
};


  exports.insertNotes = async (req, res) => {
    try {
      const token = req.cookies.jwt;
  
      if (!token || token === 'logout') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userid = decoded.userid;
  
      const { subject } = req.body;
      const file = req.file;
  
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      // Multer fields
      const filename = file.originalname;
      const filesize = file.size;
      const mimetype = file.mimetype;
      const filedata = file.buffer;
  
      await pool.query(
        `INSERT INTO uploadedfiles (userid, subject, filename, filesize, mimetype, filedata) VALUES ($1, $2, $3, $4, $5, $6)`,
        [userid, subject, filename, filesize, mimetype, filedata]
      );

      const files = await getNotesBySubject(userid, subject);
  
      // res.status(201).render('subjects', { message: 'File uploaded successfully' });
      res.status(201).render('subjectNotes', { files, subject, message: 'File uploaded successfully'});
      
    } catch (error) {
      console.error('Error uploading note:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.downloadNote = async (req, res) => {
    const fileid = req.params.fileid;
  
    try {
      const result = await pool.query(
        'SELECT filename, mimetype, filedata FROM uploadedfiles WHERE fileid = $1 AND userid = $2',
        [fileid, req.user.userid]  // so users can only access their own files
      );
  
      if (result.rows.length === 0) {
        return res.status(404).send('File not found');
      }
  
      const file = result.rows[0];
  
      res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
      res.setHeader('Content-Type', file.mimetype);
      res.send(file.filedata);
  
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).send('Internal server error');
    }
  };
  
  exports.deleteNotes = async (req, res) => {
    try {
        const fileid = req.params.fileid;
        const userid = req.user.userid;
        const subject = req.body.subject;
  
        await pool.query('DELETE FROM uploadedfiles WHERE fileid = $1 AND userid = $2', [fileid, userid]);
  
        res.status(200).redirect(`/notesController/displayNotes/${encodeURIComponent(subject)}`); // Redirect to subjects page after deletion
  
    } catch (error) {
      console.error('Error during file deletion:', error);
      res.status(500).render('subjectNotes', {
        message: 'Server error during file deletion'
      });
    }
  };


exports.updateNotes = async (req, res) => {
    const { fileid, newfilename, subject } = req.body;
    console.log("BODY:", req.body); // helpful for debugging
    // Step 1: Decode JWT to get user ID
    const token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1];
    console.log("TOKEN:", token);
    if (!token) return res.status(401).send("Unauthorized.");
  
    let userid;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded JWT:", decoded);
        userid = decoded.userid;
    } catch (err) {
        console.error("JWT Error:", err.message);
        return res.status(401).send("Invalid or expired token.");
    }
  
    // Step 2: Validate inputs
    if (!fileid || !newfilename) {
      return res.status(400).send("Missing file ID or new filename.");
    }
  
    if (newfilename.includes('/') || newfilename.includes('..')) {
      return res.status(400).send("Invalid filename.");
    }
  
    try {
      // Step 3: Check ownership and get old filename
      const result = await pool.query(
        'SELECT filename FROM uploadedfiles WHERE fileid = $1 AND userid = $2',
        [fileid, userid]
      );
  
      if (result.rowCount === 0) {
        return res.status(403).send("Unauthorized: You do not own this file.");
      }
  
      const oldFilename = result.rows[0].filename;
      const ext = oldFilename.substring(oldFilename.lastIndexOf('.'));
      const safeNewFilename = newfilename + ext;
  
      // Step 4: Update filename in database only
      await pool.query(
        'UPDATE uploadedfiles SET filename = $1 WHERE fileid = $2 AND userid = $3',
        [safeNewFilename, fileid, userid]
      );
  
      // Step 5: Redirect back to notes by subject
      res.redirect(`/notesController/displayNotes/${encodeURIComponent(subject)}`);
    } catch (err) {
      console.error("Error updating filename:", err);
      res.status(500).send("Something went wrong while renaming the file.");
    }
  };

  exports.renderUpdateNotePage = async (req, res) => {
    const fileid = req.params.fileid;
    const token = req.cookies?.jwt;
    if (!token) return res.status(401).send("Missing auth token");
  
    let userid;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userid = decoded.userid;
    } catch (err) {
      return res.status(403).send("Invalid token");
    }
  
    try {
      const result = await pool.query(
        'SELECT fileid, subject, filename FROM uploadedfiles WHERE fileid = $1 AND userid = $2',
        [fileid, userid]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).send("File not found or access denied.");
      }
  
      const file = result.rows[0];
      res.render('updateNotes', { file }); // <-- Sends single file to the view
    } catch (err) {
      console.error("DB error:", err);
      res.status(500).send("Server error");
    }
  };
