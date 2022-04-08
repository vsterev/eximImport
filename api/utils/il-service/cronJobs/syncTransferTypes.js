const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const service = require('../../../config/config').ilUrl;
const { transferTypeModel } = require('../../../models');
const requestStr = () => {
  return `
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetTransferTypes xmlns="http://www.megatec.ru/" />
  </soap:Body>
</soap:Envelope>`;
};
const syncTransferTypeCron = () => {
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
      const newTransfersType = transfersType.map((transferType) => {
        const _id = +transferType.ID[0];
        const name = transferType.Name[0];
        const code = transferType.Code[0];
        // console.log({ _id, name, code });
        transferTypeModel
          .findOneAndUpdate({ _id }, { $set: { name, code } }, { upsert: true })
          // .then(console.log)
          .catch(console.log);
      });
      return transfersType;
    })
    .then((transfersType) => {
      console.log(`Message --> ${transfersType.length} transfer types are synchronized with Interlook`);
      return transfersType.length;
    })
    .catch((err) => console.log('Error --> synchronizying transfer types from Interlook' + err));
};
module.exports = syncTransferTypeCron;
