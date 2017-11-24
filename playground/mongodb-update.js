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

  // db.collection('Todos').findOneAndUpdate(
  //   // filter
  //   {
  //     _id: new ObjectID('5a1842a798fac501b31f1068')
  //   },
  //   // update
  //   {
  //     $set: {
  //       completed: true
  //     }
  //   },
  //   // Options
  //   {
  //     returnOriginal: false // false returns the updated object
  //   })
  //   .then((result) => {
  //     console.log(result);
  //   })
  //   .catch((err) => {
  //     console.log('Unable to findOneAndUpdate', err);
  //   });

    // 5a1819f0fb0ec60cc3a6603c
    db.collection('Users').findOneAndUpdate(
      {_id: new ObjectID('5a1819f0fb0ec60cc3a6603c')},
      {
        $set: {name: 'Caro'},
        $inc: {age: 1}
      },
      {returnOriginal: false}
    ).then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log('Unable to findOneAndUpdate', err);
    });

  // close db connection at the end
  // db.close();
});
