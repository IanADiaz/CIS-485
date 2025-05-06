// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// app.use(express.static('public'));

// app.get('/', (req, res) => res.send('Server is running'));


// io.on('connection', socket => {
//     //socket.on('chat message', msg => {
//         //io.emit('chat message', msg);
//         //socket.emit('chat message', msg);
//     //});
//     //console.log('Client connected:', socket.id);
//     socket.on('chat message', ({user, text}) => {
//         io.emit('chat message', {user, text});
//     });
// });

// const histories = {};
// io.on('connection', socket => {
//     socket.on('join room', room => {
//         socket.join(room);
//         if (!histories[room]) histories[room] =[];
//         socket.emit('previous messages', histories[room]);
//     });
//     socket.on('chat message', ({user, text, room}) => {
//         const msg = {user, text, time: Date.now() };
//         if (!histories[room]) histories[room] = [];
//         histories[room].push(msg);
//         io.to(room).emit('chat message', msg);
//     });
// });

// const PORT = 3000;
// server.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => res.send('Server is running'));

const histories = {};

io.on('connection', socket => {
    console.log('Client connected:', socket.id);

    socket.on('join room', room => {
        socket.join(room);
        if (!histories[room]) histories[room] = [];
        socket.emit('previous messages', histories[room]);
    });

    socket.on('chat message', ({ user, text, room }) => {
        const msg = { user, text, time: Date.now(), room };
        if (!histories[room]) histories[room] = [];
        histories[room].push(msg);
        io.to(room).emit('chat message', msg);
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
