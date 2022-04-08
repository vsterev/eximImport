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
  transferTypeId: {
    type: String,
    required: true,
  },
  transferTypeName: {
    type: String,
    required: true,
  },
  cityFromId: {
    type: String,
    required: true,
  },
  cityFromName: {
    type: String,
    required: true,
  },
  cityToId: {
    type: String,
    required: true,
  },
  cityToName: {
    type: String,
    required: true,
  },
  pointFromId: {
    type: String,
    required: true,
  },
  pointFromName: {
    type: String,
    required: true,
  },
  pointToId: {
    type: String,
    required: true,
  },
  pointToName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Transfer', resortSchema);
