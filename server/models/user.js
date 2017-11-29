const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UserSchema.methods.toJSON = function() {  // .methods turns into an instance method
  var user = this;
  var userObject = user.toObject(); // converting a Mongoose object into a JS object

  return _.pick(userObject, ['_id', 'email']); // change the results of the standard toJSON() method filtering the relevant properties to be returned
};

// define custom methods on UserSchema
// using regular JS function because "this"
UserSchema.methods.generateAuthToken = function() {  // .methods turns into an instance method
  var user = this;
  var access = 'auth';
  // token besteht aud der mongodb _id, dem access string 'auth' und dem secret key 'abc123'
  // d.h. man kann die _id wieder aus dem token herausziehen mit jwt.veriy() : siehe unten User.findByToken()
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString(); // abc123 is the secret

  user.tokens.push({access, token}); // this updates the local user model without saving to db
  return user.save().then(() => {
    return token;  // returning the success value for the next then-call in server.js
  });
};

UserSchema.statics.findByToken = function(token) {  // .statics turns into a model method
  let User = this;
  let decoded; // undefined intentionally

  try {
    decoded = jwt.verify(token, 'abc123'); // throws an error if anything goes wrong
  } catch(error) { // return a Promise that is rejected !!
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject(); // the shortcut version
  }

  return User.findOne({
    '_id': decoded._id, // '' used here only for beauty purposes
    'tokens.token': token, // use '' if dots are in property name
    'tokens.access': 'auth'
  });
};

// credentials = Anmeldedaten
UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return new Promise.reject(); // go to .catch() of the calling function
    }

    return new Promise((resolve, reject) => {
      // bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function(next) { // we need this
  let user = this;

  if (user.isModified('password')) {
    // user.hashedPassword
    // // user.password === hash -> next()
    bcrypt.genSalt(10, (error, salt) => {
      // what to do with the errors?
      // if (error) {
      //   next();
      // }
      // Ich mach mal so:
      if (error) {
       throw error;
      }
     bcrypt.hash(user.password, salt, (error, hash) => {
       // what to do with the errors?
       // if (error) {
       //   next();
       // }
       // Ich mach mal so:
       if (error) {
        throw error;
       }
       user.password = hash;
       next();
     })
    });
  } else {
    next();
  }
});

// new User model
// email: required, trim, type string, minlength 1
const User = mongoose.model('User', UserSchema);

//
// exports
//
module.exports = {
  User
};
