const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username wajib diisi'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi'],
    minlength: [6, 'minimal password 6 karakter']
  }
})

// before doc save

// UserSchema.pre('save', function (next) {
//     var user = this;
//     bcrypt.hash(user.password, 10, function (err, hash) {
//       if (err) {
//         return next(err); }
//       user.password = hash;
//       next();
//     })
//   });

UserSchema.pre('save', function (next) {
  const user = this
  const salt = bcrypt.genSaltSync()
  user.password = bcrypt.hashSync(user.password, salt)
  next()
})

UserSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username })
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw Error('Password salah')
  }
  throw Error('User salah')
}

const User = mongoose.model('user', UserSchema)
module.exports = User
