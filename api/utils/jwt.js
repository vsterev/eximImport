const jwt = require('jsonwebtoken');
const pass = '14Veliz@r03';
const options = { expiresIn: '15d' };

function createToken(data) {
  return jwt.sign(data, pass, options);
}
function verifyToken(token) {
  return new Promise((resolve, reject) => {
    //така се прави за да върне промис от стандартната функция
    jwt.verify(token, pass, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}
module.exports = { createToken, verifyToken };
