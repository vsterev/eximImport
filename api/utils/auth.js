const jwt = require('./jwt');
const { userModel, tokenBlacklistModel } = require('../models');
function auth() {
  return function (req, res, next) {
    // const token = req.cookies['auth-cookie'];
    const token = req.headers.authorization || '';
    if (!token) {
      res.status(401).json({ status: false, msg: 'No token provided' });
      return;
    }
    jwt
      .verifyToken(token)
      .then((data) => {
        userModel.findById(data.userId).then((user) => {
          req.user = user;
          next();
        });
      })
      .catch((err) => {
        // if (!redirectUnauthenticated) {
        //     next();
        //     return;
        // }
        if (
          [
            'jwt expired',
            'invalid token',
            'token expired',
            'blacklisted token',
            'jwt must be provided',
            'jwt malformed',
          ].includes(err.message)
        ) {
          // res.redirect('/user/login?error')
          res.status(403).json({ msg: err, redirect: true });
          console.log(err);
          return;
        }
        res.status(401).json({ msg: err });
        console.log(err);
      });
  };
}
module.exports = auth;
