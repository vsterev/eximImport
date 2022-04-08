const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const { flightModel } = require('../../../models');
const service = require('../../../config/config').ilUrl;
const syncFlights = () => {
    const requestStr = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
  <GetFlights xmlns="http://www.megatec.ru/" />
</soap:Body>
</soap:Envelope>`;
    return fetch(service, {
        method: 'POST',
        body: requestStr,
        headers: {
            'Content-Type': 'text/xml',
        },
    })
    .then((res) => res.text())
    .then((xml) => parser.parseStringPromise(xml))
    .then((result) => result['soap:Envelope']['soap:Body'][0]['GetFlightsResponse'][0]['GetFlightsResult'][0]['Flight'])
    .then((flights) => {
        const newFlights = flights.map((flight) => {
          const _id = +flight.ID[0];
          const name = flight.Number[0];
          const arrivalFlightNumber = flight.ArrivalFlightNumber[0];
          const departureFlightNumber = flight.DepartureFlightNumber[0];
          let cityFromId = undefined;
          let airportFromId = undefined;
          if (flight.AirportFrom) {
            cityFromId = flight.AirportFrom[0].CityID[0];
            airportFromId = flight.AirportFrom[0].ID[0];
          }
          let cityToId = undefined;
          let airportToId = undefined;
          if (flight.AirportTo) {
            cityToId = flight.AirportTo[0].CityID[0];
            airportToId = flight.AirportTo[0].ID[0];
          }
          const obj = { name, cityFromId, airportFromId, cityToId, airportToId, arrivalFlightNumber, departureFlightNumber };
          flightModel.findOneAndUpdate({ _id }, obj, { upsert: true }).catch(console.log);
        });
        return flights;
      })
      .then((flights) => {
        console.log(`Message --> ${flights.length} flights are synchronized with Interlook`);
      })
      .catch((err) => console.log('Error --> synchronizying flights from Interlook' + err));
    
}
module.exports = syncFlights;