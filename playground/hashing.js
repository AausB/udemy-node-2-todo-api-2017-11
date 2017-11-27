const {SHA256} = require('crypto-js');

var message = 'I am user number 3';
var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

var data = {
  id: 4
};

var token = {
  data,
  // Salting the hash with data you only know: 'somesecret'
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};


// // man in the middle does not know the "salt"
// token.data = 5;
// token.hash = SHA256(JSON.stringify(data)).toString();


var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
if (resultHash === token.hash) {
  console.log('Data was not changed');
} else {
  console.log('Data was changed. Do not trust!');
}
