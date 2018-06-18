const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();

router.get('/dashboard', (req,res)=>{
  res.render('cust-account/views/dashboard', {thisUser: req.user});
});
router.get('/orders', (req,res)=>{
  res.render('cust-account/views/orders', {thisUser: req.user});
});
router.get('/payment', (req,res)=>{
  res.render('cust-account/views/payment', {thisUser: req.user});
});
router.get('/cancellations', (req,res)=>{
  res.render('cust-account/views/cancellations', {thisUser: req.user});
});

exports.account = router;
