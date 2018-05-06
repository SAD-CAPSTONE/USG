var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function render(req,res){
  res.render('summary/views/checkout', {thisUser: req.user});
}
function orderRender(req,res){
  res.render('summary/views/order', {thisUser: req.user});
}
function prevRender(req,res){
  res.render('summary/views/previous', {thisUser: req.user});
}

router.get('/checkout', render);
router.get('/order', orderRender);
router.get('/previous', prevRender);

exports.summary = router;
