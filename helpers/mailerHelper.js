var nodemailer = require('nodemailer'),
    secrets = require('../config/secrets'),
    transporter = nodemailer.createTransport({
      service: 'Mailgun',
      auth: secrets.mailgun
    });

module.exports = {

};