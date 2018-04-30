var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function render(req,res){
  res.render('invoice/views/index');
}

router.get('/', render);

exports.invoice = router;
