const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const MongoClient = require('mongodb').MongoClient;
// const { service, mongoUrl } = require('./config');
const service = require('../../config/config').ilUrl;
const mongoUrl = require('../../config/config').dataBaseUrl;
const { partnerModel } = require('../../models');
const connect = require('./connect');

const requestStr = (guid) => {
  return `
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetTransfers xmlns="http://www.megatec.ru/">
      <guid>${guid}</guid>
      <request>
        <CityKey>-1</CityKey>
      </request>
    </GetTransfers>
  </soap:Body>
</soap:Envelope>`;
};
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
 const partner = 'exim';
connect(partner)
  .then((guid) => {
    return fetch(service, {
      method: 'post',
      body: requestStr(guid),
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  })
  .then((res) => res.text())
  .then((xml) => {
    return parser.parseStringPromise(xml);
  })
  .then(
    (result) =>
      result['soap:Envelope']['soap:Body'][0]['GetTransfersResponse'][0]['GetTransfersResult'][0]['Data'][0][
        'TransferDirectionInfo'
      ]
  )
  .then((transfers) => {
    const client = MongoClient.connect(mongoUrl);
    return Promise.all([transfers, client]);
  })
  .then(([transfers, client]) => {
    var db = client.db('hotels-api');
    const dropped = db.collection('transfers');
    let dropAct = undefined;
    if (dropped) {
      dropAct = dropped.drop().catch((err) => null);
    }
    return Promise.all([transfers, client, db, dropAct]);
  })
  .then(([transfers, client, db]) => {
    const newTransfers = transfers.map((transfer) => {
      const _id = +transfer['$'].Id;
      const name = transfer['$'].Name;
      const transferTypeId = transfer['$'].TransferTypeId;
      const transferTypeName = transfer['$'].TransferTypeName;
      const cityFromId = transfer['$'].CityFromId;
      const cityFromName = transfer['$'].CityFromName;
      const cityToId = transfer['$'].CityToId;
      const cityToName = transfer['$'].CityToName;
      const pointFromId = transfer['$'].PointFromId;
      const pointFromName = transfer['$'].PointFromName;
      const pointToId = transfer['$'].PointToId;
      const pointToName = transfer['$'].PointToName;
      return {
        _id,
        name,
        transferTypeId,
        transferTypeName,
        cityFromId,
        cityFromName,
        cityToId,
        cityToName,
        pointFromId,
        pointFromName,
        pointToId,
        pointToName,
      };
    });
    const inserted = db.collection('transfers').insertMany(newTransfers).catch(console.log);
    return Promise.all([transfers, client]);
  })
  .then(([transfers, client]) => {
    console.log(`Message --> ${transfers.length} transfers are synchronized with Interlook`);
    client.close();
  })
  .catch((err) => console.log('Error --> synchronizying transfers from Interlook' + err));
