//
// module imports
//
const express = require('express');
const bodyParser = require('body-parser');


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
    res.status(400).send(error);
  });
});

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

app.listen(3000, () => {
  console.log('Started on port 3000');
});

//
// exports
//
module.exports = {app}; // for server.test.js
