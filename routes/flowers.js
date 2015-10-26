var express = require('express');
var router = express.Router();
var flowerController = require('../controllers/flower');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/new', flowerController.showAddNewFlower);
router.post('/new', flowerController.addFlower);
router.get('/:name', flowerController.showFlower);

module.exports = router;
