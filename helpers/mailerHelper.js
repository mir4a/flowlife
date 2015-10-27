var nodemailer = require('nodemailer');
var secrets = require('../config/secrets');
var kue = require('kue');
var queue = kue.createQueue();
var hbs = require('nodemailer-express-handlebars');
var transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: secrets.mailgun
});
var handlebarOpt = {
  viewEngine: 'handlebar',
  viewPath: 'views/emails'
};

transporter.use('compile', hbs(handlebarOpt));

module.exports = {
  sendEmail: sendEmail,
  createEmailJob: createEmailJob
};

function sendEmail( settings, next ) {
  settings.current_year = new Date().getFullYear();
  var mail = {
    from: 'marty.mir4a@gmail.com',
    to: settings.to,
    subject: settings.subject,
    template: 'base',
    context: settings
  };

  transporter.sendMail(mail, next);

}

function createEmailJob( settings, next ) {
  var email = queue.create('email', {
    title: `Email to ${settings.to} with subject: ${settings.subject}`,
    settings: settings
  })
    .delay(settings.delay)
    .priority('high')
    .save();

  email.on('complete', function(result){
    email.log('Job completed with data ', result);

  }).on('failed attempt', function(errorMessage, doneAttempts){
    email.log('Job failed');

  }).on('failed', function(errorMessage){
    email.log('Job failed');

  }).on('progress', function(progress, data){
    email.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );

  });

  queue.process('email', function ( job, done ) {
    sendEmail(settings, done);
  });

  queue.on( 'error', function( err ) {
    console.log( 'Oops... ', err );
  });

  return email;
}
