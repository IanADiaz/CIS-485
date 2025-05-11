const pool = require('../db');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// exports.isLoggedIn = async (req, res, next) => {
//     if (req.cookies.jwt && req.cookies.jwt !== 'logout') {
//       try {
//         const decoded = await promisify(jwt.verify)(
//           req.cookies.jwt, 
//           process.env.JWT_SECRET
//         );
  
//         const result = await pool.query('SELECT * FROM users WHERE userid = $1', [decoded.userid]);
  
//         if (!result.rows || result.rows.length === 0) {
//           return next();
//         }
  
//         req.user = result.rows[0];
//         return next();
  
//       } catch (error) {
//         console.log(error);
//         res.status(401).render('login', {
//           message: 'error: Invalid token'
//         });
//         //insert response error message here
//       }
//     } else {
//       next(); //no token or set to 'logout'
//     }
//   };

exports.isLoggedIn = async (req, res, next) => {
  try {
    // get token from cookie
    const token = req.cookies?.jwt;
    if (!token) {
      return res.redirect("/login");
    }

    //  verify 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.userid;

    // get user from database
    const result = await pool.query("SELECT * FROM users WHERE userid = $1", [userid]);
    const user = result.rows[0];

    if (!user) {
      return res.redirect("/login");
    }

    // attatch user to request for later access
    req.user = user;
    res.locals.user = user; // for  {{#if user}}...
    next();

  } catch (err) {
    console.error("JWT verification failed or user fetch error:", err.message);
    return res.redirect("/login");
  }
};

// Extract and verify JWT from cookies
async function verifyToken(req, res) {  //not sure i even need this
    const token = req.cookies.jwt;
    if (!token) return null;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await pool.query('SELECT * FROM users WHERE userid = $1', [decoded.userid]);
      if (result.rows.length === 0) return null;
  
      return result.rows[0]; // Now includes username, email, etc.
    } catch (error) {
      console.error("JWT error:", error.message);
      return null;
    }
  };

exports.getChatRoom = async (req, res) => {

  try {
    const token = req.cookies.jwt;
    if (!token) return res.redirect('/auth/login');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.userid;

    const subject = req.params.subject;

    const userResult = await pool.query('SELECT * FROM users WHERE userid = $1', [userid]);

    if (userResult.rows.length === 0) {
      return res.redirect('/auth/login');
    }

    const user = userResult.rows[0];

    res.render('chat', {
      subject,
      user,
      token
    });
  } catch (err) {
    console.error(err.message);
    res.redirect('/login');
  }
};

// CREATE new message
exports.createMessage = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.userid;

    const { subject, message, replyto } = req.body;

    const result = await pool.query(`
      INSERT INTO chatMessages (senderid, subject, message, timesent, replyto)
      VALUES ($1, $2, $3, NOW(), $4)
      RETURNING *`,
      [userid, subject, message, replyto || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to create message" });
  }
};

// UPDATE message
exports.updateMessage = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.userid;

    const messageid = req.params.messageid;
    const { message } = req.body;

    const check = await pool.query('SELECT * FROM chatMessages WHERE messageid = $1 AND senderid = $2', [messageid, userid]);

    if (check.rows.length === 0) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const result = await pool.query(`
      UPDATE chatMessages SET message = $1 WHERE messageid = $2
      RETURNING *`,
      [message, messageid]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to update message" });
  }
};

// DELETE message
exports.deleteMessage = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.userid;

    const messageid = req.params.messageid;

    const check = await pool.query('SELECT * FROM chatMessages WHERE messageid = $1 AND senderid = $2', [messageid, userid]);

    if (check.rows.length === 0) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await pool.query('DELETE FROM chatMessages WHERE messageid = $1', [messageid]);

    res.status(200).json({ message: "Message deleted" }); 
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to delete message" });
  }
};

