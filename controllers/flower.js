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

}


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

  var flower = new Flower({
    name: req.body.name,
    species: req.body.species,
    wateringInterval: req.body.wateringInterval
  });

  Flower.findOne({ name: req.body.name }, function(err, existingFlower) {
    if (existingFlower) {
      req.flash('errors', { msg: `Flower with ${existingFlower.name} name already exist. Please pick another name` });
      return res.redirect('/flower/new');
    }
    flower.save(function(err) {
      if (err) return next(err);
      console.log('Flower ${flower.name} added');
      return res.redirect('/flower/${flower.name}');
    });
  });

};

/**
 * GET /flower/:name
 */
exports.showFlower = function(req, res, next) {

  Flower.findOne({ name: req.params.name }, function(err, flower){
    if (!flower) {
      req.flash('errors', { msg: `No flowers foud with name: ${req.params.name}.` });
      return res.redirect('/flowers');
    }

    res.render('flower/show', {
      title: `Flower: ${flower.name}`,
      flower: flower
    });
  });

}