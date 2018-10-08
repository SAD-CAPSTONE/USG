var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
const userTypeAuth = require('../cust-0extras/userTypeAuth');
const auth_cons = userTypeAuth.cons;

router.get('/consignor-dash', auth_cons, (req,res)=>{
  db.query(`
    SELECT * from tblproductinventory
    join tblproductlist on tblproductinventory.intProductNo = tblproductlist.intproductno
    join tblUom on tblUom.intUomNo = tblproductinventory.intUomNo
    join tbluser on tbluser.intUserID = tblproductinventory.intUserID
    join tblsupplier on tblsupplier.intUserID = tblUser.intUserID
    where tbluser.intUserID = ${req.user.intUserID} and tblproductinventory.intStatus = 1`,(err1,results1)=>{
    if (err1) console.log(err1);
    res.render('cons-dashboard/views/cons-dashboard', {re: results1, moment: moment});

  });
});

//router.get('/consignor-products', (req,res)=>{
  //res.render('cons-dashboard/views/cons-products');
//});

router.get('/products', auth_cons, (req,res)=>{
  db.query(`
    SELECT * from tblproductinventory join tblproductlist on tblproductinventory.intProductNo = tblproductlist.intproductno
    join tbluser on tbluser.intUserID = tblproductinventory.intUserID
    join tblsubcategory on tblsubcategory.intSubCategoryNo = tblproductlist.intSubCategoryNo
    join tblcategory on tblcategory.intcategoryno = tblsubcategory.intcategoryno
    join tblsupplier on tblsupplier.intUserID = tblproductinventory.intUserID
    where tbluser.intUserID = ${req.user.intUserID}`,(err1,results1)=>{
    if (err1) console.log(err1);
    res.render('cons-dashboard/views/cons-products', {re: results1});
  });
});

router.get('/orders', auth_cons, (req,res)=>{
  db.query(`
  SELECT * from tblpurchaseorderlist join tblreceiveorder on tblpurchaseorderlist.intpurchaseorderno = tblreceiveorder.intpurchaseorderno
  join tblpurchaseorder on tblpurchaseorderlist.intPurchaseOrderNo = tblpurchaseorder.intPurchaseOrderNo
  join tblreceiveorderlist on tblreceiveorderlist.intReceiveOrderNo = tblreceiveorder.intReceiveOrderNo
  join tblsupplier on tblsupplier.intuserid = tblpurchaseorder.intsupplierid
  join tbluser on tbluser.intuserid = tblsupplier.intuserid
  where tbluser.intUserID = ${req.user.intUserID}`,(err1,results1)=>{
  if (err1) console.log(err1);
  res.render('cons-dashboard/views/cons-orders', {re: results1});
  console.log(results1);
});
});

router.get('/returns', auth_cons, (req,res)=>{
  db.query(`
    SELECT * from tblpurchaseorder join tblreceiveorder on tblpurchaseorder.intpurchaseorderno = tblreceiveorder.intpurchaseorderno
    join tblreturnbadorders on tblreceiveorder.intreceiveorderno = tblreturnbadorders.intreceiveorderno
    join tblreceiveorderlist on tblreceiveorderlist.intReceiveOrderNo = tblreturnbadorders.intReceiveOrderNo
    join tblbadorderslist on tblbadorderslist.intbadordersno = tblreturnbadorders.intbadordersno
    join tblsupplier on tblsupplier.intuserid = tblpurchaseorder.intsupplierid
    join tbluser on tbluser.intuserid = tblsupplier.intuserid
    where tbluser.intUserID = ${req.user.intUserID}`,(err1,results1)=>{
    if (err1) console.log(err1);
    res.render('cons-dashboard/views/cons-returns', {re: results1});
    console.log(results1);
  });
});

exports.consignor = router;
