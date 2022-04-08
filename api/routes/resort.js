const { Router } = require('express');
const resortController = require('../controllers/resort');
const auth = require('../utils/auth');
const router = Router();

// router.get('/', contactController.get.all);
router.get('/all', resortController.get.allResorts);
router.post('/create', auth(), resortController.post.create);
// router.get('/details/:id', auth(), reservationController.get.details)
// router.all('*', auth(), villaController.get.notFound);

module.exports = router;
