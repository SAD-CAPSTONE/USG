var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function render(req,res){
  res.render('home/views/index');
}
function faqRender(req,res){
  res.render('home/views/faq');
}

router.get('/', render);
router.get('/faq', faqRender);

exports.home = router;
