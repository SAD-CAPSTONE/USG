var router = require('express').Router();

router.get('/', (req,res)=>{
  res.render('admin-returnOrder/views/returnOrder');
});

router.get('/form', (req,res)=>{
  res.render('admin-returnOrder/views/returnOrderForm');
});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.returnOrder = router;
