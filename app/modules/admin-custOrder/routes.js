var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');


router.get('/', (req,res)=>{
  res.render('admin-custOrder/views/allOrders');
});

router.get('/allOrders', (req,res)=>{
  db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.* from tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
join tblCustomer on tblUser.intUserID = tblCustomer.intUSerID`, (err1,results1,fields1)=>{
  if (err1) console.log(err1);
  res.render('admin-custOrder/views/allOrders', {re: results1, moment: moment});

});
});

router.get('/recentOrders', (req,res)=>{
  res.render('admin-custOrder/views/recentOrders');
});

router.get('/cancelledOrders', (req,res)=>{
  res.render('admin-custOrder/views/cancelledOrders');
});

router.get('/invoice', (req,res)=>{
  res.render('admin-custOrder/views/invoice');
});

router.get('/assessOrder',(req,res)=>{
  var orderno = req.query.order;

  db.query(`Select * from tblOrder
join tblorderdetails on tblorder.intorderno = tblorderdetails.intorderno
join tblproductlist on tblorderdetails.intproductno = tblproductlist.intproductno where tblOrder.intOrderno = ${orderno}`,(err1,results1,fields1)=>{

  db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.*
from tblOrder join tblUser on tblOrder.intUSerID = tblUser.intUserID
join tblCustomer on tblUser.intUserID = tblCustomer.intUserID
where tblOrder.intOrderno = ${orderno}`,(err2,results2,fields2)=>{
  res.render('admin-custOrder/views/assessOrder', {orderlist: results1, customer: results2, moment: moment});

});

});
});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.customerOrder = router;
