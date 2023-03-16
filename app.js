var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var fs = require('fs');
var session = require('express-session');
var passport = require('passport');
var swaggerUi = require('swagger-ui-express');
var yaml = require('js-yaml');
var moment = require('moment');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo');
var flash = require('connect-flash');
var multer = require('multer');
var http = require('http');
// var cron = require('./services/cronjob');
//new addons
// var cron = require('node-cron');
//new addons
// configs
require('dotenv').config({
  path: `./env-files/${process.env.ENV || 'dev'}.env`,
});

user_role = []


// profiling for the servers
console.log('current env:', process.env.ENV);
global.APPDIR = path.resolve(__dirname).toString();
global.CONFIGS = require('./configs/config.json');
var swaggerDoc = yaml.load(fs.readFileSync('./configs/swagger.yaml'));

//correcting swagger host and base path
(function () {
  console.log("updating swagger");
  swaggerDoc.host = process.env.BASEURL + ':' + process.env.PORT;
  swaggerDoc.basePath = '/v' + process.env.VERSION + '/';
})();

// connect mongodb
require('./models/dbConnections');

var app = express();
// app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  
  store: MongoStore.create({ mongoUrl: process.env.DBURI }),
  secret: process.env.SECRETKEY,
  resave: true,
  saveUninitialized: true,
}));

app.use(flash());

console.log("here")
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// // initialise the passport session
// require('./services/passportAuthenticate')(passport);
// app.use(passport.initialize());
// app.use(passport.session());

// request cros
app.use(function (req, res, next) {
  res.locals = { siteUrl: process.env.WEBURL, moment: moment, sess: req.user, configs: global.CONFIGS };
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,authToken,Authorization,Content-Type,Accept");
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

console.log("version", process.env.VERSION)


var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({ storage: storage }).array('userPhoto', 2);

// routes
app.use('/v' + process.env.VERSION + '/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/v' + process.env.VERSION + '/', require('./routes/api.js'));
app.use('/api', require('./routes/api.js')); 



app.get('*', function (req, res) {
  res.redirect('/' + 'admin')
})



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  })
});

module.exports = app;
