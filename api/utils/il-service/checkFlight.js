const { hotelModel, flightModel, transferModel } = require('../../models');
const checkFlight = (flight, hotelId, isArrival) => {
  // if (isArrival) {
  //   return flightModel
  //     // .findOne({ arrivalFlightNumber: { $regex: flight, $options: 'ix' } })
  //     .find()
  //     .then((res) => {
  //       const findFlight = res.find(el=>el.arrivalFlightNumber?.split(' ').join('').toLowerCase().includes(flight.trim().toLowerCase()));
  //       const airportFromId = findFlight ? findFlight.airportFromId : undefined;
  //       const airportToId = findFlight ? findFlight.airportToId : undefined;
  //       const _id = findFlight ? findFlight._id : undefined;
  //       const hotelCity = hotelModel.findById(hotelId);
  //       return Promise.all([airportToId, airportFromId, _id, hotelCity]);
  //     })
  //     .then(([airportToId, airportFromId, _id, hotelCity]) => {
  //       const hotelCityId = hotelCity.resortId;
  //       const transferInfoIn = transferModel.findOne({ pointFromId: airportFromId, cityToId: hotelCityId });
  //       return Promise.all([transferInfoIn, _id]);
  //     })
  // }
  // else {
  //   return flightModel
  //     .find()
  //     .then((res) => {
  //       const findFlight = res.find(el=>el.departureFlightNumber?.split(' ').join('').toLowerCase().includes(flight.trim().toLowerCase()));
  //       const airportFromId = findFlight ? findFlight.airportFromId : undefined;
  //       const airportToId = findFlight ? findFlight.airportToId : undefined;
  //       const _id = findFlight ? findFlight._id : undefined;
  //       const hotelCity = hotelModel.findById(hotelId);
  //       return Promise.all([airportToId, airportFromId, _id, hotelCity]);
  //     })
  //     .then(([airportToId, airportFromId, _id, hotelCity]) => {
  //       const hotelCityId = hotelCity.resortId;
  //       const transferInfoOut = transferModel.findOne({ pointToId: airportToId, cityFromId: hotelCityId });
  //       return Promise.all([transferInfoOut, _id]);
  //     })
  // }
  //new code here after refactoring
  return flightModel
    .find()
    .then((res) => {
      const findFlight = res.find(el => {
        const string = isArrival ? 'arrivalFlightNumber' : 'departureFlightNumber';
        return el[string].split(' ').join('').toLowerCase().includes(flight.trim().toLowerCase())
      });
      // const airportFromId = findFlight ? findFlight.airportFromId : undefined;
      // const airportToId = findFlight ? findFlight.airportToId : undefined;
      const airportId = isArrival ? (findFlight ? findFlight.airportFromId : undefined) : (findFlight ? findFlight.airportToId : undefined);
      const _id = findFlight ? findFlight._id : undefined;
      const hotelCity = hotelModel.findById(hotelId);
      return Promise.all([airportId, _id, hotelCity]);
    })
    .then(([airportId, _id, hotelCity]) => {
      const hotelCityId = hotelCity.resortId;
      const transferInfo = isArrival ? transferModel.findOne({ pointFromId: airportId, cityToId: hotelCityId }) : transferModel.findOne({ pointToId: airportId, cityFromId: hotelCityId });
      return Promise.all([transferInfo, _id]);
    })
};
module.exports = checkFlight;
