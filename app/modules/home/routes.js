var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function render(req,res){
  console.log('??????????? Session Values')
  console.log(req.user);
  res.render('home/views/index', {thisUser: req.user});
}
function faqRender(req,res){
  res.render('home/views/faq', {thisUser: req.user});
}

router.get('/', render);
router.get('/faq', faqRender);

exports.home = router;
