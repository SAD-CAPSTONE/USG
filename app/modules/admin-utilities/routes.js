var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
const userTypeAuth = require('../cust-0extras/userTypeAuth');
const auth_admin = userTypeAuth.admin;

var adminUser = 1000;

router.get('/businessInfo', auth_admin, (req,res)=>{
  db.query(`Select * from tblAdmin where intUserID = "${adminUser}"`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    res.render('admin-utilities/views/businessInfo', {re: results1});

  });
});

router.get('/order', auth_admin,(req,res)=>{
  db.query(`Select * from tblAdmin where intUserID = "${adminUser}"`,(err1,res1,fie1)=>{
    res.render('admin-utilities/views/order', {re: res1});

  })
});

router.post('/updateOrderPolicies', auth_admin,(req,res)=>{
  db.query(`Update tblAdmin set shippingFee = ${req.body.shippingFee}, deliveryPeriod = ${req.body.deliveryPeriod},
     paymentVoucherValidity = ${req.body.paymentVoucherValidity}, bankAccountNo = "${req.body.bankAccountNo}",
   bankServiceFee = ${req.body.bankServiceFee}, businessBank = "${req.body.businessBank}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    if(!err1) res.send('success');
  });
})

router.post('/updateBusinessInfo', auth_admin,(req,res)=>{
  db.query(`Update tblAdmin set strbusinessName = "${req.body.name}", strbusinessAddress = "${req.body.address}", strbusinessEmail = "${req.body.email}", strbusinessphone = "${req.body.phone}", strbusinessMobile = "${req.body.mobile}" where intUserID = "${adminUser}"`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    if (!err1) res.send("yes");
  });
});

router.get('/shippingFeeList',auth_admin, (req,res)=>{
  db.query(`Select * from tblShippingFee `, (err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      res.render('admin-utilities/views/shippingFee', {re: res1});
    }
  })
});

router.post('/editShipping',auth_admin, (req,res)=>{
  db.query(`Update tblShippingFee set strLocation = "${req.body.location}", amount = ${req.body.fee} where intShippingFeeNo = "${req.body.fee_no}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      res.send("yes");
    }
  })
});

router.post('/addShipping',auth_admin, (req,res)=>{
  var no = "1000";
  db.query(`Select * from tblShippingFee order by intShippingFeeNo desc limit 1`,(err1,res1,fie1)=>{
    if(err1 )console.log(err1);
    else{
      if(res1.length==0){} else{ no = parseInt(res1[0].intShippingFeeNo) + 1}

      db.query(`Insert into tblShippingFee (intShippingFeeNo, strLocation, amount)
        values ("${no}", "${req.body.location}", ${req.body.fee})`,(err2,res2,fie2)=>{
          if(err2) console.log(err2);
          else{
            res.send("yes");
          }
        })
    }
  })
})

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.utilities = router;
