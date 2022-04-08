const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
// const MongoClient = require('mongodb').MongoClient;
const { boardModel } = require('../../../models');
const service = require('../../../config/config').ilUrl;

const requestStr = `
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetPansions xmlns="http://www.megatec.ru/" />
  </soap:Body>
</soap:Envelope>`;
const boardSynchCron = () => {
  return fetch(service, {
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
      //do tuk
      const newBoards = boards.map((board) => {
        const _id = +board.ID[0];
        const name = board.Name[0];
        const code = board.Code[0];
        // return { _id, name, code };
        // console.log({ _id, name, code });
        boardModel
          .findOneAndUpdate({ _id }, { $set: { name, code } }, { upsert: true })
          // .then((res) => console.log({ res }))
          .catch(console.log);
      });
      // console.log(newBoards);
      // const inserted = db.collection('boards').insertMany(newBoards);
      return boards;
    })
    .then((boards) => {
      console.log(`Message --> ${boards.length} boards are synchronized with Interlook`);
      return boards.length;
    })
    .catch((err) => console.log('Error --> synchronizying boards from Interlook' + err));
};
module.exports = boardSynchCron;
