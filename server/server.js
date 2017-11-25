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
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc); // send back the doc to the caller
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});
