const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();

function render(req,res){
  res.render('invoice/views/index');
}

router.get('/', render);

exports.invoice = router;
