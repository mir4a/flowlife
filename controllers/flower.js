var async = require('async');
var nodemailer = require('nodemailer');
var Flower = require('../models/Flower');
var User = require('../models/User');


/**
 * GET /flower/new
 * Show add new flower form
 */
exports.showAddNewFlower = function(req, res, next) {

  res.render('flower/new', {
    title: 'Add new flower'
  });

};


/**
 * POST /flower/new
 * Add new flower
 */
exports.addFlower = function(req, res, next) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('species', 'Species cannot be blank').notEmpty();
  req.assert('wateringInterval', 'Watering Interval should be a number').isInt();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/flower/new');
  }

  User.findOne({ email: res.locals.user.email }, function ( err, user ) {
    if (err) throw err;
    user.flowers.push({
      name: req.body.name,
      species: req.body.species,
      wateringInterval: req.body.wateringInterval
    });
    user.save(function(err){
      if (err) next(err);
      console.log(`Flower ${user.flowers[user.flowers.length - 1].name} added`);
      return res.redirect(`/flower/${encodeURI(user.flowers[user.flowers.length - 1].name)}`);
    });
  });


};

/**
 * GET /flower/:name
 */
exports.showFlower = function(req, res, next) {

  User
    .aggregate(
      { $match: { email: res.locals.user.email } },
      { $unwind: '$flowers' },
      { $match: { 'flowers.name': req.params.name } },
      { $project: { _id: 0, flower: '$flowers' } }
    )
    .exec(showFlowerCb);

  function showFlowerCb(err, doc) {
    if (err) next(err);
    if (!doc) {
      req.flash('errors', { msg: `No flowers with name: ${req.params.name} were find` });
      return res.redirect('/flowers');
    }

    var flower = doc[0].flower;

    res.render('flower/show', {
      title: `Flower: ${flower.name}`,
      flower: flower
    });
  }

};

/**
 * GET /flowers
 * Get all user's flowers
 */
exports.getAllFlowers = function(req, res, next) {

  res.render('flower/all', {
    title: 'All of my flowers'
  });

};