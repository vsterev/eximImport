const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const service = require('../../config/config').ilUrl;
const { partnerModel } = require('../../models');
const connect = (partner) => {
  const connectionStr = (us, ps) => {
    return `
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Connect xmlns="http://www.megatec.ru/">
      <login>${us}</login>
      <password>${ps}</password>

    </Connect>
  </soap:Body>
</soap:Envelope>
`;
  };
  return partnerModel
    .findOne({ partner })
    .then((res) => {
      return { user: res.user, pass: res.pass };
    })
    .then(({ user, pass }) => {
      return fetch(service, {
        method: 'post',
        body: connectionStr(user, pass),
        headers: {
          'Content-Type': 'text/xml',
        },
      });
    })
    .then((res) => res.text())
    .then((xml) => {
      return parser.parseStringPromise(xml);
    })
    .then((res) => {
      return res['soap:Envelope']['soap:Body'][0]['ConnectResponse'][0]['ConnectResult'][0];
    })
    .catch(console.error);
};
module.exports = connect;
