var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function render(req,res){
  res.render('summary/views/checkout');
}
function orderRender(req,res){
  res.render('summary/views/order');
}
function prevRender(req,res){
  res.render('summary/views/previous');
}

router.get('/checkout', render);
router.get('/order', orderRender);
router.get('/previous', prevRender);

exports.summary = router;
