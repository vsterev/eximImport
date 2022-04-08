const mongoose = require('mongoose');
const hotelSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    // unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  resortId: {
    type: String,
    ref: 'Resort', //pravi vryzka kym drugata kolekcia, v neya _id===resrortId
    // foreignField: 'resID',
    // justOne: true,
  },
 
  code: {
    type: String,
  },
  category: {
    type: String,
  },
  regionId: {
    type: String,
  },
  resort: {
    type: String
  },
  partnersCode: {},
});
module.exports = mongoose.model('Hotel', hotelSchema);
