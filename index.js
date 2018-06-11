require('dotenv').config();
const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const winston = require('winston');
const passportSetup = require('./config/passport-setup');

let app = express();
require('./app')(app);

let httpsOptions = {
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
}

let server = https.createServer(httpsOptions, app)
  .listen(app.get('port'), () => {
      console.log(`ExpressJS server listening to port ${app.get('port')}`);
  });

// let server = app.listen(app.get('port'), () => {
//     console.log(`ExpressJS server listening to port ${app.get('port')}`);
// });
