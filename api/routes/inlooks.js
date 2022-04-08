const { Router } = require('express');
const inLookController = require('../controllers/inLook.js');
const auth = require('../utils/auth');
const router = Router();

router.get('/get-cities', auth(), inLookController.get.getCities);
router.get('/get-hotels', auth(), inLookController.get.getHotels);
// router.get('/sync-arrivals', auth(), inLookController.get.getArrivals);
router.post('/min-price', inLookController.post.getMinPrice);
router.post('/hotelservices', inLookController.post.getHotelServices);
router.post('/create-reservation', inLookController.post.createReservation);
router.post('/check-flight', inLookController.post.checkFlight);
router.post('/map', inLookController.post.mapReserv);
router.post('/cancel-reservation', inLookController.post.cancel);
// router.post('/manual-send', auth(), bulkSmsController.post.manualSend);

// router.all('*', auth(), villaController.get.notFound);

module.exports = router;
