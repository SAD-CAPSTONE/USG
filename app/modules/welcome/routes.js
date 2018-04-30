var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function render(req,res){
  res.render('welcome/views/index');
}

router.get('/', render);

exports.welcome = router;
