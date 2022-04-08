const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const { hotelModel } = require('../../models');
const requestStr = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetHotels xmlns="http://www.megatec.ru/">
      <countryKey>4</countryKey>
      <regionKey>-1</regionKey>
      <cityKey>-1</cityKey>
    </GetHotels>
  </soap:Body>
</soap:Envelope>`;
const syncHotelsCron = () => {
  return fetch('http://evaluation.solvex.bg/iservice/integrationservice.asmx', {
    method: 'post',
    body: requestStr,
    headers: {
      'Content-Type': 'text/xml',
    },
  })
    .then((res) => res.text())
    .then((xml) => {
      return parser
        .parseStringPromise(xml)
        .then(
          (result) => result['soap:Envelope']['soap:Body'][0]['GetHotelsResponse'][0]['GetHotelsResult'][0]['Hotel']
        )
        .catch((err) => console.log(err));
    })
    .then((hotels) => {
      const deleted = hotelModel.collection.drop();
      const hotelModified = hotels.map((hotel) => {
        const _id = +hotel.ID[0];
        const name = hotel.Name[0];
        const code = hotel.Code[0];
        const category = hotel.HotelCategoryID[0];
        const regionId = hotel.RegionID[0];
        const resortId = hotel.CityID[0];
        return { _id, name, code, resortId, category, regionId };
      });
      const inserted = hotelModel.insertMany(hotelModified, { ordered: false });
      return Promise.all([inserted, deleted]);
    })
    .then(([inserted, deleted]) => {
      console.log(`Message --> ${inserted.length} hotels are synchronized with Interlook`);
      return inserted;
    })
    .catch((err) => console.log(err));
};
module.exports = syncHotelsCron;
