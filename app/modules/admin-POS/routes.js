var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');

router.get('/',(req,res)=>{
  res.render('admin-POS/views/quickOrder');
});

exports.sales = router;
