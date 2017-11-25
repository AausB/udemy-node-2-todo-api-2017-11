const mongoose = require('mongoose'); // require module

// Mongoose DB Schema
// Todo is a constructor function return by mongoose.model()
const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true, // required value
    minlength: 1, // must contain at least a non-space character
    trim: true // get rid of leading and trailing spaces
  },
  completed: {
    type: Boolean,
    default: false // set default at creation if no value is given
  },
  completedAt: {
    type: Number,
    default: null // set default at creation if no value is given
  }
});

//
// exports
//
module.exports = {
  Todo
};
