const fetch = require('node-fetch');
const xml2js = require('xml2js');
const user = 'sol001';
const pass = 'NfC4nWyU';
const parser = new xml2js.Parser();
const pageSize = '10';
const checkIn = '2021-07-27';
const checkOut = '2021-08-05';
const citiKey = '68';

const rowIndexFrom = '21';
const cacheGuid = 'e8725bd1-bbb9-49cf-978f-ee0ead21937e';
// const cacheGuid = '';

const url = {
  eval: 'http://evaluation.solvex.bg/iservice/integrationservice.asmx',
  prod: 'http://iservice.solvex.bg/IntegrationService.asmx',
};
const service = url['prod'];

console.log(service);
const connectionStr = `
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Connect xmlns="http://www.megatec.ru/">
      <login>${user}</login>
      <password>${pass}</password>
    </Connect>
  </soap:Body>
</soap:Envelope>
`;
const requestStr = (guid) => {
  return `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <SearchHotelServicesMinHotel xmlns="http://www.megatec.ru/">
      <guid>${guid}</guid>
      <request>
        <PageSize>${pageSize}</PageSize>
        <RowIndexFrom>${rowIndexFrom}</RowIndexFrom>
        <PartnerKey>4391</PartnerKey>
        <DateFrom>${checkIn}</DateFrom>
        <DateTo>${checkOut}</DateTo>
        <CityKeys>
          <int>${citiKey}</int>
        </CityKeys>
        <Pax>2</Pax>
        <ValidateQuota>true</ValidateQuota>
        ${!!cacheGuid ? `<CacheGuid>${cacheGuid}</CacheGuid>` : ''}
      </request>
    </SearchHotelServicesMinHotel>
  </soap:Body>
</soap:Envelope>
`;
};

fetch(service, {
  method: 'post',
  body: connectionStr,
  headers: {
    'Content-Type': 'text/xml',
  },
})
  .then((res) => res.text())
  .then((xml) => {
    return parser.parseStringPromise(xml);
  })
  .then((res) => {
    return res['soap:Envelope']['soap:Body'][0]['ConnectResponse'][0]['ConnectResult'][0];
  })
  .then((res) => (guid = res))
  .then((guid) => {
    console.time('fetching price');
    console.log(requestStr(guid));
    return fetch(service, {
      method: 'post',
      body: requestStr(guid),
      headers: {
        'Content-Type': 'text/xml',
      },
    })
      .then((res) => res.text())
      .then((xml) => {
        return parser.parseStringPromise(xml);
      })
      .then((result) => {
        console.time('fetching price');
        const prices =
          result['soap:Envelope']['soap:Body'][0]['SearchHotelServicesMinHotelResponse'][0][
            'SearchHotelServicesMinHotelResult'
          ][0]['Data'][0]['DataRequestResult'][0]['ResultTable'][0]['diffgr:diffgram'][0]['DocumentElement'][0][
            'HotelServices'
          ];
        const cacheGuid =
          result['soap:Envelope']['soap:Body'][0]['SearchHotelServicesMinHotelResponse'][0][
            'SearchHotelServicesMinHotelResult'
          ][0]['Data'][0]['DataRequestResult'][0]['ResponseGuid'][0];
        const totalCount =
          result['soap:Envelope']['soap:Body'][0]['SearchHotelServicesMinHotelResponse'][0][
            'SearchHotelServicesMinHotelResult'
          ][0]['Data'][0]['DataRequestResult'][0]['TotalCount'][0];
        const pageSize =
          result['soap:Envelope']['soap:Body'][0]['SearchHotelServicesMinHotelResponse'][0][
            'SearchHotelServicesMinHotelResult'
          ][0]['Data'][0]['DataRequestResult'][0]['PageSize'][0];
        const pageIndex =
          result['soap:Envelope']['soap:Body'][0]['SearchHotelServicesMinHotelResponse'][0][
            'SearchHotelServicesMinHotelResult'
          ][0]['Data'][0]['DataRequestResult'][0]['PageIndex'][0];
        const isLastPage =
          result['soap:Envelope']['soap:Body'][0]['SearchHotelServicesMinHotelResponse'][0][
            'SearchHotelServicesMinHotelResult'
          ][0]['Data'][0]['DataRequestResult'][0]['IsLastPage'][0];
        return Promise.all([prices, cacheGuid, totalCount, pageSize, pageIndex, isLastPage]);
      })
      .then(([prices, cacheGuid, totalCount, pageSize, pageIndex, isLastPage]) => {
        console.timeEnd('fetching price');
        console.log('cacheGuide', cacheGuid);
        console.log('totalCount', totalCount);
        console.log('pageSize', pageSize);
        console.log('pageIndex', pageIndex);
        console.log('isLastPage', isLastPage);
        prices.forEach((el, i) => {
          const hotel = el.HotelName[0]['_'];
          const roomType = el.RdName[0]['_'];
          const price = +el.Cost[0]['_'] + +el.AddHotsCost[0]['_'];
          console.log(`${i + 1}; ${hotel}; ${roomType}; ${price}`);
        });
      });
  })
  .catch((err) => console.log(err));
