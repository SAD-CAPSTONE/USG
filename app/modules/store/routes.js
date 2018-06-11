const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();

function render(req,res){
  res.render('store/views/index', {thisUser: req.user});
}

router.get('/', render);

exports.store = router;
