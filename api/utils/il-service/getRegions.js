const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const service = require('../../config/config').ilUrl;

const getRegions = function (countryId) {
  const requestStr = `
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
  <GetRegions xmlns="http://www.megatec.ru/">
  <countryKey>4</countryKey>
  <regionKey>-1</regionKey>
  </GetRegions>
  </soap:Body>
  </soap:Envelope>
  `;
  return fetch(service, {
    method: 'post',
    body: requestStr,
    headers: {
      'Content-Type': 'text/xml',
    },
  })
    .then((res) => res.text())
    .then((xml) => parser.parseStringPromise(xml))
    .then((result) => result['soap:Envelope']['soap:Body'][0]['GetRegionsResponse'][0]['GetRegionsResult'][0]['Region'])
    .catch((err) => console.log(err));
};
module.exports = getRegions;
