const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const MongoClient = require('mongodb').MongoClient;
const service = require('../../config/config').ilUrl;
const mongoUrl = require('../../config/config').dataBaseUrl;

const connectionStr = (user, pass) => {
  return `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Connect xmlns="http://www.megatec.ru/">
      <login>${user}</login>
      <password>${pass}</password>
    </Connect>
  </soap:Body>
</soap:Envelope>
`};
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
MongoClient.connect(mongoUrl)
  .then(client => {
    const db = client.db('hotels-api');
    return Promise.all([client, db])
  })
  .then(([client, db]) => {
    const partner = db.collection('partners').findOne({ partner: "exim" });
    return Promise.all([client, db, partner])
  })
  .then(([client, db, partner]) => {
    const user = partner.user;
    const pass = partner.pass;
    const guid = fetch(service, {
      method: 'POST',
      body: connectionStr(user, pass),
      headers: {
        'Content-Type': 'text/xml',
      },
    })
    return Promise.all([client, guid])
  })
  .then(([client, res]) => {
    const xml = res.text()
    return Promise.all([client, xml])
  })
  .then(([client, xml]) => {
    const parsed = parser.parseStringPromise(xml);
    return Promise.all([client, parsed])
  })
  .then(([client, parsed]) => {
    const guid = parsed['soap:Envelope']['soap:Body'][0]['ConnectResponse'][0]['ConnectResult'][0];
    return Promise.all([client, guid])
  })
  .then(([client, guid]) => {
    const transferReq = fetch(service, {
      method: 'POST',
      body: requestStr(guid),
      headers: {
        'Content-Type': 'text/xml',
      },
    })
    return Promise.all([client, transferReq])
  })
  .then(([client, res]) => {
    const xml = res.text();
    return Promise.all([client, xml])
  })
  .then(([client, xml]) => {
    const parsed = parser.parseStringPromise(xml);
    return Promise.all([client, parsed])
  })
  .then(([client, parser]) => {
    const transfers = parser['soap:Envelope']['soap:Body'][0]['GetTransfersResponse'][0]['GetTransfersResult'][0]['Data'][0][
      'TransferDirectionInfo']
    return Promise.all([client, transfers])
  })
  .then(([client, transfers]) => {
    const db = client.db('hotels-api');
    transfers.map(transfer => {
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
      const obj = { name, transferTypeId, transferTypeName, cityFromId, cityFromName, cityToId, cityToName, pointFromId, pointFromName, pointToId, pointToName }
      db.collection('transfers')
        .updateOne({ _id }, { $set: obj }, { upsert: true })
    })
      // .then(console.log)
      // .catch(console.log);
      client.close();
      return Promise.all([transfers, client])
  })
  .then(([transfers, client]) => {
    console.log(`Message --> ${transfers.length} transfers are synchronized with Interlook`);
    client.close();
  })
  .catch((err) => console.log('Error --> synchronizying transfers from Interlook' + err));
