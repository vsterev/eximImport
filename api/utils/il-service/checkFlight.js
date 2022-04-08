const { hotelModel, flightModel, transferModel } = require('../../models');
const checkFlight = (flight, hotelId, isArrival) => {
  if (isArrival) {
    return flightModel
      // .findOne({ arrivalFlightNumber: { $regex: flight, $options: 'ix' } })
      .find()
      .then((res) => {
        const findFlight = res.find(el=>el.arrivalFlightNumber.split(' ').join('').toLowerCase().includes(flight.toLowerCase()));
        // const airportFromId = res ? res.airportFromId : undefined;
        const airportFromId = findFlight ? findFlight.airportFromId : undefined;
        // const airportToId = res ? res.airportToId : undefined;
        const airportToId = findFlight ? findFlight.airportToId : undefined;
        // const _id = res ? res._id : undefined;
        const _id = findFlight ? findFlight._id : undefined;
        // const { airportFromId, airportToId, _id } = res;
        const hotelCity = hotelModel.findById(hotelId);
        return Promise.all([airportToId, airportFromId, _id, hotelCity]);
      })
      .then(([airportToId, airportFromId, _id, hotelCity]) => {
        const hotelCityId = hotelCity.resortId;
        const transferInfoIn = transferModel.findOne({ pointFromId: airportFromId, cityToId: hotelCityId });
        return Promise.all([transferInfoIn, _id]);
      })
      .catch(console.log);
  }
  else {
    return flightModel
      // .findOne({ departureFlightNumber: { $regex: flight, $options: 'ix' } })
      .find()
      .then((res) => {
        const findFlight = res.find(el=>el.departureFlightNumber.split(' ').join('').toLowerCase().includes(flight.toLowerCase()));
        // const airportFromId = res ? res.airportFromId : undefined;
        const airportFromId = findFlight ? findFlight.airportFromId : undefined;
        // const airportToId = res ? res.airportToId : undefined;
        const airportToId = findFlight ? findFlight.airportToId : undefined;
        // const _id = res ? res._id : undefined;
        const _id = findFlight ? findFlight._id : undefined;
        // const { airportFromId, airportToId, _id } = res;
        const hotelCity = hotelModel.findById(hotelId);
        return Promise.all([airportToId, airportFromId, _id, hotelCity]);
      })
      .then(([airportToId, airportFromId, _id, hotelCity]) => {
        const hotelCityId = hotelCity.resortId;
        const transferInfoOut = transferModel.findOne({ pointToId: airportToId, cityFromId: hotelCityId });
        return Promise.all([transferInfoOut, _id]);
      })
      .catch(console.log);
  }
};
module.exports = checkFlight;
