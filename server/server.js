const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 3000;
const {createMessage,createLocation} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
app.use(express.static(publicPath));
server.listen(port, ()=> {
    console.log(`server is up on port ${port}`);
});
io.on('connection', (socket)=>{
    console.log('New user connected');

    socket.on('join', (param,callback) => {
        if(!isRealString(param.name) || !isRealString(param.room)){
            callback('Name And Room name must be string And required')
        }
        socket.join(param.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,param.name,param.room);
        io.to(param.room).emit('updateUserList', users.getUsersList(param.room));
        socket.emit('newMsg', createMessage('Admin','Welcome to ChatApp'));
        socket.broadcast.to(param.room).emit('newMsg', createMessage('Admin',`${param.name} has joined`));
        callback();
    });
    socket.on('createMessages', (createMsg,callback)=> {
        var user = users.getUser(socket.id);
        if(user && isRealString(createMsg.text)){
            io.to(user.room).emit('newMsg', createMessage(user.name,createMsg.text));
        }
      callback();
    });
    socket.on('createLocationMessage', (coords)=>{
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMsg', createLocation(user.name,coords.latitude,coords.longitude));  
        }      
    });
    socket.on('disconnect',()=> {
                var user = users.removeUser(socket.id);
                if(user){
                    io.to(user.room).emit('updateUserList', users.getUsersList(user.room));
                    io.to(user.room).emit('newMsg', createMessage('Admin',`${user.name} has left`));
                }
            });
});


