var router = require('express').Router();

router.get('/', (req,res)=>{
  res.render('admin-consApplication/views/applicationList');
});

router.get('/details', (req,res)=>{
  res.render('admin-consApplication/views/applicationDetails');
});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.consApplication = router;
