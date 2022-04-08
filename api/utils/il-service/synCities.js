const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const MongoClient = require('mongodb').MongoClient;
const service = require('../../config/config').ilUrl;
const mongoUrl = require('../../config/config').dataBaseUrl;
// const { service, mongoUrl } = require('./config');
const requestStr = `
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetCities xmlns="http://www.megatec.ru/">
      <countryKey>4</countryKey>
      <regionKey>-1</regionKey>
    </GetCities>
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
  .then((result) => result['soap:Envelope']['soap:Body'][0]['GetCitiesResponse'][0]['GetCitiesResult'][0]['City'])
  .then((cities) => {
    const connect = MongoClient.connect(mongoUrl);
    return Promise.all([cities, connect]);
  })
  .then(([cities, connect]) => {
    const db = connect.db('hotels-api');
    const deleted = db
      .collection('cities')
      .drop()
      .catch((err) => null);
    return Promise.all([cities, connect, db, deleted]);
  })
  .then(([cities, connect, db, deleted]) => {
    const newCities = cities.map((city) => {
      const _id = +city.ID[0];
      const name = city.Name[0];
      const regionId = city.RegionID[0];
      const countryId = city.CountryID[0];
      const code = city.Code[0];
      return { _id, name, regionId, countryId, code };
    });
    const inserted = db.collection('cities').insertMany(newCities);
    return Promise.all([cities, connect]);
  })
  .then(([cities, connect]) => {
    console.log(`Message --> ${cities.length} cities are synchronized with Interlook`);
    connect.close();
  })
  .catch((err) => console.log('Error --> synchronizying cities from Interlook' + err));
