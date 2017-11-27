const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';

// 10 is the number of rounds bcrypt uses to slow down the encryption process
// the highe the slower: try 120
// bcrypt.genSalt(10, (err, salt) => {
//  bcrypt.hash(password, salt, (error, hash) => {
//    console.log(hash);
//  })
// });

var hashedPassword = '$2a$10$s3pnGYJ9OSZkPRu.98UNEumbE/aotgaNEvZLXwfZyAdS/ypxi5KUy';

bcrypt.compare(password, hashedPassword, (error, result) => {
  console.log(result);
});
