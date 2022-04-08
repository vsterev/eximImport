const mongoose = require('mongoose');
const boardSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
  },
  code: {
    type: String,
  },
  partnersCode: {},
});

module.exports = mongoose.model('boards', boardSchema);
