const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('./priceFormat');

router.get('/', (req, res) => {
  res.render('cust-0extras/views/sample');
});

exports.extras = router;
