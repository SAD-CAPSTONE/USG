const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();

function render(req,res){
  res.render('item/views/index', {thisUser: req.user});
}

router.get('/', render);

exports.item = router;
