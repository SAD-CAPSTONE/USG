var router = require('express').Router();

router.get('/', (req,res)=>{
  res.render('admin-reports/views/reports');
});

router.get('/sales',(req,res)=>{
  res.render('admin-reports/views/sales');
})

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.reports = router;
