var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');

router.get('/paymentForm',(req,res)=>{
  res.render('admin-consPayment/views/paymentForm');
})

exports.consPayment = router;
