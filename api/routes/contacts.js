const { Router } = require('express');
const contactController = require('../controllers/contact');
const auth = require('../utils/auth');
const limiter = require('../utils/limiter');
const router = Router();

router.get('/', auth(), contactController.get.all);
router.get('/checkout/:date', auth(), contactController.get.checkOut);
router.get('/checkin/:date', auth(), contactController.get.checkIn);
router.get('/get-reservation/:cryptedResId', limiter(15, 4), contactController.get.getRes);
router.get('/checkIn-message-contact-check/:date', auth(), contactController.get.checkCheckInContacts);
router.get('/checkOut-message-contact-check/:date', auth(), contactController.get.checkCheckOutContacts);
router.get('/all-without-planned/transsfer/:date', auth(), contactController.get.getAllWatingTransfer);
router.get('/contacts/test', auth(), contactController.get.testIncludeArr);
router.post('/update', auth(), contactController.post.update);
router.post('/update-many', auth(), contactController.post.updateMany);
router.post('/update-many-array', auth(), contactController.post.updataArrayContacts);
router.post('/checkout', auth(), contactController.post.checkOut);
router.post('/checkin', auth(), contactController.post.checkIn);

module.exports = router;
