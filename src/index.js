require("dotenv").config();
const path = require('path');
const express = require('express');
const app = express();

// socket.io 연동
const http = require('http');
const { Server } = require('socket.io');
const { default: mongoose } = require("mongoose");
const server = http.createServer(app);
const io = new Server(server);


// 정적파일 제공 설정
const publicDirectory = path.join(__dirname, '../public');
app.use(express.static(publicDirectory));
app.use(express.json());

// DB 연결
// mongoose.set('strictQurey', false);
mongoose.connect(process.env.DB_URI)
    .then(() => console.log('디비 연결 성공!'))
    .catch(err => console.log(err))

// socket events
let users = [];
io.on('connection', async socket => {
    // 접속한  유저 정보 가져오기
    let userData = {};
    users.push(userData);
    io.emit('users-data', { users });

    // 클라이언트에서 보내온 메시지
    socket.on('message-to-server', () => { });

    // 데이터베이스에서 메시지 가져오기
    socket.on('fetch-messages', () => { });

    // 유저가 방에 나갔을 때
    socket.on('disconnect', () => { });
});


const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
})