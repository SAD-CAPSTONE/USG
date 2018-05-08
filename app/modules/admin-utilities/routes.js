var router = require('express').Router();

router.get('/businessInfo', (req,res)=>{
  res.render('admin-utilities/views/businessInfo');
});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.utilities = router;
