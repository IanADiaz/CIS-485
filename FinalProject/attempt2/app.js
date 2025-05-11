dotenv = require('dotenv').config({ path: './.env'});
const express = require("express");
const session = require('express-session');
const multer = require('multer');
const path = require('path');
//const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const  http = require('http');
const pool = require('./db.js');
// const fileUpload = require('express-fileupload');
const app = express();
const methodOverride = require('method-override');
const hbs = require('hbs');
const handlebars = require('handlebars');
const jwt = require('jsonwebtoken');
const axios = require('axios')

hbs.registerHelper('encodeURI', function (str) {
  return encodeURIComponent(str);
});
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (from HTML forms)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
// app.use(fileUpload());
app.use(methodOverride('_method'));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/notesController', require('./routes/notes'));
//app.use('/chatsController', require('./routes/chats'));
app.use('/chat', require('./routes/chats'));

//this is just for testing purposes-------------------------
console.log({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DATABASE_PORT,
  portType: typeof process.env.DATABASE_PORT
});
console.log({
  password: process.env.DATABASE_PASSWORD,
  passwordType: typeof process.env.DATABASE_PASSWORD
});

//--------------------------------------------------------

  const server = http.createServer(app);
  const io = new Server(server);
io.use((socket, next) => {
    const token = socket.handshake.query.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        socket.user = decoded;
        next();
    });
});


io.on("connection", (socket) => {
  const token = socket.handshake.query.token;
  let user = null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    user = decoded;
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    socket.disconnect();
    return;
  }

  socket.on("joinRoom", async ({ subject }) => {
    socket.join(subject);
    socket.subject = subject;

    socket.emit("message", {
      username: "System",
      message: `Welcome to the ${subject} chat room!`
    });

    socket.to(subject).emit("message", {
      username: "System",
      message: `${user.username} joined the chat.`
    });

    try {
      const history = await pool.query(`
        SELECT cm.messageid, cm.senderid, cm.message, cm.timesent, cm.replyto, u.username
        FROM chatMessages cm
        JOIN users u ON cm.senderid = u.userid
        WHERE subject = $1 ORDER BY cm.timesent ASC
      `, [subject]);

      for (const msg of history.rows) {
        let replytoUsername = null;

        if (msg.replyto) {
          const replyRes = await pool.query(
            "SELECT u.username FROM chatMessages cm JOIN users u ON cm.senderid = u.userid WHERE cm.messageid = $1",
            [msg.replyto]
          );
          if (replyRes.rows.length > 0) {
            replytoUsername = replyRes.rows[0].username;
          }
        }

        socket.emit("message", {
          ...msg,
          replytoUsername
        });
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  });

  socket.on("chatMessage", async ({ subject, message, replyTo }) => {
    try {
      const res = await axios.post('http://localhost:8000/chat/', {
        subject,
        message,
        replyto: replyTo
      }, {
        headers: {
          Cookie: `jwt=${token}`
        }
      });

      const saved = res.data;
      let replytoUsername = null;

      if (saved.replyto) {
        const replyRes = await pool.query(
          "SELECT u.username FROM chatMessages cm JOIN users u ON cm.senderid = u.userid WHERE cm.messageid = $1",
          [saved.replyto]
        );
        if (replyRes.rows.length > 0) {
          replytoUsername = replyRes.rows[0].username;
        }
      }

      io.to(subject).emit("message", {
        messageid: saved.messageid,
        senderid: saved.senderid,
        message: saved.message,
        timesent: saved.timesent,
        replyto: saved.replyto,
        username: user.username,
        replytoUsername
      });
    } catch (err) {
      console.error("Message send failed:", err.response?.data || err.message);
    }
  });

  socket.on("editMessage", async ({ messageid, newMessage }) => {
    try {
      const res = await axios.put(`http://localhost:8000/chat/api/message/${messageid}`, {
        message: newMessage
      }, {
        headers: {
          Cookie: `jwt=${token}`
        }
      });

      io.to(socket.subject).emit("messageEdited", {
        messageid,
        message: res.data.message
      });
    } catch (err) {
      console.error("Edit failed:", err.response?.data || err.message);
    }
  });

  socket.on("deleteMessage", async ({ messageid }) => {
    try {
      await axios.delete(`http://localhost:8000/chat/api/message/${messageid}`, {
        headers: {
          Cookie: `jwt=${token}`
        }
      });

      io.to(socket.subject).emit("messageDeleted", { messageid });
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
    }
  });

  socket.on("disconnect", () => {
    socket.to(socket.subject).emit("message", {
      username: "System",
      message: `${user.username} has left the chat.`
    });
  });
});


app.use((req, res) => {res.status(404).render('404');});
app.use((req, res) => {res.status(404).render('401');});


const PORT = 8000;


server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// })


