const userModel = require('./user');
const tokenBlacklistModel = require('./token-blacklist');
const resortModel = require('./resort.js');
const hotelModel = require('./hotel.js');
const flightModel = require('./flight.js');
const transferModel = require('./transfer');
const bookingModel = require('./booking');
const boardModel = require('./board');
const transferTypeModel = require('./transferType');
const partnerModel = require('./partner');
module.exports = {
  userModel,
  tokenBlacklistModel,
  resortModel,
  hotelModel,
  flightModel,
  transferModel,
  bookingModel,
  boardModel,
  transferTypeModel,
  partnerModel,
};
