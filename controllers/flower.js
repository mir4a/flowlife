var async = require('async');
var nodemailer = require('nodemailer');
var Flower = require('../models/Flower');
var User = require('../models/User');
var wateringHelper = require('../helpers/wateringHelper');
var mailerHelper = require('../helpers/mailerHelper');
var urlHelper = require('../helpers/urlHelper');

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

      //FIXME: Refactor with mailerHelper
      var nextWatering = wateringHelper.nextWateringTime(new Date(), req.body.wateringInterval);

      var emailSettings = {
        to: res.locals.user.email,
        subject: `Don't forget to watering your ${req.body.name} flower`,
        url: urlHelper.fullUrl(''),
        user: {
          name: res.locals.user.profile.name || 'Dear FlowLife user'
        },
        flower: {
          name: req.body.name,
          link: urlHelper.fullUrl(req.body.name, 'flower/')
        },
        delay: nextWatering
      };

      mailerHelper.createEmailJob(emailSettings);
      return res.redirect(`/flower/${encodeURIComponent(req.body.name)}`);
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
      { $limit: 1 },
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
    var nextWatering = wateringHelper.nextWateringTime(flower.lastWatering, flower.wateringInterval);

    res.render('flower/show', {
      title: `Flower: ${flower.name}`,
      flower: {
        name: flower.name,
        species: flower.species,
        live: flower.live,
        wateringInterval: flower.wateringInterval,
        wateringCounter: flower.wateringCounter,
        nextWatering: nextWatering,
        lastWatering: flower.lastWatering.toUTCString()
      }
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