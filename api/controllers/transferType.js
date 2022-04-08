const { transferTypeModel, boardModel } = require('../models');
// const transferType = require('../models/transferType');
const syncTransferType = require('../utils/il-service/cronJobs/syncTransferTypes');
module.exports = {
  get: {
    all: (req, res) => {
      //   const user = req.user;
      transferTypeModel
        .find()
        .then((transferTypes) => {
          res.status(200).json({ transferTypes });
        })
        .catch((err) => {
          res.status(404).json({ msg: err });
          console.error(err);
        });
    },
    sync: (req, res) => {
      syncTransferType()
        .then((rs) => res.status(200).json(rs))
        .catch((err) => res.status(401).json({ err }));
    },
  },
  patch: {
    // update: (req, res) => {
    //   const { _id, partner, pansion } = req.body;
    //   boardModel
    //     .findOneAndUpdate({ _id }, { [partner]: pansion }, { new: true })
    //     .then((data) => res.status(200).json(data))
    //     .catch((err) => console.log(err));
    // },
    updateMany: (req, res) => {
      // console.log(req.body);
      const transferTypes = req.body;
      // console.log(transferTypes);
      let count = 0;
      Promise.all(
        transferTypes.map((el) => {
          const partner = Object.keys(el)[1];
          return (
            transferTypeModel
              // .findOneAndUpdate({ _id: el._id }, { [partner]: el[partner] }, { new: true })
              .findOneAndUpdate({ _id: el._id }, { [`partnersCode.${partner}`]: el[partner] }, { new: true })
              .then((r) => {
                if (r) {
                  console.log(r);
                  count++;
                }
                return count;
              })
              .catch((err) => console.log(err))
          );
        })
      ).then((r) => {
        if (r) {
          return res.status(200).json({ result: r.length });
        }
        return res.status(400).json({ err: 'no items changed' });
      });
    },
  },
};
