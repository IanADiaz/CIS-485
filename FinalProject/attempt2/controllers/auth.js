const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const pool = require('../db');

//function to log in user
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase();

    if (!email || !password) {
      return res.status(400).render('login', {
        message: 'Please provide an email and password'
      });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (!result.rows || result.rows.length === 0 || !(await bcrypt.compare(password, result.rows[0].password))) {
      return res.status(401).render('login', {
        message: 'Email or Password is incorrect'
      });
    }

    const userid = result.rows[0].userid;
    console.log("Login successful. JWT payload:", { userid });
    const token = jwt.sign({ userid, username:result.rows[0].username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      //httpOnly: true
      httpOnly: false
    }

    res.cookie('jwt', token, cookieOptions);
    
    res.status(200).redirect('/');

  } catch (error) {
    console.log(error);
    res.status(500).render('login', {
      message: 'Server error during login'
    });
  }
};

//function to register user
exports.register = async (req, res) => {
  let { username, password, passwordConfirm, email, gender, genderPronouns} = req.body;

  username = username.toLowerCase();
  email = email.toLowerCase();
  
  try {
    const existingEmail = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
    const existingUsername = await pool.query('SELECT username FROM users WHERE username = $1', [username]);
    const allowedGenders = ["Male", "Female", "Other"];

    if (existingEmail.rows.length > 0) {
      return res.status(400).render('register', {
        message: 'That email is already in use'
      });
    } 
    else if (existingUsername.rows.length > 0) {
      return res.status(400).render('register', {
        message: 'That username is already in use'
      });
    }
    else if (password !== passwordConfirm) {
      return res.status(400).render('register', {
        message: 'Passwords do not match'
      });
    }
    else if (!allowedGenders.includes(gender)) {
      return res.status(400).render('update', {
        message: 'Invalid gender selection.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    await pool.query('INSERT INTO users (username, password, email, gender, genderPronouns) VALUES ($1, $2, $3, $4, $5)', [username, hashedPassword, email, gender, genderPronouns]);

    return res.render('register', {
      message: 'User registered successfully! Redirecting to login...',
      success: true
    });

  } catch (error) {
    console.log(error);
    res.status(500).render('register', {
      message: 'Server error during registration'
    });
  }
};

//function to check if user is logged in
// exports.isLoggedIn = async (req, res, next) => {
//   if (req.cookies.jwt) {
//     try {
//       const decoded = await promisify(jwt.verify)(
//         req.cookies.jwt, 
//         process.env.JWT_SECRET
//       );

//       const result = await pool.query('SELECT * FROM users WHERE userid = $1', [decoded.userid]);

//       if (!result.rows || result.rows.length === 0) {
//         return next();
//       }

//       req.user = result.rows[0];
//       return next();

//     } catch (error) {
//       console.log(error);
//       res.status(401).render('login', {
//         message: 'error: Invalid token'
//       });
//     }
//   } else {
//     //return res.redirect('/'); //no token or set to 'logout'
//     next(); // not sure what this does!!!!!!!!!!
//   }
// };

// exports.isLoggedIn = async (req, res, next) => {
//   try {
//     const publicPaths = ['/', '/login', '/register', '/401'];
//     if (publicPaths.includes(req.path)) return next();
//     // get token from cookie
//     const token = req.cookies?.jwt;
//     if (!token) {
//       // return res.redirect("/login");
//       return next(); //lets users see home page without being logged in
//     }

//     //  verify 
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userid = decoded.userid;

//     // get user from database
//     const result = await pool.query("SELECT * FROM users WHERE userid = $1", [userid]);
//     const user = result.rows[0];

//     if (!user) {
//       // return res.redirect("/login");
//       return next();  //lets users see home page without being logged in
//     }

//     // attatch user to request for later access
//     req.user = user;
//     res.locals.user = user; // for  {{#if user}}...
//     next();

//   } catch (err) {
//     console.error("JWT verification failed or Invalid Token:", err.message);
//     return res.redirect("/401");
    
//   }
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
    // res.clearCookie('jwt'); // Clear the cookie if token is invalid
    res.locals.user = null;
    req.user = null;
    // return res.redirect("/401");
    if (err.name === 'TokenExpiredError') {
      res.clearCookie('jwt'); // Clear the cookie if token is expired
      // if(req.path === '/profile' || req.path === '/update' || req.path === '/subjects' || req.path === '/uploadNotes' || req.path.startsWith('/chat')) {
        // res.cookie('tokenExpired', '1', {maxAge: 5000, httpOnly: false});
        // return res.redirect('/401');
        const seperator = req.path.includes('?') ? '&' : '?';
        const redirectUrl = `${req.path}${seperator}expired=1`;
        res.writeHead(302, { Location: redirectUrl });
        return res.end();
      } 
    // }
    if (isProtectedRoute(req.path)) return res.redirect("/401");
    return next();
  }
};
function isProtectedRoute(path) {
  const publicPaths = ['/', '/login', '/register', '/401', '/404', '/about'];
  const knownPaths = [
    '/', '/login', '/register', '/profile', '/update', '/subjects', '/uploadNotes',
    '/about', '/auth/logout', '/notesController', '/chat'
  ];

  if (!knownPaths.some(p => path.toLowerCase().startsWith(p.toLowerCase()))) {
    return false;
  }
  return !publicPaths.includes(path.toLowerCase());
}

exports.update = async (req, res) => {
  try {
    // Decode the JWT to get the user ID
    
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    
    let { username, password, passwordConfirm, email, gender, genderPronouns} = req.body;
    
    username = username.toLowerCase();
    email = email.toLowerCase();

    const existingUsername = await pool.query('SELECT userid FROM users WHERE username = $1 and userid != $2', [username, decoded.userid]);
    const existingEmail = await pool.query('SELECT userid FROM users WHERE email = $1 and userid != $2', [email, decoded.userid]);
    const allowedGenders = ["Male", "Female", "Other"];
    const allowedPronouns = ["He/Him", "She/Her", "They/Them", ""];

    if (password !== passwordConfirm) {
      return res.status(400).render('update', {
        message: 'Passwords do not match'
      });
    }else if (existingUsername.rows.length > 0) {
      return res.status(400).render('update', {
        message: 'That username is already in use'
      });
    }else if (existingEmail.rows.length > 0) {
      return res.status(400).render('update', {
        message: 'That email is already in use'
      });
    }else if (!allowedGenders.includes(gender)) {
      return res.status(400).render('update', {
        message: 'Invalid gender selection.'
      });
    }else if (!allowedPronouns.includes(genderPronouns)) {
      return res.status(400).render('update', {
        message: 'Invalid pronoun selection.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    await pool.query(
      'UPDATE users SET username = $1, password = $2, email = $3, gender = $4, genderPronouns = $5 WHERE userid = $6',
      [username, hashedPassword, email, gender, genderPronouns, decoded.userid]
    );

    return res.redirect('/profile?updated=1'); 

  } catch (error) {
    console.error('Error during update:', error);
    res.status(500).render('update', {
      message: 'Server error during update'
    });
  }
};

exports.delete = async (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(401).send('Unauthorized: No token provided');
    }
    // Decode the JWT to get the user ID
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    await pool.query('DELETE FROM users WHERE userid = $1', [decoded.userid]);

     res.clearCookie('jwt');

    res.status(200).redirect('/'); // Redirect to home page after deletion

  } catch (error) {
    console.error('Error during account deletion:', error);
    res.status(500).render('profile', {
      message: 'Server error during account deletion'
    });
  }
};

//function to logout user and kill the session
exports.logout = async (req, res) => {
  //res.cookie('jwt', 'logout', {
  //  expires: new Date(Date.now() + 2 * 1000),
  //  httpOnly: true
  //});
  res.clearCookie('jwt'); // Clear the cookie
  res.status(200).redirect('/');
};













