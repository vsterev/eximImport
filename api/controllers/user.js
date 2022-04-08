const { userModel, tokenBlacklistModel } = require('../models');
const { createToken, verifyToken } = require('../utils/jwt');
const bcrypt = require('bcrypt');

module.exports = {
  get: {
    logout: (req, res, next) => {
      const token = req.token || req.cookies['auth-cookie'];
      if (!token) {
        res.redirect('/');
        return;
      }
      tokenBlacklistModel
        .create({ token })
        .then(() => {
          res.clearCookie('auth-cookie');
          res.status(200).redirect('/');
        })
        .catch((err) => next(err));
    },
    verifyLogin: (req, res, next) => {
      const token = req.headers.authorization;
      // console.log(token);
      verifyToken(token)
        .then((data) => {
          console.log('tuka e', data);

          userModel.findById(data.userId).then((user) => {
            req.user = user;
            const userData = {
              name: user.name,
              email: user.email,
              userId: user.id,
              isAdmin: user.isAdmin,
            };
            res.status(200).json({ status: true, userData });
          });
        })
        .catch((err) => {
          if (['invalid token', 'token expired', 'blacklisted token', 'jwt must be provided'].includes(err.message)) {
            console.log('sega greshkata e tuk1');
            res.status(401).json({ status: false, error: 'UNAUTHORIZED!' });
            return;
          }
          console.log('sega greshkata e tuk2');
          console.log(err);
          res.send({ status: false });
        });
    },
    allusers: (req, res) => {
      const { isAdmin } = req.user;
      if (!isAdmin) {
        const msg = "User doesn't have access for this operation!";
        console.log(msg);
        res.status(401).json({ msg });
        return;
      }
      userModel
        .find()
        .then((users) => res.status(200).json(users))
        .catch((err) => res.status(400).json(err.message));
    },
  },
  post: {
    login: (req, res, next) => {
      const { email, password } = req.body;
      userModel
        .findOne({ email })
        .then((userData) => {
          if (!userData) {
            // res.render('login', { errors: { email: `This user ${email} not exist!` } });
            res.status(401).json({ status: false, msg: `The user ${email} not exist!` });
            return;
          }
          return userData
            .matchPassword(password) //promise in promise - mot nested
            .then((match) => {
              if (!match) {
                // res.render('login', { errors: { password: 'Password mismatch!' } });
                res.status(401).json({ status: false, msg: 'Password mismatch!' });
                return;
              }
              req.user = userData;
              const token = createToken({ userId: req.user.id });
              res.status(200).json({
                status: true,
                token,
                userData: {
                  name: userData.name,
                  email: userData.email,
                  userId: userData.id,
                  isAdmin: userData.isAdmin,
                },
              });
              return;
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    },
    register: (req, res, next) => {
      const { name, email, password, isAdmin } = req.body;
      userModel
        .create({
          name,
          email,
          password,
          isAdmin,
          // likes: [],
          // villas: [],
          // reservations: [],
        })
        .then((user) => {
          req.user = user;
          // signin(req, res);
          const token = createToken({ userId: req.user.id });
          res.status(200).json({
            status: true,
            token,
            userData: { name: user.name, email: user.email, userId: user.id },
          });
          return;
        })
        .catch((err) => {
          if ((err.code = 11000 && err.name === 'MongoError')) {
            res.status(403).json({ status: false, msg: 'Email already exist' });
            return;
          }
          res.status(403).json({ status: false, msg: err.message });
          console.error(err);
          return;
        });
    },
  },
  put: {
    passChange: (req, res, next) => {
      //ne raboti validation pri update
      const user = req.user;
      let { oldPassword, password } = req.body;
      userModel
        .findById(user._id)
        .then((user) => {
          return Promise.all([user, user.matchPassword(oldPassword)]);
        })
        .then(([user, match]) => {
          if (!match) {
            throw new Error("Old Password doesn't correct");
            // res.status(401).json({ status: false, msg: "Old Password doesn't correct" });
            // return;
          }
          return userModel.findByIdAndUpdate(user.id, { password });
        })
        .then((a) => {
          // console.log(a)
          res.status(201).json({ status: true, msg: 'Passwod is changed !' });
          // res.redirect('/');
          return;
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json({ err: err.message });
        });
    },
    nameChange: (req, res) => {
      const user = req.user;
      const { name } = req.body;
      // console.log(user, name)
      // return
      // userModel.findByIdAndUpdate(user.id, { name }, { runValidators: true })
      userModel
        .findByIdAndUpdate(user.id, { name }, { runValidators: true })
        .then((user) => {
          // console.log(user)
          res.status(200).json({ msg: 'Name is changed!' });
          return;
        })
        .catch((err) => {
          res.status(403).json({ msg: err.message });
          console.error(err);
          return;
        });
    },
    adminChange: (req, res) => {
      const { _id, isAdmin } = req.body;
      const adminAccess = req.user.isAdmin;
      if (!adminAccess) {
        const msg = "User doesn't have access for this operation!";
        console.log(msg);
        res.status(401).json({ msg });
        return;
      }
      userModel
        .findByIdAndUpdate(_id, { isAdmin }, { new: true })
        .then((r) => res.status(200).json(r))
        .catch((err) => res.status(400), json({ err }));
    },
  },
  delete: {
    user: (req, res) => {
      const { _id } = req.body;
      const { isAdmin } = req.user;
      if (!isAdmin) {
        const msg = "User doesn't have access for this operation!";
        console.log(msg);
        res.status(401).json({ msg });
        return;
      }
      userModel
        .findByIdAndDelete(_id)
        .then((rs) => res.status(200).json({ rs }))
        .catch((err) => res.status(400).json({ err }));
    },
  },
};
