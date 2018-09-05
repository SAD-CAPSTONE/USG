const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('./priceFormat');
const userTypeAuth = require('./userTypeAuth');
const cust = userTypeAuth.cust;

router.get('/', (req, res) => {
  res.render('cust-0extras/views/sample',{message: 'Sample Page'});
});

router.get('/unAuth', (req, res) => {
  res.render('cust-0extras/views/sample',{message: 'You are unauthorized to view the page'});
});

exports.extras = router;
