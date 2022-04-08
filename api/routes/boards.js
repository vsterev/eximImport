const { Router } = require('express');
const boardController = require('../controllers/board');
const auth = require('../utils/auth');
// const auth = require('../utils/auth');
const router = Router();

// router.get('/', contactController.get.all);
router.get('/all', auth(), boardController.get.all);
router.get('/sync', boardController.get.sync);
router.patch('/update', boardController.patch.update);
router.patch('/update-all', auth(), boardController.patch.updateMany);
// router.post('/create', auth(), resortController.post.create);
// router.get('/details/:id', auth(), reservationController.get.details)
// router.all('*', auth(), villaController.get.notFound);

module.exports = router;
