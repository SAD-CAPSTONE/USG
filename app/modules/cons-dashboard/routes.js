var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');

router.get('/consignor-dash', (req,res)=>{
  res.render('cons-dashboard/views/cons-dashboard');
});

exports.consignor = router;
