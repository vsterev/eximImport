const { boardModel } = require('../models');
const boardSync = require('../utils/il-service/cronJobs/syncBoards');

module.exports = {
  get: {
    all: (req, res) => {
      //   const user = req.user;
      boardModel
        .find()
        .then((boards) => {
          res.status(200).json({ boards });
        })
        .catch((err) => {
          res.status(404).json({ msg: err });
          console.error(err);
        });
    },
    sync: (req, res) => {
      boardSync()
        .then((rs) => res.status(200).json(rs))
        .catch((err) => res.status(401).json({ err }));
    },
  },
  patch: {
    update: (req, res) => {
      const { _id, partner, pansion } = req.body;
      boardModel
        .findOneAndUpdate({ _id }, { [partner]: pansion }, { new: true })
        .then((data) => res.status(200).json(data))
        .catch((err) => console.log(err));
    },
    updateMany: (req, res) => {
      const boards = req.body;
      console.log({ boards });
      let count = 0;
      Promise.all(
        boards.map((el) => {
          const partner = Object.keys(el)[1];
          return boardModel
            .findOneAndUpdate({ _id: el._id }, { [`partnersCode.${partner}`]: el[partner] }, { new: true })
            .then((r) => {
              if (r) {
                count++;
              }
              return count;
            })
            .catch((err) => console.log(err));
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
