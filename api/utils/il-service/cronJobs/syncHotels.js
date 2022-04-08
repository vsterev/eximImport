const fetch = require('node-fetch');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
// const MongoClient = require('mongodb').MongoClient;
const { hotelModel } = require('../../../models');
const service = require('../../../config/config').ilUrl;

const requestStr = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetHotels xmlns="http://www.megatec.ru/">
      <countryKey>4</countryKey>
      <regionKey>-1</regionKey>
      <cityKey>-1</cityKey>
    </GetHotels>
  </soap:Body>
</soap:Envelope>`;
const hotelSynchCron = () => {
  return (
    fetch(service, {
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
      // .then((hotels) => {
      //   // console.log(hotels);
      //   const client = MongoClient.connect(mongoUrl);
      //   return Promise.all([hotels, client]);
      // })
      // .then(([hotels, client]) => {
      //   var db = client.db('hotels-api');
      //   return Promise.all([hotels, client, db]);
      // })
      .then((hotels) => {
        const newHotels = hotels.map((hotel) => {
          const _id = +hotel.ID[0];
          const name = hotel.Name[0];
          const code = hotel.Code[0];
          const category = hotel.HotelCategoryID[0];
          const regionId = hotel.RegionID[0];
          const resortId = hotel.CityID[0];
          const resort = hotel.City[0].Name[0];
          const obj = { name, code, resortId, category, regionId, resort };
          // console.log(obj);
          hotelModel.findOneAndUpdate({ _id }, obj, { upsert: true }).catch(console.log);
          // .catch(console.log);
          // db.collection('hotels').update({ _id }, { $set: obj }, { upsert: true }).then(console.log).catch(console.log);
        });
        return hotels;
      })
      .then((hotels) => {
        console.log(`Message --> ${hotels.length} hotels are synchronized with Interlook`);
        return hotels.length;
      })
      .catch((err) => console.log('Error --> synchronizying hotels from Interlook' + err))
  );
};
module.exports = hotelSynchCron;
