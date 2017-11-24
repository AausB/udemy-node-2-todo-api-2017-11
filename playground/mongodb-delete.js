// const MongoClient = require('mongodb').MongoClient;
// ES6 object descructuring
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

// ES6 object descructuring example
// var user = {name: 'Alex', age: 53};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server.');
  }

  console.log('Connected to MongoDB server');

  // delete many
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   // show the complete result object
  //   // console.log(result);
  //
  //   // just show how many deletions were done and if it's ok
  //   console.log(result.result);
  // }).catch((err) => {
  //   console.log('Unable to deleteMany', err);
  // });

  // // delete one
  // // only deletes the first doc that matches the criteria and then stops deleting
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // }).catch((err) => {
  //   console.log('Unable to deleteOne', err);
  // });

  // // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // }).catch((err) => {
  //   console.log('Unable to findOneAndDelete', err);
  // });

  // deleteMany Users docs
  db.collection('Users').deleteMany({location: 'München'}).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log('Unable to deleteMany \'Users\'', err);
  });

  // delete a single Users doc identified by _id
  db.collection('Users').findOneAndDelete({_id: new ObjectID('5a18305d99a45914b5a974a8')})
    .then((result) => {
      console.log(JSON.stringify(result, undefined, 2));
    })
    .catch((err) => {
      console.log('Unable to findOneAndDelete in Users', err);
    });

  // close db connection at the end
  // db.close();
});
