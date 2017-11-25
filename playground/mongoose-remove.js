const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// // Todo.remove({filter})
// // Remove all documents from a collection
// Todo.remove({}).then((result) => {
//   console.log(result);
// }).catch((error) => {console.log(error);})


// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()
//


Todo.findOneAndRemove({_id: '5a19a3c7cc0db6b7f7b9dbe9'}).then((todo) => {
  console.log(todo);
}).catch((error) => console.log(error));


Todo.findByIdAndRemove('5a19a3c7cc0db6b7f7b9dbe9').then((todo) => {
  console.log(todo);
}).catch((error) => console.log(error));
