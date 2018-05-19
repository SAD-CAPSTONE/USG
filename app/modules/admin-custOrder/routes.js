var router = require('express').Router();

router.get('/', (req,res)=>{
  res.render('admin-custOrder/views/allOrders');
});

router.get('/allOrders', (req,res)=>{
  res.render('admin-custOrder/views/allOrders');
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

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.customerOrder = router;
