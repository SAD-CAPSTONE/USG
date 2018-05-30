const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();

function dashRender(req,res){
  res.render('account/views/dashboard', {thisUser: req.user});
}
function ordersRender(req,res){
  res.render('account/views/orders', {thisUser: req.user});
}
function paymentRender(req,res){
  res.render('account/views/payment', {thisUser: req.user});
}
function cancelRender(req,res){
  res.render('account/views/cancellations', {thisUser: req.user});
}

router.get('/dashboard', dashRender);
router.get('/orders', ordersRender);
router.get('/payment', paymentRender);
router.get('/cancellations', cancelRender);

exports.account = router;
