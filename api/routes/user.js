const { Router } = require('express');
const userController = require('../controllers/user');
const auth = require('../utils/auth');
const router = Router();

router.get('/verify', userController.get.verifyLogin);
router.get('/logout', auth(), userController.get.logout);
router.get('/all-users', auth(), userController.get.allusers);
router.post('/login', userController.post.login);
router.post('/register', userController.post.register);
router.put('/passchange', auth(), userController.put.passChange);
router.put('/namechange', auth(), userController.put.nameChange);
router.delete('/delete', auth(), userController.delete.user);
router.put('/admin-change', auth(), userController.put.adminChange);
module.exports = router;
