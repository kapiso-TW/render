const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let chatHistory = []; // 用于保存聊天记录

app.use(express.static('public'));

// 当有客户端连接时
io.on('connection', (socket) => {
  console.log('新用户连接');

  // 发送历史聊天记录给新用户
  socket.emit('chatHistory', chatHistory);

  // 监听客户端的消息并广播
  socket.on('chatMessage', (msg) => {
    chatHistory.push(msg); // 保存聊天记录
    io.emit('chatMessage', msg); // 向所有用户广播
  });

  socket.on('disconnect', () => {
    console.log('用户断开连接');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
