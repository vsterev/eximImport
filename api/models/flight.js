const mongoose = require('mongoose');
const resortSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    // unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  cityFromId: {
    type: String,
  },
  airportFromId: {
    type: String,
  },
  cityToId: {
    type: String,
  },
  airportToId: {
    type: String,
  },
  arrivalFlightNumber: {
    type: String
  }, 
  departureFlightNumber: {
    type: String
  }
  // resortId: {
  //   type: String,
  //   required: true,
  //   //     maxlength: [50, 'It is allow maximum 50 characters!']
  // },
});

module.exports = mongoose.model('Flight', resortSchema);
