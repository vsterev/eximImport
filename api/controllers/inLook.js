const syncCitiesCron = require('../utils/il-service/synCitiesCron');
const syncHotelsCron = require('../utils/il-service/syncHotelsCron');
// const syncArrivalsCron = require('../utils/il-service/syncArrivalsMongoCron');
const getMinPriceFunc = require('../utils/il-service/getMinPrices2_partials');
const getHotelServiceFunc = require('../utils/il-service/searchHotelServices');
const createReservation = require('../utils/il-service/createReservation');
const checkFlight = require('../utils/il-service/checkFlight');
const cancelReservation = require('../utils/il-service/cancelReservation');
const mapReservationParams = require('../utils/il-service/mapReservParams');
const missingIdError = require('../utils/error');
const { resortModel, hotelModel } = require('../models');
const resort = require('../models/resort');

module.exports = {
  get: {
    getCities: (req, res) => {
      syncCitiesCron()
        .then((rs) => {
          res.status(200).json(rs.length);
        })
        .catch((err) => {
          // res.status(200).json(err.insertedDocs);
          console.log(err);
        });
    },
    getHotels: (req, res) => {
      syncHotelsCron()
        // .then((hotels) => {
        //   let hotelsObj = [];
        //   hotels.forEach((hotel) => {
        //     const _id = +hotel.ID[0];
        //     const name = hotel.Name[0];
        //     const code = hotel.Code[0];
        //     const category = hotel.HotelCategoryID[0];
        //     const regionId = hotel.RegionID[0];
        //     const resortId = hotel.CityID[0];
        //     const hotelObj = { _id, name, code, resortId, category, regionId };
        //     hotelsObj = [...hotelsObj, hotelObj];
        //   });
        //   hotelModel.collection.drop();
        //   return hotelModel.insertMany(hotelsObj);
        //   // return hotelModel.insertMany(hotelsObj, { ordered: false });
        // })
        .then((rs) => res.status(200).json(rs.length))
        .catch((err) => console.log(err));
    },
    // getArrivals: (req, res) => {
    //   syncArrivalsCron()
    //     .then((rs) => res.status(200).json(rs))
    //     .catch((err) => {
    //       console
    //         .log
    //         // `Write errors ${err.insertedIds.length}, inserted contacts ${err.insertedDocs.length}`
    //         // JSON.stringify(err)
    //         ();
    //       return res.status(409).json({ err: 'Dublicated rows!' });
    //     });
    // },
  },
  post: {
    getMinPrice: (req, res) => {
      const arrPrices = [];
      const { checkIn, checkOut, pageSize, cityKey, rowIndexFrom, cacheGuid, serviceType, adults, children, regionKey } = req.body;
      getMinPriceFunc(pageSize, checkIn, checkOut, cityKey, rowIndexFrom, cacheGuid, serviceType, adults, children, regionKey)
        .then(([prices, cacheGuid, totalCount, pageSize, pageIndex, isLastPage, requeststr, result]) => {
          prices.forEach((el, i) => {
            const hotelId = el.HotelKey[0]['_'];
            const hotel = el.HotelName[0]['_'];
            const roomType = el.RdName[0]['_'];
            const accommodation = el.AcName[0]['_'];
            const price = +el.Cost[0]['_'] + +el.AddHotsCost[0]['_'];
            const priceAddWithCost = +el.TotalCost[0]['_']
            arrPrices.push({ id: i + 1, hotel, roomType, accommodation, price, priceAddWithCost, hotelId });
          });
          res
            .status(200)
            .json({ requeststr, result, cacheGuid, totalCount, pageSize, pageIndex, isLastPage, arrPrices });
        })
        .catch((err) => {
          console.log('controls ', err);
          res.status(204).json(err)
        });
    },
    getHotelServices: (req, res) => {
      const arrPrices = [];
      const { checkIn, checkOut, tourists, hotel, pansion, action, k: id, transfer, partner } = req.body;
      // console.log({ checkIn, checkOut, tourists, hotel, pansion });
      // console.log(req.body);
      getHotelServiceFunc(checkIn, checkOut, hotel, pansion, tourists, action, id, transfer, partner)
        .then(([prices, result, transferTypeId, err]) => {
          prices?.forEach((el, i) => {
            const hotel = el.HotelName[0]['_'];
            const hotelKey = el.HotelKey[0]['_'];
            const roomType = el.RdName[0]['_'];
            const rtKey = el.RtKey[0]['_'];
            const rcKey = el.RcKey[0]['_'];
            const accommodation = el.AcName[0]['_'];
            const acKey = el.AcKey[0]['_'];
            const pnKey = el.PnKey[0]['_'];
            const price = +el.Cost[0]['_'] + +el.AddHotsCost[0]['_'];
            const totalCost = el.TotalCost[0]['_'];
            arrPrices.push({
              id: i + 1,
              hotel,
              hotelKey,
              roomType,
              rtKey,
              rcKey,
              accommodation,
              acKey,
              pnKey,
              price,
              totalCost,
            });
          });
          res
            .status(200)
            // .json({ requeststr, result, cacheGuid, totalCount, pageSize, pageIndex, isLastPage, arrPrices });
            .json({ arrPrices, err, transferTypeId });
        })
        .catch((err) => {
          console.log('sega e tuka 2', err);
          // console.log(err instanceof missingIdError);
          // console.log(err.code);
          if (err instanceof missingIdError || err.message==='No prices in IL') {
            //or check by err.code will be correct
            res.status(404).json({ err: err.message });
          }
          // throw err;
        });
    },
    createReservation: (req, res) => {
      const {
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
        message,
        bookOnlyTransfer
      } = req.body;
      createReservation(
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
        message,
        bookOnlyTransfer
      )
        .then((r) => {
          res.status(200).json({ reservKey: r?.ExternalID[0], reservName: r?.Name[0], status: r?.Status[0] });
        })
        .catch((e) => {
          console.log(e);
          if (e instanceof missingIdError) {
            //or check by err.code will be correct
            res.status(404).json({ err: e.message });
          }
        });
    },
    mapReserv: (req, res) => {
      const params = req.body;
      mapReservationParams(params)
        .then((r) => res.status(200).json(r))
        .catch(console.error);
    },
    checkFlight: (req, res) => {
      const { flight, hotelId, isArrival } = req.body;
      checkFlight(flight, hotelId, isArrival);
    },
    cancel: (req, res) => {
      const pKey = req.body.k;
      const { partner } = req.body;
      cancelReservation(pKey, partner)
        .then((r) => res.status(200).json({ status: r }))
        .catch((e) => console.error(e));
    },
  },
  patch: {
    mapReserv: (req, res) => {
      const params = req.body;
      mapReservationParams(params)
        .then((r) => res.status(200).json(r))
        .catch(console.error);
    },
  },
};
