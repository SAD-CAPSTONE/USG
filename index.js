require('dotenv').config();
var express = require('express');
var winston = require('winston');
var passportSetup = require('./config/passport-setup');
var app = express();
require('./app')(app);

var server = app.listen(app.get('port'), () => {
    console.log(`ExpressJS server listening to port ${app.get('port')}`);
});
