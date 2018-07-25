const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');

router.get('/', (req,res)=>{
  res.render('cust-store/views/index', {
    thisUser: req.user
  });
});

exports.store = router;
