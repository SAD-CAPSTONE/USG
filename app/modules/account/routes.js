var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function dashRender(req,res){
  res.render('account/views/dashboard',{thisusertab: req.user});
}
function ordersRender(req,res){
  res.render('account/views/orders',{thisusertab: req.user});
}
function paymentRender(req,res){
  res.render('account/views/payment',{thisusertab: req.user});
}
function cancelRender(req,res){
  res.render('account/views/cancellations',{thisusertab: req.user});
}

router.get('/dashboard', dashRender);
router.get('/orders', ordersRender);
router.get('/payment', paymentRender);
router.get('/cancellations', cancelRender);

exports.account = router;
