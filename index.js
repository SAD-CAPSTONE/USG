require('dotenv').config();
var express = require('express');
var fs = require('fs');
var https = require('https');
var path = require('path');
var winston = require('winston');
var passportSetup = require('./config/passport-setup');

var app = express();
require('./app')(app);

var httpsOptions = {
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
}

var server = https.createServer(httpsOptions, app)
  .listen(app.get('port'), () => {
      console.log(`ExpressJS server listening to port ${app.get('port')}`);
  });

// var server = app.listen(app.get('port'), () => {
//     console.log(`ExpressJS server listening to port ${app.get('port')}`);
// });
