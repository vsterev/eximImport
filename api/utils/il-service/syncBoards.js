const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const MongoClient = require('mongodb').MongoClient;
// const { service, mongoUrl } = require('./config');
const service = require('../../config/config').ilUrl;
const mongoUrl = require('../../config/config').dataBaseUrl;

const requestStr = `
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetPansions xmlns="http://www.megatec.ru/" />
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
  .then(
    (result) => result['soap:Envelope']['soap:Body'][0]['GetPansionsResponse'][0]['GetPansionsResult'][0]['Pansion']
  )
  .then((boards) => {
    const client = MongoClient.connect(mongoUrl);
    return Promise.all([boards, client]);
  })
  .then(([boards, client]) => {
    var db = client.db('hotels-api');
    // const dropped = db.collection('boards');
    // let dropAct = undefined;
    // if (dropped) {
    //   dropAct = dropped.drop().catch((err) => null);
    // }
    // return Promise.all([boards, client, db, dropAct]);
    return Promise.all([boards, client, db]);
  })
  .then(([boards, client, db]) => {
    //do tuk
    const newBoards = boards.map((board) => {
      const _id = +board.ID[0];
      const name = board.Name[0];
      const code = board.Code[0];
      // return { _id, name, code };
      db.collection('boards')
        .update({ _id }, { $set: { name, code } }, { upsert: true })
        .then(console.log)
        .catch(console.log);
    });
    // console.log(newBoards);
    // const inserted = db.collection('boards').insertMany(newBoards);
    return Promise.all([boards, client]);
  })
  .then(([boards, client]) => {
    console.log(`Message --> ${boards.length} boards are synchronized with Interlook`);
    client.close();
  })
  .catch((err) => console.log('Error --> synchronizying boards from Interlook' + err));
