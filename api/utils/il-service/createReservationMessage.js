const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const service = require('../../config/config').ilUrl;
const createReservationMessage = function (guid, dgKey, message) {
  const requestStr = () => {
    return `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CreateReservationMessage xmlns="http://www.megatec.ru/">
      <guid>${guid}</guid>
      <dgKey>${dgKey}</dgKey>
      <message>${message}</message>
      <senderName>importer</senderName>
    </CreateReservationMessage>
  </soap:Body>
</soap:Envelope>`};

  return fetch(service, {
    method: 'post',
    body: requestStr(guid, dgKey, message),
    headers: {
      'Content-Type': 'text/xml',
    },
  })
    .then((res) => res.text())
    .then((xml) => parser.parseStringPromise(xml))
    // .then((result) => result['soap:Envelope']['soap:Body'][0]['GetHotelsResponse'][0]['GetHotelsResult'][0]['Hotel'])
    .catch((err) => console.log(err));
};
module.exports = createReservationMessage;
