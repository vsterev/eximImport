const { bookingModel } = require('../../models');
const service = require('../../config/config').ilUrl;
const fetch = require('node-fetch');
const connect = require('./connect');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const MissingIdError = require('../error');

const cancelReservation = (partnerKey, partner) => {
  const str = (token, bKey) => {
    return ` <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <CancelReservation xmlns="http://www.megatec.ru/">
          <guid>${token}</guid>
          <dgKey>${bKey}</dgKey>
          <annulReasonID>1001</annulReasonID>
          <note>cancel via automatic synchronization parser - ${new Date()}</note>
        </CancelReservation>
      </soap:Body>
    </soap:Envelope>
        `;
  };
  const cancelFunc = (guid, bKey) => {
    return fetch(service, {
      method: 'post',
      body: str(guid, bKey),
      headers: {
        'Content-Type': 'text/xml',
      },
    })
      .then((res) => res.text())
      .then((xml) => parser.parseStringPromise(xml));
  };
  let ilNumber = '';
  return (
    bookingModel
      .findOne({ _id: partnerKey, partner })
      .then((reserv) => {
        ilNumber = reserv?.ilCode;
        console.log('eeeeeeeeeeeeeeee', ilNumber);
        if (!reserv) {
          throw new MissingIdError(`reservation with partner № ${partnerKey} not exists or is allready cancelled`)
        }
        const dgKey = reserv.ilKey;
        const guid = connect(partner)//tuk
        return Promise.all([guid, dgKey])
      })
      .then(([guid, dgKey]) => {
        return cancelFunc(guid, dgKey)
      })
      .then((result) => {
        console.log(JSON.stringify(result));
        const response =
          result['soap:Envelope']['soap:Body'][0]['CancelReservationResponse'][0]['CancelReservationResult'][0];
        //   const response = result['soap:Envelope']['soap:Body'][0]['CancelReservationResult'];
        if (!response) {
          throw new Error('no correct response from IL API')
        }
        return bookingModel
          .findByIdAndRemove(partnerKey)
      })
      .then((r) => {
        console.log('removingMongo', r);
        return `${ilNumber} - canceled`;
      })
      .catch(err => {
        console.log('CancelReservation -> ' + err);
        if (err instanceof MissingIdError) {
          throw err;
        }
      })
  );
};
module.exports = cancelReservation;
