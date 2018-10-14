var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
var async = require('async');
const userTypeAuth = require('../cust-0extras/userTypeAuth');
const auth_admin = userTypeAuth.admin;

router.get('/', auth_admin, (req,res)=>{
  // All consignors
  db.query(`Select * from tblUser join tblSupplier on tblUser.intUserID = tblSupplier.intUserID where tblUser.intUserTypeNo = 2 and tblSupplier.intSupplierType = 1
    and tblSupplier.intStatus = 1`,(err1,res1,fie1)=>{
      if(err1) console.log(err1);
      else{
        res.render('admin-consSales/views/summary', {consignors: res1});
      }
    })
})

router.get('/paymentRecieptForm', auth_admin, (req,res)=>{
  var lastRecord = 1000;
  db.query(`Select * from tblConsignorPayment order by intConsignorPaymentNo desc limit 1`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      if(res1==undefined||res1==null){} else if(res1.length==0){}
      else{ lastRecord = parseInt(res1[0].intConsignorPaymentNo) + 1;}

      db.query(`Select * from tblUser join tblSupplier on tblUser.intUserID = tblSupplier.intUserID where tblSupplier.intSupplierType = 1 and tblUser.intUserTypeNo = 2`,(err2,res2,fie2)=>{
        if(err2) console.log(err2);
        else{
          res.render('admin-consSales/views/issuePayment',{lastRecord: lastRecord, moment: moment, suppliers: res2})
        }
      })
    }
  })
});

router.post('/submitForm',auth_admin, (req,res)=>{
  var pr_no ="1000", count = 0, prlist_no = "1000";
  var loop = req.body.description;
  db.beginTransaction(function(err){
    if(err) console.log(err);
    else{
      db.query(`Select * from tblConsignorPayment order by intConsignorPaymentNo desc limit 1`,(err1,res1,fie1)=>{
        if(err1) console.log(err1);
        else{
          if(res1==null||res1==undefined){} else if(res1.length==0){}
          else { pr_no = parseInt(res1[0].intConsignorPaymentNo) + 1;}

          db.query(`Select * from tblConsignmentPaymentList order by intConsPaymentListNo desc limit 1`,(err3,res3,fie3)=>{
            if(err3) console.log(err3);
            else{
              if(res3==null||res3==undefined){} else if(res3.length ==0){}
              else { prlist_no = parseInt(res3[0].intConsPaymentListNo) + 1;}

              db.query(`Insert into tblConsignorPayment (intConsignorPaymentNo, intAdminID, intConsignorID, intStatus)
                values ("${pr_no}", "${req.user.intUserID}", "${req.body.supplier}", 0)`,(err2,res2,fie2)=>{
                if(err2) console.log(err2);
                else{

                  async.eachSeries(loop,function(data,callback){
                    db.query(`Insert into tblConsignmentPaymentList (intConsPaymentListNo, intConsignorPaymentNo, strDescription, amount)
                    values ("${prlist_no}", "${pr_no}", "${req.body.description[count]}", ${req.body.amount[count]})`,(err4,res4,fie4)=>{
                      if(err4) console.log(err4);
                      else{
                        count++;
                        prlist_no++;
                        callback();
                      }
                    })
                  },function(results,erra){
                    if(erra) console.log(erra);
                    else{
                      db.commit(function(errb){
                        if(errb) console.log(errb);
                        else{ res.send("yes")};
                      })
                    }
                  })
                }
              })
            }
          })


        }
      })
    }
  })
});

router.get('/viewSales',auth_admin, (req,res)=>{
  res.render('admin-consSales/views/viewSales');
});

router.get('/viewPayments',auth_admin, (req,res)=>{
  db.query(`Select sum(amount) as total, tblConsignorPayment.*, tblConsignmentPaymentList.* from tblConsignorPayment
    join tblConsignmentPaymentList on tblConsignorPayment.intConsignorPaymentNo = tblConsignmentPaymentList.intConsignorPaymentNo
    where intConsignorID = "${req.query.cons}"
    group by tblConsignorPayment.intConsignorPaymentNo`,(err1,res1,fie1)=>{
    if(err1) console.log(err1)
    else{

      res.render('admin-consSales/views/viewPayments',{payments: res1, moment: moment});
    }
  })
});

router.get('/paymentBreakdown',auth_admin, (req,res)=>{

  db.query(`Select * from tblConsignorPayment join tblConsignmentPaymentList on tblConsignorPayment.intConsignorPaymentNo = tblConsignmentPaymentList.intConsignorPaymentNo
    where tblConsignmentPaymentList.intConsignorPaymentNo = "${req.query.no}"`,(err1,res1,fie1)=>{
      if(err1) console.log(err1);
      else{
        db.query(`Select sum(amount) as total from tblConsignmentPaymentList where intConsignorPaymentNo = "${req.query.no}" group by intConsignorPaymentNo`,(err2,res2,fie2)=>{
          if(err2) console.log(err2);
          else{
            res.render('admin-consSales/views/paymentBreakdown', {re: res1, total: res2[0].total});
          }
        })

      }
    })
})

exports.consSales = router;
