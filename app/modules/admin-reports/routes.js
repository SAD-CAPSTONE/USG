var router = require('express').Router();

router.get('/', (req,res)=>{
  res.render('admin-reports/views/reports');
});

router.get('/sales',(req,res)=>{
  res.render('admin-reports/views/sales');
})

router.get('/inventory',(req,res)=>{
  res.render('admin-reports/views/inventory');
})

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.reports = router;
