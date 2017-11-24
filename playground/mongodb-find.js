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

  // db.collection.find() returns a Cursor
  // -> see all Cursor functions: http://mongodb.github.io/node-mongodb-native/2.2/api/Cursor.html

  // // find ALL todos
  // db.collection('Todos').find().toArray().then((docs) => {
  //   console.log('All Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }).catch((err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  // // find todos with {completed: false}
  // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
  //   console.log('Todos with {completed: false}');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }).catch((err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  // // find todos with specific _id: '5a1842a798fac501b31f1068'
  // db.collection('Todos')
  //   .find({_id: new ObjectID('5a1842a798fac501b31f1068')})
  //   .toArray()
  //   .then((docs) => {
  //     console.log('Todos with _id 5a1842a798fac501b31f1068');
  //     console.log(JSON.stringify(docs, undefined, 2));
  // }).catch((err) => {
  //     console.log('Unable to fetch todos', err);
  // });

  // // find todos with specific _id: '5a1842a798fac501b31f1068'
  // db.collection('Todos')
  //   .find()
  //   .count()
  //   .then((count) => {
  //     console.log(`Todos count: ${count}`);
  // }).catch((err) => {
  //     console.log('Unable to fetch todos', err);
  // });

  // find todos with {completed: false}
  db.collection('Users').find({name: 'Alexander'}).toArray().then((docs) => {
    console.log('Users with {name: \'Alexander\'}');
    console.log(JSON.stringify(docs, undefined, 2));
  }).catch((err) => {
    console.log('Unable to fetch users', err);
  });



  // close db connection at the end
  // db.close();
});
