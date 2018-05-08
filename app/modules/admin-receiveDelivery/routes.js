var router = require('express').Router();
var db = require('../../lib/database')();

router.get('/', (req,res)=>{
  res.render('admin-receiveDelivery/views/receiveDelivery');
});

router.get('/form', (req,res)=>{

  db.query(`Select * from tblreceiveorder`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    console.log(results1[0]);

    res.render('admin-receiveDelivery/views/receiveDeliveryForm', {re:results1});
  });

});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.receiveDelivery = router;
