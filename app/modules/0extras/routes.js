var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function render(req,res){
  res.render('0extras/views/sample');
}

router.get('/', render);

exports.extras = router;
