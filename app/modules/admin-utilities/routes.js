var router = require('express').Router();
var db = require('../../lib/database')();

var adminUser = 1000;

router.get('/businessInfo', (req,res)=>{
  db.query(`Select * from tblAdmin where intUserID = "${adminUser}"`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    res.render('admin-utilities/views/businessInfo', {re: results1});

  });
});

router.get('/order',(req,res)=>{
  db.query(`Select * from tblAdmin where intUserID = "${adminUser}"`,(err1,res1,fie1)=>{
    res.render('admin-utilities/views/order', {re: res1});

  })
});

router.post('/updateOrderPolicies',(req,res)=>{
  db.query(`Update tblAdmin set shippingFee = ${req.body.shippingFee}, deliveryPeriod = ${req.body.deliveryPeriod}, paymentVoucherValidity = ${req.body.paymentVoucherValidity}, bankAccountNo = "${req.body.bankAccountNo}", bankServiceFee = ${req.body.bankServiceFee}, businessBank = "${req.body.businessBank}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    if(!err1) res.send('success');
  });
})

router.post('/updateBusinessInfo',(req,res)=>{
  db.query(`Update tblAdmin set strbusinessName = "${req.body.name}", strbusinessAddress = "${req.body.address}", strbusinessEmail = "${req.body.email}", strbusinessphone = "${req.body.phone}", strbusinessMobile = "${req.body.mobile}" where intUserID = "${adminUser}"`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    if (!err1) res.send("yes");
  });
});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.utilities = router;
