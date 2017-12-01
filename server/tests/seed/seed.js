const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

//
// Prepare for tests
//


const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'alex@example.com',
  password: 'userOnePassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString() // abc123 is the secret
  }]
}, {
  _id: userTwoId,
  email: 'carox@example.com',
  password: 'userTwoPassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString() // abc123 is the secret
  }]
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 123,
  _creator: userTwoId
}];


const populateTodos = ((done) => {
  Todo.remove({}) // wipes all todos
    .then(() => {
      return Todo.insertMany(todos); // returns the promise
    }).then(() => done())
      .catch((error) => done(error));
});

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]); // return a Promise for all in the parameters
  }).then(() => done())
    .catch((error) => done(error));
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
