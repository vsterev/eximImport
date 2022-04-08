const mongoose = require('mongoose');
const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  partner: {
    type: String,
    required: [true, 'Please entere unique partner code!'],
    unique: [true, 'Please entere unique partner code!'],
  },
  user: {
    type: String,
  },
  pass: {
    type: String,
  },
  // test: {
  //   type: String,
  //   default: 'vasko',
  //   required: true,
  // },
  variablesName: {
    hotel: {
      type: String,
      default: 'hotel',
    },
    checkIn: {
      type: String,
      default: 'checkIn',
    },
    checkOut: {
      type: String,
      default: 'checkOut',
    },
    accommodation: {
      type: String,
      default: 'accommodation',
    },
    roomType: {
      type: String,
      default: 'roomType',
    },
    pansion: {
      type: String,
      default: 'pansion',
    },
    action: {
      type: String,
      default: 'action',
    },
    tourists: {
      type: String,
      default: 'tourists',
    },
    transfer: {
      type: String,
      default: 'transfer',
    },
    flightIn: {
      default: 'flightIn',
      type: String,
    },
    flightOut: {
      type: String,
      default: 'flightOut',
    },
    name: {
      type: String,
      default: 'name',
    },
    familyName: {
      type: String,
      default: 'familyName',
    },
    gender: {
      type: String,
      default: 'gender',
    },
    birthDate: {
      type: String,
      default: 'birthDate',
    },
    email: {
      type: String,
      default: 'email',
    },
    phone: {
      type: String,
      default: 'phone',
    },
    voucher: {
      type: String,
      default: 'voucher',
    },
  },
});

module.exports = mongoose.model('partners', partnerSchema);
