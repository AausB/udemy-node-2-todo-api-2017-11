require('./config/config');

//
// module imports
//
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb'); // for validating with ObjectID.isValid()
const bcrypt = require('bcryptjs');

//
// mongoose setup
//
const {mongoose} = require('./db/mongoose'); // require the mongoose.js due to db setup
//
//models
//
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

//
// middleware
//
const {authenticate} = require('./middleware/authenticate');


//
// server
//
const app = express();
const port = process.env.PORT;

//
// middleware
//
app.use(bodyParser.json()); // enabling app to receive JSON data -> stored in req.body

////////////////////////////////
//
// Todos
//
////////////////////////////////


// create a new todo
app.post('/todos', authenticate, (request, response) => {
  // only the wanted data is taken from user input
  var todo = new Todo({
    text: request.body.text,
    _creator: request.user._id
  });

  todo.save().then((doc) => {
    response.send(doc); // send back the doc to the caller
  }).catch((error) => {
    response.status(400).send(error);
  });
});

// fetch all todos
app.get('/todos', authenticate, (request, response) => {
  Todo.find({
    _creator: request.user._id
  }).then((todos) => {
    response.send({  // send back an object instead of the array only, because you can add custom data to the object if necessary
      todos
      // ,custom: 'My custom data'
    });
  }).catch((error) => {
    response.status(400).send(error);
  });
});

// fetch a single todo
app.get('/todos/:id', authenticate, (request, response) => {
  let id = request.params.id;

  // validate id using ObjectID.isValid()
  if (!ObjectID.isValid(id)) {
    return response.status(404).send();
  }

  Todo.findOne({
      _id: id,
      _creator: request.user._id
    }).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.send({todo});
  }).catch((error) => {
    response.status(400).send('error');
  });
});

// delete a single todo
app.delete('/todos/:id', authenticate, (request, response) => {
  // get the id from the request
  let id = request.params.id;

  // validate id using ObjectID.isValid()
  if (!ObjectID.isValid(id)) {
    return response.status(404).send();
  }

  // remove todo by id
  Todo.findOneAndRemove({
      _id: id,
      _creator: request.user._id
    }).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.send({todo});
  }).catch((error) => response.status(400).send());
});

// update (parts of) the document
app.patch('/todos/:id', authenticate, (request, response) => {
  let id = request.params.id;
  // VERY IMPORTANT: filter only attributes that are allowed to be updated!!!
  // it is a subset of values the user passed
  // ALSO: The same should be for inserts!!!
  let body = _.pick(request.body, ['text', 'completed']);

  // validate id using ObjectID.isValid()
  if (!ObjectID.isValid(id)) {
    return response.status(404).send();
  }

  // check the completed value
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime(); // Javascript timestamp in millisecs from 01.01.1970
  } else {
    body.completed = false;
    body.completedAt = null; // null: to delete the value from the db
  }

  Todo.findOneAndUpdate({
      _id: id,
      _creator: request.user._id
    }, {$set: body}, {new: true})
    .then((todo) => {
      // check if there is a document with the id
      if (!todo) {
        return response.status(404).send();
      }
      // todo does exist
      response.send({todo});
    }).catch((error) => {
      console.log(error);
      response.status(400).send();
    });
});

////////////////////////////////
//
// Users
//
////////////////////////////////

app.post('/users', (request, response) => {
  let body = _.pick(request.body, ['email', 'password']);

  // let user = new User({
  //   email: body.email,
  //   password: body.password
  // });
  // is the same:
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken(); // returns the promise from user.save() that returns the token
  }).then((token) => {
      response.header('x-auth', token).send(user); // x-* indicates a custom header
  }).catch((error) => {
    response.status(400).send(error); // ob man da wirklich error schickt?
  });
});

// private route
app.get('/users/me', authenticate, (request, response) => {
  response.send(request.user); // request.user is set in "authenticate" !!!
});

// user login
app.post('/users/login', (request, response) => {
  let body = _.pick(request.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => { // with return .catch() is called for errors
      response.header('x-auth', token).send(user); // toJSON() in user.js filters the user properties
    })

  }).catch((error) => {
    response.status(400).send();
  }) ;
});

// user logout
app.delete('/users/me/token', authenticate, (request, response) => {
  request.user.removeToken(request.token).then(() => {
    response.status(200).send();
  }).catch((error) => response.status(400).send());
});


//
// app server
//
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

//
// exports
//
module.exports = {app}; // for server.test.js
