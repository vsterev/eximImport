const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const MongoClient = require('mongodb').MongoClient;
const service = require('../../config/config').ilUrl;
const mongoUrl = require('../../config/config').dataBaseUrl;

const requestStr = () => {
  return `
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetTransferTypes xmlns="http://www.megatec.ru/" />
  </soap:Body>
</soap:Envelope>`;
};

return fetch(service, {
  method: 'post',
  body: requestStr(),
  headers: {
    'Content-Type': 'text/xml',
  },
})
  .then((res) => res.text())
  .then((xml) => {
    return parser.parseStringPromise(xml);
  })
  .then(
    (result) =>
      result['soap:Envelope']['soap:Body'][0]['GetTransferTypesResponse'][0]['GetTransferTypesResult'][0]['Transport']
  )
  .then((transfersType) => {
    const client = MongoClient.connect(mongoUrl);
    // const client = MongoClient.connect('mongodb://127.0.0.1:27017/hotels-api');
    return Promise.all([transfersType, client]);
  })
  .then(([transfersType, client]) => {
    var db = client.db('hotels-api');
    return Promise.all([transfersType, client, db]);
  })
  .then(([transfersType, client, db]) => {
    const newTransfersType = transfersType.map((transferType) => {
      const _id = +transferType.ID[0];
      const name = transferType.Name[0];
      const code = transferType.Code[0];
      db.collection('transfer-types')
        .update({ _id }, { $set: { name, code } }, { upsert: true })
        .then(console.log)
        .catch(console.log);
    });
    return Promise.all([transfersType, client]);
  })
  .then(([transfersType, client]) => {
    console.log(`Message --> ${transfersType.length} transfer types are synchronized with Interlook`);
    client.close();
  })
  .catch((err) => console.log('Error --> synchronizying transfer types from Interlook' + err));
