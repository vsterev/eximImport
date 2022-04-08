const mongoose = require('mongoose');
const hotelSchema = require('./hotel');
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Please enter a title !'],
  },
  _id: {
    type: String,
    // required: [true, 'Please enter a reservation Number !'],
    //     maxlength: [50, 'It is allow maximum 50 characters!']
    // unique: true,
    // index: true,
  },
  hotelId: {
    type: String,
    ref: 'Hotel',
  },
  // hotelId: [hotelSchema],
  checkIn: {
    type: String,
    required: true,
  },
  checkOut: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  flightArrival: {
    type: String,
  },
  flightDeparture: {
    type: String,
  },
  hasTransfer: {
    type: Boolean,
  },
  time: {
    type: String,
  },
  comment: {
    type: String,
  },
  firstSendMessage: {
    type: String,
  },
  lastSendMessage: {
    type: String,
  },
  // sendedMsg: {
  //   type: String,
  // },
  //   users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  //   creatorId: { type: mongoose.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Contact', contactSchema);
