const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();

router.get('/checkout', (req,res)=>{
  res.render('cust-summary/views/checkout', {thisUser: req.user});
});
router.get('/order', (req,res)=>{
  res.render('cust-summary/views/order', {thisUser: req.user});
});
router.get('/previous', (req,res)=>{
  res.render('cust-summary/views/previous', {thisUser: req.user});
});

exports.summary = router;
