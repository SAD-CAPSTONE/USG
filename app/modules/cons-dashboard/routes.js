var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');

router.get('/dashboard', (req,res)=>{
  res.render('cons-dashboard/views/cons-dashboard');
});

//router.get('/consignor-products', (req,res)=>{
  //res.render('cons-dashboard/views/cons-products');
//});

router.get('/products', (req,res)=>{
  db.query(`
    SELECT * from tblproductinventory join tblproductlist on tblproductinventory.intProductNo = tblproductlist.intproductno
    join tbluser on tbluser.intUserID = tblproductinventory.intUserID
    join tblsubcategory on tblsubcategory.intSubCategoryNo = tblproductlist.intSubCategoryNo
    join tblcategory on tblcategory.intcategoryno = tblsubcategory.intcategoryno
    join tblsupplier on tblsupplier.intUserID = tblproductinventory.intUserID
    where intUserTypeNo = 2 AND intSupplierType = 2 AND tbluser.intUserID = 1001`,(err1,results1)=>{
    if (err1) console.log(err1);
    res.render('cons-dashboard/views/cons-products', {re: results1});
  });
});

router.get('/orders', (req,res)=>{
  res.render('cons-dashboard/views/cons-orders');
});

exports.consignor = router;

