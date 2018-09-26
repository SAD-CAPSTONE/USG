const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();

router.get('/', (req,res)=>{
  res.render('cons-sales/views/index',{
    thisUser: req.user
  });
});

exports.consignorSales = router;
