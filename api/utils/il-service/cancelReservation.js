const { bookingModel } = require('../../models');
const service = require('../../config/config').ilUrl;
const fetch = require('node-fetch');
const connect = require('./connect');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
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
    //   .then(console.log)
    // .catch(console.error)
  };
  return (
    bookingModel
      .findOne({ _id: partnerKey, partner })
      .then((reserv) => {
        const ilNumber = reserv.ilCode;
        console.log('eeeeeeeeeeeeeeee', ilNumber);
        if (!!reserv) {
          const dgKey = reserv.ilKey;
          return connect(partner).then((guid) => {
            return cancelFunc(guid, dgKey) //dgKey
              .then((result) => {
                const response =
                  result['soap:Envelope']['soap:Body'][0]['CancelReservationResponse'][0]['CancelReservationResult'][0];
                //   const response = result['soap:Envelope']['soap:Body'][0]['CancelReservationResult'];
                if (!!response) {
                  return bookingModel
                    .findByIdAndRemove(partnerKey)
                    .then((r) => {
                      console.log('removingMongo', r);
                      return `${ilNumber} - canceled`;
                    })
                    .catch(console.log);
                  // return response;
                }
                return 'cancel Error';
              })
              .catch(console.log);
          });
        }
        const pr = new Promise((resolve, reject) => {
          resolve(`reservation with partner № ${partnerKey} not exists or is allready cancelled`);
        });
        return pr;
      })
      // .then((a) => console.log('vasko', a))
      .catch(console.log)
  );
};
module.exports = cancelReservation;
