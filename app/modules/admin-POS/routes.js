var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const generatePassword = require('password-generator');
var mailAccountUse = "imjanellealag@gmail.com"



router.get('/try',(req,res)=>{
  console.log('ne')
});

router.get('/',(req,res)=>{
  res.render('admin-POS/views/quickOrder');
});

exports.sales = router;
