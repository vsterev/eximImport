const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const getCities = function () {
  const requestStr = `
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetCities xmlns="http://www.megatec.ru/">
      <countryKey>4</countryKey>
      <regionKey>-1</regionKey>
    </GetCities>
  </soap:Body>
</soap:Envelope>`;
  return fetch('http://evaluation.solvex.bg/iservice/integrationservice.asmx', {
    method: 'post',
    body: requestStr,
    headers: {
      'Content-Type': 'text/xml',
    },
  })
    .then((res) => res.text())
    .then((xml) => parser.parseStringPromise(xml))
    .then((result) => result['soap:Envelope']['soap:Body'][0]['GetCitiesResponse'][0]['GetCitiesResult'][0]['City'])
    .catch((err) => console.log(err));
};
module.exports = getCities;
