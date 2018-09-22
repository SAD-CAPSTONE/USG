const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('./priceFormat');
const userTypeAuth = require('./userTypeAuth');
const cust = userTypeAuth.cust;

router.get('/', (req, res) => {
  res.render('cust-0extras/views/sample',{thisUser: req.user});
});

router.get('/unAuth', (req, res) => {
  res.render('cust-0extras/views/messagePage',{message: 'You are unauthorized to view the page', messBtn: 'Home', messLink: '/home'});
});

exports.extras = router;
