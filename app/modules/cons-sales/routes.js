const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();

router.get('/sales', (req,res)=>{
  res.render('cons-sales/views/index',{
    thisUser: req.user
  });
});

exports.consignor = router;
