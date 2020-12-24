const User = require('../models/models');
const jwt = require('jsonwebtoken');
const socket = require('socket.io');

// error
const handle = (err) => {
  console.log(err.message, err.code);
  let code;
  const errors = { username: '', password: '' };

  if (err.message === 'User salah') {
    errors.username = 'Username belum terdaftar';
  }

  if (err.message === 'Password salah') {
    errors.password = 'Password salah';
  }

  // duplicate error
  if (err.code === 11000) {
    errors.username = 'Username telah terdaftar';
    return errors;
  }

  // validate error
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secret line', {
    expiresIn: maxAge
  });
};

module.exports.signup_get = (req, res) => {
  res.render('register');
};

module.exports.login_get = (req, res) => {
  res.render('login');
};

module.exports.signup_post = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    usernamechat = username;
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handle(err);
    res.status(201).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handle(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};

module.exports.chatbox = (req, res) => {
  res.render('chat');
}
;
