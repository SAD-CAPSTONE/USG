var router = require('express').Router();

router.get('/', (req,res)=>{
  res.render('admin-reports/views/reports');
});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.reports = router;
