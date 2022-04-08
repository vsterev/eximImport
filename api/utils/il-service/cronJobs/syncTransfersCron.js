const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const { transferModel } = require('../../../models')
const connect = require('../connect')
// const {transferModel} = require('models')
const service = require('../../../config/config').ilUrl;
const transferCron = (partner) => {
  // const partner = 'exim'
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
  connect(partner)
    .then((guid) => {
      return fetch(service, {
        method: 'POST',
        body: requestStr(guid),
        headers: {
          'Content-Type': 'text/xml',
        },
      })
    })
    .then((res) => res.text())
    .then((xml) => parser.parseStringPromise(xml))
    .then((parser) => parser['soap:Envelope']['soap:Body'][0]['GetTransfersResponse'][0]['GetTransfersResult'][0]['Data'][0][
      'TransferDirectionInfo'])
    .then((transfers) => {
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
        // transferModel.updateOne({ _id }, { $set: obj }, { upsert: true })
        transferModel.findOneAndUpdate({ _id }, { $set: obj }, { upsert: true })
        // .then(console.log)
        .catch(console.log);
      })
      return transfers;
    })
    .then((transfers) => {
      console.log(`Message --> ${transfers.length} transfers are synchronized with Interlook`);
    })
    .catch((err) => console.log('Error --> synchronizying transfers from Interlook' + err));
}
module.exports = transferCron;