const { Router } = require('express');
const TransferTypeController = require('../controllers/transferType');
const auth = require('../utils/auth');
// const auth = require('../utils/auth');
const router = Router();

// router.get('/', contactController.get.all);
router.get('/all', auth(), TransferTypeController.get.all);
router.get('/sync', TransferTypeController.get.sync);
router.patch('/update-all', auth(), TransferTypeController.patch.updateMany);
// router.get('/details/:id', auth(), reservationController.get.details)
// router.all('*', auth(), villaController.get.notFound);

module.exports = router;
