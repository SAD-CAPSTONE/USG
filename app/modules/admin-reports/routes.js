var router = require('express').Router();

router.get('/', (req,res)=>{
  res.render('admin-reports/views/reports');
});

router.get('/sales',(req,res)=>{
  res.render('admin-reports/views/sales');
})

router.get('/inventory',(req,res)=>{
  res.render('admin-reports/views/inventory');
});

router.get('/damage',(req,res)=>{
  res.render('admin-reports/views/damage');
});

router.get('/customer',(req,res)=>{
  res.render('admin-reports/views/customer');
});


// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.reports = router;
