const mongoose = require('mongoose');

// set ES6 Promise for use in mongoose
mongoose.Promise = global.Promise;

// connext to database
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

//
// exports
//
module.exports = {
  mongoose
};
