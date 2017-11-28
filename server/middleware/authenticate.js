const {User} = require('./../models/user');

const authenticate = (request, response, next) => {
  let token = request.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      // response.status(401).send();
      return Promise.reject(); // jumps right to the .catch() error path below
    }

    // set user and token into the request object
    request.user = user;
    request.token = token;
    next();

  }).catch((error) => {
    response.status(401).send();
  });
};

module.exports = {authenticate};
