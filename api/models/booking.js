const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    // required: [true, 'Please enter a reservation Number !'],
    //     maxlength: [50, 'It is allow maximum 50 characters!']
    // unique: true,
    // index: true,
  },
  ilCode: {
    type: String,
    // ref: 'Hotel',
  },
  ilKey: {
    type: String,
  },
  partner: {
    type: String,
  },
  createdAt: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model('Booking', bookingSchema);
