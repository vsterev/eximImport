const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const MongoClient = require('mongodb').MongoClient;
const service = require('../../config/config').ilUrl;
const mongoUrl = require('../../config/config').dataBaseUrl;

const requestStr = `
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
  <GetFlights xmlns="http://www.megatec.ru/" />
</soap:Body>
</soap:Envelope>`;

fetch(service, {
  method: 'post',
  body: requestStr,
  headers: {
    'Content-Type': 'text/xml',
  },
})
  .then((res) => res.text())
  .then((xml) => {
    return parser.parseStringPromise(xml);
  })
  .then((result) => result['soap:Envelope']['soap:Body'][0]['GetFlightsResponse'][0]['GetFlightsResult'][0]['Flight'])
  .then((flights) => {
    const client = MongoClient.connect(mongoUrl);
    return Promise.all([flights, client]);
  })
  .then(([flights, client]) => {
    var db = client.db('hotels-api');
    const dropped = db.collection('flights');
    let dropAct = undefined;
    if (dropped) {
      dropAct = dropped.drop().catch((err) => null);
    }
    return Promise.all([flights, client, db, dropAct]);
  })
  .then(([flights, client, db]) => {
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
      return { _id, name, cityFromId, airportFromId, cityToId, airportToId, arrivalFlightNumber, departureFlightNumber };
    });
    const inserted = db.collection('flights').insertMany(newFlights);
    return Promise.all([flights, client]);
  })
  .then(([flights, client]) => {
    console.log(`Message --> ${flights.length} flights are synchronized with Interlook`);
    client.close();
  })
  .catch((err) => console.log('Error --> synchronizying flights from Interlook' + err));
