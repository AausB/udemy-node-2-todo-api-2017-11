const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      isAsync: false, // since mongoose 4.9.0 warning if there are 2 parameters in validate fn.
      // if you have a custom fn with one param there is no need for isAsync:
      // validator: (value) => {
      //   return validator.isEmail(value)
      // },

      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject(); // converting a Mongoose object into a JS object

  return _.pick(userObject, ['_id', 'email']); // change the results of the standard toJSON() method filtering the relevant properties to be returned
};

// define custom methods on UserSchema
// using regular JS function because "this"
UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString(); // abc123 is the secret

  user.tokens.push({access, token}); // this updates the local user model without saving to db
  return user.save().then(() => {
    return token;  // returning the success value for the next then-call in server.js
  });
};

// new User model
// email: required, trim, type string, minlength 1
const User = mongoose.model('User', UserSchema);

//
// exports
//
module.exports = {
  User
};
