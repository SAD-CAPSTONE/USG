const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();

router.get('/', (req,res)=>{
  res.render('cust-invoice/views/index');
});

exports.invoice = router;
