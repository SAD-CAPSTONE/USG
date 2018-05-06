var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function render(req,res){
  res.render('item/views/index', {thisUser: req.user});
}

router.get('/', render);

exports.item = router;
