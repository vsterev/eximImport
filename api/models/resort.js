const mongoose = require('mongoose');
const citySchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    // unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  regionId: {
    type: String,
  },
  countryId: {
    type: String,
  },
  code: {
    type: String,
  },
  // resortId: {
  //   type: String,
  //   required: true,
  //   //     maxlength: [50, 'It is allow maximum 50 characters!']
  // },
});

module.exports = mongoose.model('City', citySchema);
