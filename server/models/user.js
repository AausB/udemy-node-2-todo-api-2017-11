const mongoose = require('mongoose');

// new User model
// email: required, trim, type string, minlength 1
const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

//
// exports
//
module.exports = {
  User
};
