// Hello World in Nodejs
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const connect=require("./config/database-config")

const app= express();
const server =http.createServer(app);
const io = socketio(server);
const Chat = require('./model/chat');

io.on('connection', (socket) => {
    // console.log('a user connected',socket.id);

    socket.on("join_room",(data)=>{
        console.log('joined room',data.roomid);
        socket.join(data.roomid);
        
    });

    socket.on('msg_send',async(data)=>{
        console.log(data);
        const chat = await Chat.create({
            content: data.msg,
            user: data.username,
            roomId: data.roomid
        })
        io.to(data.roomid).emit('msg_rcvd',data);
    })

    socket.on("typing", (data) => {
        socket.broadcast.to(data.roomid).emit("someone_typing",data);
      });
});

app.set('view engine','ejs');
app.use('/',express.static(__dirname + '/public'));
// app.use('/chat/:roomId',express.static(__dirname + '/view'));
app.get('/chat/:roomId',async(req,res)=>{
    const chats = await Chat.find({
        roomId:req.params.roomId
    });
    res.render('index',{
        name:'nikhil',
        id:req.params.roomId,
        chats:chats
    });
});

server.listen(3000,async()=>{
    console.log("server started on port no 3000");
    await connect();
    console.log('mongodb connected');
})