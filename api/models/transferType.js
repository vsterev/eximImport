const mongoose = require('mongoose');
const transferTypeSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    // unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  partnersCode: {},
});

module.exports = mongoose.model('Transfer-type', transferTypeSchema);
