const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5a19501bb25e132b080200321';
//
// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// Todo.find({ // returns an array of objects
//   _id: id   // mongoose converts the id string into an ObejctID
// }).then((todos) => {
//   console.log('Todos', todos);
// }).catch((error) => console.log(error));
//
// Todo.findOne({ // returns an object
//   _id: id   // mongoose converts the id string into an ObejctID
// }).then((todo) => {
//   console.log('Todo', todo);
// }).catch((error) => console.log(error));

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo by ID', todo);
// }).catch((error) => console.log(error));


const userId = '5a195ec6cc0db6b7f7b9c677';

User.findById(userId).then((user) => {
  if (!user) {
    return console.log('No user with this id found');
  }
  console.log(JSON.stringify(user, undefined, 2));

}).catch((error) => console.log(error));
