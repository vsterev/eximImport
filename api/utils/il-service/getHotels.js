const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const getHotels = function () {
  const requestStr = `
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
  <GetHotels xmlns="http://www.megatec.ru/">
  <countryKey>4</countryKey>
  <regionKey>-1</regionKey>
  <cityKey>-1</cityKey>
  </GetHotels>
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
    .then((result) => result['soap:Envelope']['soap:Body'][0]['GetHotelsResponse'][0]['GetHotelsResult'][0]['Hotel'])
    .catch((err) => console.log(err));
};
module.exports = getHotels;
