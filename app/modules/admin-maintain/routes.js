var router = require('express').Router();

router.get('/voucher', (req,res)=>{
  res.render('admin-maintain/views/voucher');
});

router.get('/supplier', (req,res)=>{
  res.render('admin-maintain/views/supplier');
});

router.get('/productCategory', (req,res)=>{
  res.render('admin-maintain/views/category');
});

router.get('/businessType', (req,res)=>{
  res.render('admin-maintain/views/businessType');
});

router.get('/FAQ', (req,res)=>{
  res.render('admin-maintain/views/FAQ');
});

router.get('/promotion', (req,res)=>{
  res.render('admin-maintain/views/promotion');
});

router.get('/package', (req,res)=>{
  res.render('admin-maintain/views/package');
});

router.get('/returnOrderReason', (req,res)=>{
  res.render('admin-maintain/views/returnOrderReason');
});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.maintenance = router;
