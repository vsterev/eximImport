const { resortModel } = require('../../models');
const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const requestStr = `
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetCities xmlns="http://www.megatec.ru/">
      <countryKey>4</countryKey>
      <regionKey>-1</regionKey>
    </GetCities>
  </soap:Body>
</soap:Envelope>`;
const syncCities = function () {
  return fetch('http://evaluation.solvex.bg/iservice/integrationservice.asmx', {
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
      const deleted = resortModel.collection.drop();
      const newCities = cities.map((city) => {
        const _id = +city.ID[0];
        const name = city.Name[0];
        const regionId = city.RegionID[0];
        const countryId = city.CountryID[0];
        const code = city.Code[0];
        return { _id, name, regionId, countryId, code };
      });
      const inserted = resortModel.insertMany(newCities, { ordered: false });
      return Promise.all([inserted, deleted]);
    })
    .then(([inserted, deleted]) => {
      console.log(`Message --> ${inserted.length} cities are synchronized with Interlook`);
      return inserted;
    })
    .catch((err) => console.error('Error --> synchronizying cities from Interlook' + err));
};
module.exports = syncCities;
