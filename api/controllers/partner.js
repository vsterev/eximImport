const { partnerModel } = require('../models');
const { findOneAndUpdate } = require('../models/partner');

module.exports = {
  get: {
    all: (req, res) => {
      //   const user = req.user;
      partnerModel
        .find()
        .then((partners) => {
          res.status(200).json({ partners });
        })
        .catch((err) => {
          res.status(401).json({ msg: err.message });
          console.error(err.message);
        });
    },
  },
  post: {
    update: (req, res) => {
      const { _id, name, partner, user, pass, variablesName } = req.body;
      // console.log({ _id, name, partner, user, pass, variablesName });
      // const partners = req.body;
      // partners.map((prt) => {
      //   const { _id, name, partner, user, pass } = prt;
      //   if (partner) {
      partnerModel
        .findOneAndUpdate({ partner }, { name, user, pass, variablesName }, { upsert: true, validation: true })
        .then((data) => {
          res.status(200).json(data);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(401).json({ msg: `partner ${err?.keyValue?.partner} was dublicated ` });
        });
      //   }
      // });
    },
    create: (req, res) => {
      const { name, partner, user, pass } = req.body;
      if (partner) {
        partnerModel
          .create({ partner, name, user, pass })
          .then((data) => {
            res.status(200).json(data);
            console.log(data);
          })
          .catch((err) => {
            console.log(err);
            res.status(401).json({ msg: `partner with code ${err?.keyValue?.partner} already exists ` });
          });
      }
    },
    remove: (req, res) => {
      console.log(req.body);
      const { el } = req.body;
      // const _id = req.body;
      partnerModel
        .findOneAndDelete({ _id: el._id })
        .then((rs) => {
          console.log(rs);
          if (rs._id == el._id) {
            console.log('deleted');
          }
        })
        .catch(console.log);
    },
  },
  delete: {
    remove: (req, res) => {
      console.log(req.body);
      const { el } = req.body;
      // const _id = req.body;
      partnerModel
        .findOneAndDelete({ _id: el._id })
        .then((rs) => {
          console.log(rs);
          if (rs._id == el._id) {
            console.log('deleted');
          }
        })
        .catch(console.log);
    },
  },
};
