//
// module imports
//
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb'); // for validating with ObjectID.isValid()


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
// server
//
const app = express();

//
// middleware
//
app.use(bodyParser.json()); // enabling app to receive JSON data -> stored in req.body


// create a new todo
app.post('/todos', (request, response) => {
  var todo = new Todo({
    text: request.body.text
  });

  todo.save().then((doc) => {
    response.send(doc); // send back the doc to the caller
  }).catch((error) => {
    response.status(400).send(error);
  });
});

// fetch all todos
app.get('/todos', (request, response) => {
  Todo.find().then((todos) => {
    response.send({  // send back an object instead of the array only, because you can add custom data to the object if necessary
      todos
      // ,custom: 'My custom data'
    });
  }).catch((error) => {
    response.status(400).send(error);
  });
});

// fetch a single todo
app.get('/todos/:id', (request, response) => {
  let id = request.params.id;

  // validate id using ObjectID.isValid()
  if (!ObjectID.isValid(id)) {
    return response.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.status(200).send({todo});
  }).catch((error) => {
    response.status(400).send('error');
  });
});


app.listen(3000, () => {
  console.log('Started on port 3000');
});

//
// exports
//
module.exports = {app}; // for server.test.js
