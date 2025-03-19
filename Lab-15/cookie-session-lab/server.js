const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } //set to true if using HTTPS
}));

app.get('/', (req, res) => {
    res.send('Welcome to the cookies lab HomePage');
});

app.get('/setCookie', (req, res) => {
    res.cookie('username', 'student', { maxAge: 900000, httpOnly: true });
    res.send('Cookie has been set!');
});

app.get('/getCookie', (req, res) => {
    const username = req.cookies.username;
    res.send(`Username stored in cookie: ${username} `);
});

app.get('/deleteCookie', (req, res) => {
    res.clearCookie('username');
    res.send('Cookie deleted!');
});

app.get('/login', (req, res) => {
    req.session.user = { username: 'student' };
    res.send('You are logged in');
});

app.get('/profile', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome, ${req.session.user.username} `);
    }
    else {
        res.send('Please log in first');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            return res.send('Error logging out');
        }
        res.clearCookie('connect.sid'); //clear session cookie
        res.send('You have logged out');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




//Below was my attempt at the 'project' for lab 15
//All required files and images are in the public folder

// const express = require('express');
// const cookieParser = require('cookie-parser');
// const session = require('express-session');         //importing modules
// //const path = require('path');
// const app = express();                              //initializing express instance (object used to define routes and middleware)
// const PORT = 3000;

// // Middleware setup
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(session({
//     secret: 'secret-key',
//     resave: false,
//     saveUninitialized: true,
//     // Set maxAge to 5 minutes for demonstration. Change as needed.
//     cookie: { secure: false, maxAge: 300000 },
//     rolling: true  // Reset cookie expiration on every response (NOT IMPORTANT FOR MIDTERM)
// }));

// // Serve static files (for CSS or client-side JS if needed)
// // app.use(express.static(path.join(__dirname, 'public')));

// // Home page
// app.get('/', (req, res) => {
//     res.send(`
//         <h1>Welcome to the Cookies Lab HomePage</h1>
//         <p><a href="/login">Login</a></p>
//         `);
// });

// // Login page (GET)
// app.get('/login', (req, res) => {
//     // If already logged in, redirect to profile
//     if (req.session.user) {
//         return res.redirect('/profile');
//     }
//     // Simple login form
//     res.send(`
//         <h1>Login</h1>
//         <form method="POST" action="/login">
//             <input type="text" name="username" placeholder="Enter username" required />
//             <input type="password" name="password" placeholder="Enter password" required />
//             <button type="submit">Login</button>
//         </form>
//     `);
// });

// // Handle login form submission
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     // Making this only accept credentials where username is 'student' and password is '123'
//     if (username === 'student' && password === '123') {
//         req.session.user = { username };
//         // Default preferences if not set
//         req.session.preferences = { backgroundColor: '#ffffff', textSize: '16px' };
//         return res.redirect('/profile');
//     }
//     else {
//         return res.status(400).send(`
//             Invalid credentials. 
//             <a href="/login">Try again</a>
//         `);
//     }
// });

// // Profile page showing user info and preferences
// app.get('/profile', (req, res) => {
//     if (req.session.user) {
//         const username = req.session.user;
//         const { backgroundColor, textSize } = req.session.preferences;
//         res.send(`
//             <h1>Welcome, ${username}</h1>
//             <p>Your current preferences are:</p>
//             <ul>
//                 <li>Background Color: ${backgroundColor}</li>
//                 <li>Text Size: ${textSize}</li>
//             </ul>
//             <p><a href="/preferences">Update Preferences</a></p>
//             <p><a href="/logout">Logout</a></p>
//             <div style="background-color:${backgroundColor}; font-size:${textSize}; padding:20px; margin-top:20px;">
//                 This is your personalized content.
//             </div>
//         `);
//     } else {
//         res.send('Please log in first. <a href="/login">Login</a>');
//     }
// });

// // Preferences page - display a form to update preferences
// app.get('/preferences', (req, res) => {
//     if (req.session.user) {
//         const { backgroundColor, textSize } = req.session.preferences;
//         res.send(`
//             <h1>Update Preferences</h1>
//             <form method="POST" action="/preferences">
//                 <label>Background Color:</label>
//                 <input type="color" name="backgroundColor" value="${backgroundColor}" required /><br/><br/>
//                 <label>Text Size (e.g., 16px):</label>
//                 <input type="text" name="textSize" value="${textSize}" required /><br/><br/>
//                 <button type="submit">Save Preferences</button>
//             </form>
//             <p><a href="/profile">Back to Profile</a></p>
//         `);
//     } else {
//         res.send('Please log in first. <a href="/login">Login</a>');
//     }
// });

// // Handle preferences form submission
// app.post('/preferences', (req, res) => {
//     if (req.session.user) {
//         const { backgroundColor, textSize } = req.body;
//         req.session.preferences = { backgroundColor, textSize };
//         res.redirect('/profile');
//     } else {
//         res.send('Session expired. <a href="/login">Login</a>');
//     }
// });

// // Logout route destroys the session and clears the cookie
// app.get('/logout', (req, res) => {
//     req.session.destroy(error => {
//         if (error) {
//             return res.send('Error logging out');
//         }
//         res.clearCookie('connect.sid'); // Clear session cookie
//         res.send('You have logged out. <a href="/">Home</a>');
//     });
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
