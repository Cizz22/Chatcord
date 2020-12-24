const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/route');
const cookies = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { checkUser } = require('./middleware/auth');
const socket = require('socket.io');
const http = require('http');
const User = require('./models/models');

const app = express();
const server = http.createServer(app);

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookies());

// view engine
app.set('view engine', 'ejs');

// database connection
const port = process.env.PORT || 3000;
const dbURI = 'mongodb+srv://admin:1234@nodetutor.yh4xi.mongodb.net/nodetutor';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => server.listen(port))
  .catch((err) => console.log(err));

// format funtion
function formatMessage (username, text) {
  return {
    username,
    text
  };
}

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('index'));
// app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'))
app.use(routes);

// socket setup
const io = socket(server);

io.on('connection', socket => {
  socket.emit('message', formatMessage('BOT', 'Welcome to the Chatroom'));

  // broadcast
  socket.broadcast.emit('message', formatMessage('BOT', 'A user has joined the chat'));

  // disconect
  socket.on('disconnect', () => {
    io.emit('message', formatMessage('BOT', 'A user has left the chat'));
  });

  // listen for chat
  socket.on('chatmsg', (msg) => {
    io.emit('message', formatMessage('User', msg));
  });
});
