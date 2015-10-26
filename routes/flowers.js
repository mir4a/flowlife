var express = require('express');
var router = express.Router();
var flowerController = require('../controllers/flower');
var passportConf = require('../config/passport');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/new', flowerController.showAddNewFlower);
router.post('/new', passportConf.isAuthenticated, flowerController.addFlower);
router.get('/:name', passportConf.isAuthenticated, flowerController.showFlower);

module.exports = router;
