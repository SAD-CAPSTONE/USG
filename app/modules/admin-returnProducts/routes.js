var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
var async = require('async');

router.get('/',(req,res)=>{
  db.query(`Select tblPurchaseOrder.intStatus as stat, tblreceiveorder.intReceiveorderNo as rno, tblreturnbadorders.*, tblreceiveorder.*, tblSupplier.* from tblreturnbadorders join tblreceiveorder on tblreturnbadorders.intReceiveorderNo = tblreceiveorder.intReceiveorderNo join tblPurchaseOrder on tblreceiveorder.intPurchaseOrderNo = tblPurchaseOrder.intPurchaseOrderNo join tblSupplier on tblPurchaseOrder.intSupplierID = tblSupplier.intUserID`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      res.render('admin-returnProducts/views/allReturns', {bad: res1, moment: moment});

    }
  })
});

exports.returnProducts = router;
