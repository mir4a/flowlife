var express = require('express');
var router = express.Router();
var passportConf = require('../config/passport');
var userController = require('../controllers/user');
var flowerController = require('../controllers/flower');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'FlowLife' });
});

/**
 * Routes related to users workflow
 */
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/logout', userController.logout);
router.get('/forgot', userController.getForgot);
router.post('/forgot', userController.postForgot);
router.get('/reset/:token', userController.getReset);
router.post('/reset/:token', userController.postReset);
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);

/**
 * Get all flowers assigned to user
 */
router.get('/flowers', passportConf.isAuthenticated, flowerController.getAllFlowers);

module.exports = router;
