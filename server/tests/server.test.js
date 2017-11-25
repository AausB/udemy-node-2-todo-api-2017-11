const request = require('supertest');
const {expect} = require('chai');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

//
// Prepare for tests
//

const todos = [{
  text: 'First test todo'
}, {
  text: 'Second test todo'
}];

beforeEach((done) => {
  Todo.remove({}) // wipes all todos
    .then(() => {
      return Todo.insertMany(todos); // returns the promise
    }).then(() => done())
    .catch((error) => done(error));
});

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
