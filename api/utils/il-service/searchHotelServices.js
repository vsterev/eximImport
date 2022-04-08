const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const { bookingModel } = require('../../models');
const service = require('../../config/config').ilUrl;
const connect = require('./connect');
const actionValues = ['new', 'cancel', 'update'];

const mapping = require('./mapReservParams');
const searchHotelServices = (checkIn, checkOut, hotelName, pansion, tourists, action, id, transfer, partner) => {
  function diff_years(dt21, dt11) {
    const dt2 = new Date(dt21);
    const dt1 = new Date(dt11);
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60 * 24;
    return Math.abs(Math.round(diff / 365.25));
  }

  const requestStr = (guid, hotelId, pansionId) => {
  const serializedToruists = tourists.map(el=>{
      const ages = diff_years(el.birthDate, checkIn)
      return {...el, ages}
    }).sort((a,b)=>+b.ages-+a.ages)
    return `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <SearchHotelServices xmlns="http://www.megatec.ru/">
      <guid>${guid}</guid>
      <request>
        <PageSize>50</PageSize>
        <DateFrom>${checkIn}</DateFrom>
        <DateTo>${checkOut}</DateTo>
        <HotelKeys>
        <int>${hotelId}</int>
      </HotelKeys>
      <PansionKeys>
        <int>${pansionId}</int>
      </PansionKeys>
          <Pax>${serializedToruists.length}</Pax>
        <Ages>${serializedToruists.map
          ((el) => {
      if (el.birthDate) {
        // return `<int>${diff_years(el.birthDate, checkIn)}</int>`;
        return `<int>${el.ages}</int>`;
      }
    })}
        </Ages>
        <ResultView>1</ResultView>
        <Mode>0</Mode>
      </request>
    </SearchHotelServices>
  </soap:Body>
</soap:Envelope>
`;
  };
  if (action === 'new' || action === 'cancel') {
    return bookingModel.findOne({ _id: id, partner }).then((r) => {
      if (!r & (action === 'new')) {
        return syncIl();
      } else if (!r & (action === 'cancel')) {
        const pr = 'not exists in IL';
        return Promise.all([undefined, undefined, undefined, pr]);
      }
      const pr = 'IL number - ' + r.ilCode;
      return Promise.all([undefined, undefined, undefined, pr]);
    });
  } else {
    const pr = new Promise((resolve, reject) => {
      return resolve('Action different from new or cancel');
    });
    return Promise.all([undefined, undefined, undefined, pr]);
  }
  function syncIl() {
    return Promise.all([connect(partner), mapping({ pansion, hotelName, transfer, partner })])
      .then(([guid, { pansionId, hotelId, transferTypeId }]) => {
        console.log(requestStr(guid, hotelId, pansionId));
        const fetching = fetch(service, {
          method: 'post',
          body: requestStr(guid, hotelId, pansionId),
          headers: {
            'Content-Type': 'text/xml',
          },
        });
        return Promise.all([fetching, transferTypeId]);
      })
      .then(([res, transferTypeId]) => Promise.all([res.text(), transferTypeId]))
      .then(([xml, transferTypeId]) => {
        return Promise.all([parser.parseStringPromise(xml), transferTypeId]);
      })
      .then(([result, transferTypeId]) => {
        // console.time('fetching price');
        if (+result['soap:Envelope']['soap:Body'][0]['SearchHotelServicesResponse'][0]['SearchHotelServicesResult'][0][
          'Data'
        ][0]['DataRequestResult'][0]['TotalCount'][0]!== 0) {
          const prices =
            result['soap:Envelope']['soap:Body'][0]['SearchHotelServicesResponse'][0]['SearchHotelServicesResult'][0][
            'Data'
            ][0]['DataRequestResult'][0]['ResultTable'][0]['diffgr:diffgram'][0]['DocumentElement'][0]['HotelServices'];
          return Promise.all([prices, result, transferTypeId])
        }
        throw new Error ('No prices in IL')
      })
      .catch((err) => {
        console.error('epa tuka li e 1', err);
        throw err;
      });
  }
};
module.exports = searchHotelServices;
