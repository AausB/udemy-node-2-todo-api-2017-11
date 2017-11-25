const mongoose = require('mongoose');

// set ES6 Promise for use in mongoose
mongoose.Promise = global.Promise;

// connext to database
mongoose.connect('mongodb://localhost:27017/TodoApp', {useMongoClient: true});

//
// exports
//
module.exports = {
  mongoose
};
