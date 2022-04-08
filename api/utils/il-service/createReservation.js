const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const checkFlight = require('./checkFlight');
const { bookingModel } = require('../../models');
const service = require('../../config/config').ilUrl;
const connect = require('./connect');
const MissingIdError = require('../error');
const createReservationMessage = require('./createReservationMessage')
const createReservation = (
  checkIn,
  checkOut,
  tourists,
  hotelKey,
  acKey,
  rcKey,
  rtKey,
  pnKey,
  partnerReservKey,
  flightIn,
  flightOut,
  transferTypeId,
  partner,
  message
) => {
  function diff_month(dt21, dt11) {
    const dt2 = new Date(dt21);
    const dt1 = new Date(dt11);
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    return (diff /= 60 * 60 * 24);
  }
  const ageType = (str) => {
    if (str.toLowerCase() === 'mr' || str.toLowerCase() === 'mr.') {
      return { type: 'Adult', sex: 'Male' };
    }
    if (str.toLowerCase() === 'mrs' || str.toLowerCase() === 'mrs.') {
      return { type: 'Adult', sex: 'Female' };
    }
    if (str.toLowerCase() === 'chd' || str.toLowerCase() === 'chd.' || str.toLowerCase() === 'child') {
      return { type: 'Child', sex: 'Child' };
    }
    if (str.toLowerCase() === 'inf' || str.toLowerCase() === 'inf.') {
      return { type: 'Infant', sex: 'Infant' };
    }
  };

  const touristServiceGenerate = () => {
    let text = '';
    tourists.map((el, i) => {
      text += `\t<TouristService>\n\t\t<ID>0</ID>\n\t\t<TouristID>${i}</TouristID>\n\t\t<ServiceID>1</ServiceID>\n\t</TouristService>\n|`;
    });
    return text;
  };

  const transferGenerate = (tIn, tOut, fInId, fOutID) => {
    let str = '';
    if (flightIn && transferTypeId) {
      str += `           
      <Service xsi:type="TransferService">
      <NMen>${tourists.length}</NMen>
      <StartDate>${checkIn}</StartDate>
      <StartDay>0</StartDay>
      <Duration>1</Duration>
      <TouristCount>${tourists.length}</TouristCount>
      <ID>1</ID>
      <Transfer>
          <ID>${tIn}</ID> //da se promeni
      </Transfer>
      <Transport>
          <ID>${transferTypeId}</ID> //da se promeni
      </Transport>
      <Flight>
      <ID>${fInId}</ID>
      </Flight>
      </Service>`;
    }
    if (flightOut && transferTypeId) {
      str += `           
      <Service xsi:type="TransferService">
        <NMen>${tourists.length}</NMen>
        <StartDate>${checkOut}</StartDate>
        <StartDay>1</StartDay>
        <Duration>1</Duration>
        <TouristCount>${tourists.length}</TouristCount>
        <ID>1</ID>
        <Transfer>
          <ID>${tOut}</ID> //da se promeni
        </Transfer>
        <Transport>
          <ID>${transferTypeId}</ID> //da se promeni
        </Transport>
        <Flight>
        <ID>${fOutID}</ID>
        </Flight>
    </Service>`;
    }
    return str;
  };
  const touristsGenerate = () => {
    let str = '';
    tourists.map((el, i) => {
      let birthDate = '';
      if (el.birthDate) {
        birthDate += `BirthDate="${el.birthDate}"`;
      }
      str += `
      \t<Tourist FirstNameLat="${el.name}" ${birthDate} LastNameLat="" SurNameLat="${el.familyName}" AgeType="${ageType(el.gender)['type']
        }" Sex="${ageType(el.gender)['sex']}" IsMain="${i === 0 ? true : false}" ID="${i}" Phone="${el.phone ? el.phone : ''
        }" Email="${el.email ? el.email : ''}">\n
        \t\t<LocalPassport IssuedBy="" Serie="111" Number="1111111" IssueDate="0001-01-01" EndDate="0001-01-01" />\n
        \t\t<ForeignPassport IssuedBy="" Serie="111" Number="1111111" IssueDate="0001-01-01" EndDate="0001-01-01T00:00:00" />\n
        \t</Tourist>\n
       \t<ParameterPair Key="IsChild">
			\t\t<Value xsi:type="xsd:boolean">${ageType(el.gender)['type']==="Child"?true:false}</Value>
		   \t</ParameterPair>
        `;
    });
    return str;
  };

  const requestStr = (guid, transferIn, transfereOut, fInID, fOutID) => {
    return `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <CreateReservation xmlns="http://www.megatec.ru/">
        <guid>${guid}</guid>
        <reserv HasInvoices="false">
          <Rate>
        <ID>1</ID>
          </Rate>
          <TouristServices>
          ${touristServiceGenerate()}
          </TouristServices>
          <Services>
            <Service xsi:type="HotelService">
              <NMen>${tourists.length}</NMen>
              <Quota>NotChecked</Quota>
              <PacketKey>0</PacketKey>
              <StartDate>${checkIn}</StartDate>
              <Duration>${diff_month(checkOut, checkIn)}</Duration> //vajno
              <TouristCount>${tourists.length}</TouristCount>
              <ID>1</ID>
              <Hotel>
                <ID>${hotelKey}</ID>
              </Hotel>
              <Room>
                <RoomTypeID>${rtKey}</RoomTypeID>
                <RoomCategoryID>${rcKey}</RoomCategoryID>
                <RoomAccomodationID>${acKey}</RoomAccomodationID>
              </Room>
              <PansionID>${pnKey}</PansionID>
            </Service>
            ${transferIn && transfereOut ? transferGenerate(transferIn, transfereOut, fInID, fOutID) : ''}
          </Services>
          <ID>-1</ID>
          <StartDate>${checkIn}</StartDate>
          <EndDate>${checkOut}</EndDate>
          <Tourists>
         ${touristsGenerate()}
          </Tourists>
                  <TourOperatorCode>${partnerReservKey ? partnerReservKey : ''}</TourOperatorCode>
        </reserv>
      </CreateReservation>
    </soap:Body>
  </soap:Envelope>
`;
  };
  // console.log(requestStr('t'));
  // return fetch(service, {
  //   method: 'post',
  //   body: connectionStr,
  //   headers: { 'Content-Type': 'text/xml' },
  // })
  //   .then((guidRes) => guidRes.text())
  //   .then((guidXml) => parser.parseStringPromise(guidXml))
  return connect(partner)
    .then((guid) => {
      // const guid = guidParsed['soap:Envelope']['soap:Body'][0]['ConnectResponse'][0]['ConnectResult'][0];
      if (flightIn) {
        const transferInfoIn = checkFlight(flightIn, hotelKey, true);
        const transferInfoOut = checkFlight(flightOut, hotelKey, false);
        return Promise.all([guid, transferInfoIn, transferInfoOut]);
      }
      return Promise.all([guid]);
    })
    .then(([guid, transferInfoIn, transferInfoOut]) => {
      console.log({transferInfoIn});
      // const [transferIn, flightInId] = transferInfoIn;
      //----------
      // if (transferInfoIn[0]) {
      //   throw new MissingIdError(`flight ${flightIn} is not in IL`);
      // }
      // if (transferInfoOut[0]) {
      //   throw new MissingIdError(`flight ${flightOut} is not in IL`);
      // }
      const transferInId = transferInfoIn && transferInfoIn[0]!==null ? transferInfoIn[0]._id : undefined;
      const flightInId = transferInfoIn ? transferInfoIn[1] : undefined;
      const transferOutId = transferInfoOut && transferInfoOut[0]!==null? transferInfoOut[0]._id : undefined;
      const flightOutId = transferInfoOut ? transferInfoOut[1] : undefined;
      console.log({ transferInfoIn, transferInfoOut, endPoint: service,createReservation: requestStr(guid, transferInId, transferOutId, flightInId, flightOutId) });
      if ((flightIn && !flightInId)) {
        throw new MissingIdError(`flight ${flightIn} is not in IL`);
      }
      if ((flightIn && !flightOutId)) {
        throw new MissingIdError(`flight ${flightOut} is not in IL`);
      }
      const fetching = fetch(service, {
        method: 'post',
        body: requestStr(guid, transferInId, transferOutId, flightInId, flightOutId),
        headers: {
          'Content-Type': 'text/xml',
        },
      });
      return Promise.all([fetching,guid]);
    })
    .then(([res,guid]) => Promise.all([res.text(),guid]))
    .then(([xml, guid]) => {
      return Promise.all([parser.parseStringPromise(xml),guid]);
    })
    .then(([result,guid]) => {
      const response =
        result['soap:Envelope']['soap:Body'][0]['CreateReservationResponse'][0]['CreateReservationResult'][0];
      if (!!response) {
        const el = {};
        el['_id'] = partnerReservKey;
        el.ilKey = response['ExternalID'][0];
        el.ilCode = response['Name'][0];
        el.createdAt = [new Date().toLocaleString('ro')];
        el.partner = partner;
        bookingModel.updateOne({ _id: el['_id'] }, el, { upsert: true }).then(console.log).catch(console.log);
        if (!!message) {
          createReservationMessage(guid, response['ExternalID'][0], message).then(res=>console.log({res})).catch(err=>console.log({err}))
        }
      }
      return response;
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof MissingIdError) {
        throw err;
      }
    });
};
module.exports = createReservation;
