var express = require('express');
var router = express.Router();
var passportConf = require('../config/passport');
var userController = require('../controllers/user');

/* GET users listing. */
router.get('/', passportConf.isAuthenticated, userController.getAccount);
router.post('/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
router.post('/password', passportConf.isAuthenticated, userController.postUpdatePassword);
router.post('/delete', passportConf.isAuthenticated, userController.postDeleteAccount);

module.exports = router;
