var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');

router.get('/',(req,res)=>{

  // all payments
  db.query(`Select  tblOrder.*, tblUser.* from tblOrder join tblUser on
    tblOrder.intUserID = tblUser.intUserID
    join tblOrderDetails on tblOrder.intOrderNo = tblOrderDetails.intOrderNo
    group by intOrderNo`,(err1,results1,fields1)=>{
    if(err1){
      console.log(err1);
    }else{
      db.query(`Select  tblOrder.*, tblUser.* from tblOrder join tblUser on
        tblOrder.intUserID = tblUser.intUserID
        join tblOrderDetails on tblOrder.intOrderNo = tblOrderDetails.intOrderNo
        where intPaymentMethod = 1
        group by intOrderNo`,(err2,results2,fields2)=>{
          if(err2){
            console.log(err2);
          }else{
            db.query(`Select  tblOrder.*, tblUser.* from tblOrder join tblUser on
              tblOrder.intUserID = tblUser.intUserID
              join tblOrderDetails on tblOrder.intOrderNo = tblOrderDetails.intOrderNo
              where intPaymentMethod = 2
              group by intOrderNo`,(err3,results3,fields3)=>{
                if(err3){
                  console.log(err3);
                }else{

                  db.query(`Select  tblOrder.*, tblUser.* from tblOrder join tblUser on
                    tblOrder.intUserID = tblUser.intUserID
                    join tblOrderDetails on tblOrder.intOrderNo = tblOrderDetails.intOrderNo
                    where intPaymentStatus = 0
                    group by intOrderNo`,(err4, results4, fields4)=>{
                      if(err4){
                        console.log(err4)
                      }else{
                        res.render('admin-custPayment/views/allPayments', {allPayments: results1, moment: moment, cashOnDelivery: results2, bankDeposits: results3, awaiting: results4});

                      }
                    });

                }
              });
          }


        });
    }
  });
});

router.get('/history',(req,res)=>{
  var orderno = req.query.orderno;

  db.query(`Select * from tblCustomerPayment where intOrderNo = ${orderno}`,(err1,results1,fields1)=>{
    if(err1){
      console.log(err1);
    }else{
      res.render('admin-custPayment/views/paymentHistory',{re: results1, moment: moment})
    }
  });
});

exports.customerPayment = router;
