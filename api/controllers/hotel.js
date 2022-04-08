const { hotelModel, hotelRatingModel } = require('../models');
const synchHotels = require('../utils/il-service/cronJobs/syncHotels');
module.exports = {
  get: {
    allHotels: (req, res) => {
      //   const user = req.user;
      // console.log(req);
      hotelModel
        .find()
        .populate([{ path: 'resortId', model: 'City', select: 'name' }])
        .then((hotels) => {
          res.status(200).json({ hotels });
        })
        .catch((err) => {
          res.status(404).json({ msg: err });
          console.error(err);
        });
    },
    ratting: (req, res) => {
      const { hotelId } = req.params;
      hotelRatingModel
        .findOne({ hotelId })
        .lean()
        .populate([
          { path: 'hotelId', model: 'Hotel', select: 'name' },
          { path: 'comments.resId', model: 'Contact', select: ['name', 'checkIn'] },
        ])
        .then((result) => {
          if (result) {
            console.log(result.staff);
            const averagRate = Math.round(
              (+result.staff +
                +result.cleanliness +
                +result.comfort +
                +result.location +
                +result.food +
                +result.value) /
                (+result.votes * 6)
            );
            res.status(200).json({ rating: result, averagRate, maxRate: 10 });
          }
        })
        .catch((err) => console.log(err));
    },
    allHotelsRaing: (req, res) => {
      hotelRatingModel
        .find()
        .lean()
        .populate([
          { path: 'hotelId', model: 'Hotel', select: 'name' },
          { path: 'comments.resId', model: 'Contact', select: ['name', 'checkIn'] },
        ])
        .then((result) => {
          if (result) {
            console.log(result.staff);
            const averagRate = Math.round(
              (+result.staff +
                +result.cleanliness +
                +result.comfort +
                +result.location +
                +result.food +
                +result.value) /
                6
            );
            res.status(200).json({ rating: result, averagRate, maxRate: 10 });
          }
        })
        .catch((err) => console.log(err));
    },
    sync: (req, res) => {
      synchHotels()
        .then((rs) => res.status(200).json(rs))
        .catch((err) => res.status(401).json({ err }));
    },
  },
  patch: {
    updateMany: (req, res) => {
      // console.log(req.body);
      const hotels = req.body;
      let count = 0;
      Promise.all(
        hotels.map((el) => {
          const partner = Object.keys(el)[1];
          return hotelModel
            .findOneAndUpdate({ _id: el._id }, { [`partnersCode.${partner}`]: el[partner] }, { new: true })
            .then((r) => {
              if (r) {
                console.log(r);
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
