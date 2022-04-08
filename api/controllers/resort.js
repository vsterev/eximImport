const { resortModel } = require('../models');

module.exports = {
  get: {
    allResorts: (req, res) => {
      //   const user = req.user;
      resortModel
        .find()
        .then((resorts) => {
          res.status(200).json({ status: true, resorts });
        })
        .catch((err) => {
          res.status(404).json({ status: false, msg: err });
          console.error(err);
        });
    },
  },
  post: {
    create: (req, res) => {
      const { _id, name, regionId, countryId, code } = req.body;
      resortModel
        .create({ _id, name, regionId, countryId, code })
        .then((data) => res.status(200).json(data))
        .catch((err) => console.log(err));
    },
  },
};
