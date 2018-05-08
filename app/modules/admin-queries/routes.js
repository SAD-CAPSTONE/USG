var router = require('express').Router();

router.get('/', (req,res)=>{
  res.render('admin-queries/views/queries');
});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.queries = router;
