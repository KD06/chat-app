const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New web socket connection');

    socket.emit("message", "Welcome...!"); //use this emit for only connected user/window
    socket.broadcast.emit('message', 'A new user has joined!'); //use this broadcast emit for all users/windows excepted connected one request coming from

    socket.on('sendMessage', (message, callback)=>{
        const filter = new Filter();

        if(filter.isProfane(message)){
            return callback('Profainity is not allowed');
        }

        io.emit('message', message); // send it to all the users/windows
        callback();
    })

    socket.on('sendLocation', (location, callback)=>{
        socket.broadcast.emit("locationMessage", `https://google.com/maps?q=${location.lat},${location.long}`);
        callback();
    })

    socket.on('disconnect', ()=>{
        io.emit('message', "A user disconnected");
    })
})

server.listen(port, ()=>{
    console.log(`Server is upon port ${port}!`)
})