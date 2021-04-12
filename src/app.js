// load .env vars
require('dotenv').config()
// validate .env vars
const validate = require('./models/validate')
// connect database
// require('./models/db').connect().catch(e => console.error('failed to connect to database:', e))
validate([
  'WEBEX_BOT_TOKEN',
])

var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cors = require('cors')
// var Tasks=require('./routes/Tasks');
// var Students=require('./routes/Students');

var xmlparser = require('express-xml-bodyparser')
const expressJwt = require('express-jwt')
const fs = require('fs')
const requestIp = require('request-ip')

const cert_pub = fs.readFileSync('./rsa-public.pem')

const app = express()
// get remote IP address of request client as req.clientIp
app.use(requestIp.mw())
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true }));
app.use(xmlparser());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use json web tokens for everything except these paths
const exceptions = {
  path: [{
    url: /\/api\/v1\/pcce-12-5\/version/i,
    methods: ['GET']
  }, {
    url: /\/api\/v1\/pcce-12-5\/email/i,
    methods: ['POST']
  }, {
    url: /\/api\/v1\/pcce-12-5\/scfe\/agent/i,
    methods: ['GET']
  }, {
    url: /\/api\/v1\/pcce-12-5\/sm\//i,
    methods: ['POST']
  // }, {
  //   url: /\/api\/v1\/pcce\/cs/i,
  //   methods: ['GET','POST','PUT','DELETE']
  }, {
    url: /\/api\/v1\/pcce-12-5\/mc\/(call|image)/i,
    methods: ['GET', 'POST']
  }, {
    url: /\/api\/v1\/pcce-12-5\/mc\/(brand|localizations|config)/i,
    methods: ['GET']
  }, {
    url: /\/api\/v1\/pcce-12-5\/link/i,
    methods: ['GET', 'POST']
  }, {
    url: /\/api\/v1\/pcce-12-5\/public\//i,
    methods: ['GET', 'POST']
  }]
}

app.use(expressJwt({ secret: cert_pub }).unless(exceptions))
//app.use(express.static('/uploads/'));

/*app.use('/resources',express.static(__dirname + '/images'));
So now, you can use http://localhost:5000/resources/myImage.jpg to serve all the images instead of http://localhost:5000/images/myImage.jpg. */
// app.use('/api/v1/pcce/logs', require('./routes/logs'));
// app.use('/api/v1/pcce/cce/team', require('./routes/cce/team'));

const urlBase = '/api/v1/pcce-12-5'
/* public APIs */
app.use(urlBase + '/public', require('./routes/public'))

/* remote application APIs */
app.use(urlBase + '/app', require('./routes/app'))

/* user APIs */
// CCE Teams
app.use(urlBase + '/teams', require('./routes/teams'))
// inbound voice DIDs
app.use(urlBase + '/dids', require('./routes/dids'))
// demo default settings
app.use(urlBase + '/defaults', require('./routes/defaults'))
// available demos
app.use(urlBase + '/demos', require('./routes/demos'))
// dcloud session info
app.use(urlBase + '/session', require('./routes/session'))
// CUIC
app.use(urlBase + '/cuic', require('./routes/cuic'))
// egain email
app.use(urlBase + '/email', require('./routes/email'))
// ldap
app.use(urlBase + '/ldap', require('./routes/ldap'))
// web hosting files / user dropbox
app.use(urlBase + '/files', require('./routes/files'))
// CCE agents
// app.use(urlBase + '/agents', require('./routes/agents'))
// ECE
// app.use(urlBase + '/ece', require('./routes/ece'))
// eGain 17
// app.use(urlBase + '/egain', require('./routes/egain'))
// ECC variables
// app.use(urlBase + '/ecc', require('./routes/ecc'))
// SocialMiner APIs
// app.use(urlBase + '/sm', require('./routes/sm'))
// Finesse
// app.use(urlBase + '/finesse', require('./routes/finesse'))
// Permissions
// app.use(urlBase + '/permissions', require('./routes/permissions'))
// Mobile Connect
// app.use(urlBase + '/mc', require('./routes/mc'))
// Links
// app.use(urlBase + '/link', require('./routes/link'))
// SMS
// app.use(urlBase + '/sms', require('./routes/sms'))
// Bots
// app.use(urlBase + '/bots', require('./routes/bots'))
// Tokens
// app.use(urlBase + '/tokens', require('./routes/tokens'))
// Notifications
// app.use(urlBase + '/notifications', require('./routes/notifications'))
// CUCM
// app.use(urlBase + '/cucm', require('./routes/cucm'))
// CCE
// app.use(urlBase + '/cce', require('./routes/cce'))
// Callgen
// app.use(urlBase + '/callgen', require('./routes/callgen'))
// Templates
// app.use(urlBase + '/templates', require('./routes/templates'))
// User Account Provisioning
// app.use(urlBase + '/provision', require('./routes/provision'))
// Routing registration for phone/facebook/email
// app.use(urlBase + '/routing', require('./routes/routing'))
// list this service's endpoints
// app.use(urlBase + '/endpoints', require('./routes/endpoints'))
// list this service's name and version
app.use(urlBase + '/version', require('./routes/version'))
// check if this user is provisioned in PCCE instance and LDAP
app.use(urlBase + '/provision', require('./routes/provision'))
// get and set user's demo selector configs
// app.use(urlBase + '/demo-selectors', require('./routes/demo-selectors'))
// get and set user's cumulus demo config
app.use(urlBase + '/cumulus', require('./routes/cumulus'))
// get and list verticals
app.use(urlBase + '/vertical', require('./routes/vertical'))
// finesse layout
app.use(urlBase + '/finesse', require('./routes/finesse'))
// outbound campaigns
app.use(urlBase + '/campaign', require('./routes/campaign'))
// reset VPN password
app.use(urlBase + '/password', require('./routes/password'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).send(err)
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).send(err.message)
})


module.exports = app;
