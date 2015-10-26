var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var compress = require('compression');
var lusca = require('lusca');

var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');

// Secrets and passport conf
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

var routes = require('./routes/index');
var users = require('./routes/users');
var flowers = require('./routes/flowers');


var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function () {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(compress());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, autoReconnect: true })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));

app.use(function(req, res, next) {
  //TODO: I'm not sure if this is a good idea store all info about user at res.locals.
  // Let's assume he has large collection of flowers, how this will affect the app?
  res.locals.user = req.user;
  next();
});

app.use('/', routes);
app.use('/account', users);
app.use('/flower', flowers);

// catch 404 and forward to error handler
app.use(function ( req, res, next ) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


var kue = require('kue'),
  cluster = require('cluster'),
  queue = kue.createQueue();

kue.app.listen(3055);

//var clusterWorkerSize = require('os').cpus().length;
//
//if ( cluster.isMaster ) {
//  for (var i = 0; i < clusterWorkerSize; i++) {
//    cluster.fork();
//  }
//} else {
//  queue.process('email', 10, function ( job, done ) {
//    var pending = 5
//      , total = pending;
//
//    var interval = setInterval(function () {
//      job.log('sending!');
//      job.progress(total - pending, total);
//      --pending || done();
//      pending || clearInterval(interval);
//    }, 1000);
//  });
//}

// error handlers

// development error handler
// will print stacktrace
if ( app.get('env') === 'development' ) {
  app.use(function ( err, req, res, next ) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function ( err, req, res, next ) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
