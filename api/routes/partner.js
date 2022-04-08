const { Router } = require('express');
const partnerController = require('../controllers/partner');
const auth = require('../utils/auth');
const router = Router();

// router.get('/', contactController.get.all);
router.get('/all', auth(), partnerController.get.all);
router.post('/update', auth(), partnerController.post.update);
router.post('/delete', auth(), partnerController.post.remove);
router.post('/create', auth(), partnerController.post.create);
router.delete('/delete2', auth(), partnerController.delete.remove);
// router.get('/details/:id', auth(), reservationController.get.details)
// router.all('*', auth(), villaController.get.notFound);

module.exports = router;
