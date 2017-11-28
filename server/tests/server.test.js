const request = require('supertest');
const {expect} = require('chai');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

//
// Prepare for tests
//

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text}) // supertest converts to JSON
      .expect(200) // returned http status code from server
      .expect((response) => { // custom expect assertion
        expect(response.body.text).to.equal(text);
      })
      .end((error, response) => {
        if (error) {
          return done(error); // return stops the function execution - done(error) ends the test with error
        }

        // check data in db
        Todo.find({text}).then((todos) => {
          expect(todos.length).to.equal(1);
          expect(todos[0].text).to.equal(text);
          done();
        }).catch((error) => done(error));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({}) // send an empty object
      .expect(400) // returned http status code from server
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        // Check the data in db
        Todo.find().then((todos) => {
          expect(todos.length).to.equal(2);
          done();
        }).catch((error) => done(error));
      })
    ;
  });
});


describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((response) => {
        expect(response.body.todos.length).to.equal(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).to.equal(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    // make sure you get a 404 back
    var id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    var id = '123xyz';
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  })
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    let id = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo._id).to.equal(id);
      })
      .end((error, response) => {
        if (error) {
          return done(error);
        }
        Todo.findById(id).then((todo) => {
          expect(todo).to.be.null;
          done();
        }).catch((error) => done(error));
      })
    ;
  });

  it('should return 404 if todo not found', (done) => {
    var id = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end((error, response) => {
        if (error) {
          return done(error);
        }
        Todo.findById(id).then((todo) => {
          expect(todo).to.be.null;
          done();
        }).catch((error) => done(error));
      })
    ;
  });

  it('should return 404 if object id is invalid', (done) => {
    var id = '123xyz';
    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    // grab id of first item
    let id = todos[0]._id.toHexString();
    let update = {
      text: 'Updated test text',
      completed: true
    };

    // update the text, set completed to true
    request(app)
      .patch(`/todos/${id}`)
      .send(update)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).to.equal(update.text);
        expect(response.body.todo.completed).to.equal(update.completed);
        expect(response.body.todo.completedAt).to.be.a('number');
      })
      .end((error, response) => {
        if (error) {
          return done(error); // return stops the function execution - done(error) ends the test with error
        }

        // check data in db
        Todo.findById(id).then((todo) => {
          expect(todo.text).to.equal(update.text);
          expect(todo.completed).to.equal(update.completed);
          expect(todo.completedAt).to.be.a('number');
          done();
        }).catch((error) => done(error));
      });
  });

  it('should clear completedAt when todo is not completed', (done) => {
    // grab id of second todo item
    // update text, completed to false
    //  200
    //  text is changed, completed is false and completedAt is null to.be.null
    let id = todos[1]._id.toHexString();
    let update = {
      text: 'Updated test text',
      completed: false
    };

    // update the text, set completed to true
    request(app)
      .patch(`/todos/${id}`)
      .send(update)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).to.equal(update.text);
        expect(response.body.todo.completed).to.equal(update.completed);
        expect(response.body.todo.completedAt).to.be.null;
      })
      .end((error, response) => {
        if (error) {
          return done(error); // return stops the function execution - done(error) ends the test with error
        }

        // check data in db
        Todo.findById(id).then((todo) => {
          expect(todo.text).to.equal(update.text);
          expect(todo.completed).to.equal(update.completed);
          expect(todo.completedAt).to.be.null;
          done();
        }).catch((error) => done(error));
      });
  });

  it('should return 404 if object id is invalid', (done) => {
    var id = '123xyz';
    request(app)
      .patch(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token) // set a header parameter
      .expect(200)
      .expect((response) => {
        // response.body._id is a string, users[0]._id is an ObjectID to be converted into a string by toHexString
        expect(response.body._id).to.equal(users[0]._id.toHexString());
        expect(response.body.email).to.equal(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      // no x-auth token provided!!!
      // .set('x-auth', '1234') // wrong x-auth
      .expect(401)
      .expect((response) => {
        expect(response.body).to.be.empty; // response.body is an empty object
      })
    .end(done);
  });
});


describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = 'example@example.com';
    let password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((response) => {
        expect(response.header['x-auth']).to.exist; // we do not know the exact value
        expect(response.body._id).to.exist; // we do not know the exact value
        expect(response.body.email).to.equal(email);
        expect(Object.keys(response.body).length).to.equal(2); // no other properties are send than _id and e,
      })
      .end((error) => {
        // if (error, response) {
        if (error) {
          return done(error); // return stops the function execution - done(error) ends the test with error
        }
        // alex way
        // // check data in db
        // User.findById(response.body._id).then((user) => {
        //   expect(user.email).to.equal(email);
        //   expect(user.tokens[0].access).to.equal('auth');
        //   expect(user.tokens[0].token).to.exist;
        //   done();
        // }).catch((error) => done(error));

        // andrew way
        User.findOne({email}).then((user) => {
          expect(user).to.exist;
          expect(user.password).to.not.equal(password); // password should be hashed now
          done();
        }).catch((error) => done(error));
      });
  });

  it('should return validation errors if request is invalid', (done) => {
    let invalidEmail = 'example';
    let invalidPassword = '123';

    request(app)
      .post('/users')
      .send({email: invalidEmail, password: invalidPassword})
      .expect(400)
      .expect((response) => {
        expect(response.body._id).to.be.undefined;
        expect(response.body.email).to.be.undefined;
      })
    // this is the check for the request(app) call .end((error) ...)
    .end((error) => { // this is essential: if you do not use the end((error) ... return done(error)) there will no error shown!!!
      if (error) {
        return done(error);
      }
    });
    done();
  });

  it('should not create user if email is in use', (done) => {
    let email = users[0].email;
    let password = '123456qwert'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .expect((response) => {
        expect(response.body._id).to.be.undefined;
        expect(response.body.email).to.be.undefined;
      })
    .end((error) => {
      if (error) {
        return done(error);
      }
    });

    done();
  });
});
