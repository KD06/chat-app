const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath))

let count =0;

io.on('connection', (socket) => {
    console.log('New web socket connection');

    socket.emit("message", "Welcome...!"); //use this emit for only connected user/window
    socket.broadcast.emit('message', 'A new user has joined!'); //use this broadcast emit for all users/windows excepted connected one request coming from

    socket.on('sendMessage', (message)=>{
        io.emit('message', message); // send it to all the users/windows
    })

    socket.on('disconnect', ()=>{
        io.emit('message', "A user disconnected");
    })
})

server.listen(port, ()=>{
    console.log(`Server is upon port ${port}!`)
})