var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');

router.get('/',(req,res)=>{

  // all payments
  db.query(`Select tblOrder.intStatus as order_stat,  tblOrder.*, tblUser.* from tblOrder join tblUser on
    tblOrder.intUserID = tblUser.intUserID
    join tblOrderDetails on tblOrder.intOrderNo = tblOrderDetails.intOrderNo
    group by intOrderNo`,(err1,results1,fields1)=>{
    if(err1){
      console.log(err1);
    }else{
      db.query(`Select tblOrder.intStatus as order_stat, tblOrder.*, tblUser.* from tblOrder join tblUser on
        tblOrder.intUserID = tblUser.intUserID
        join tblOrderDetails on tblOrder.intOrderNo = tblOrderDetails.intOrderNo
        where intPaymentMethod = 1
        group by intOrderNo`,(err2,results2,fields2)=>{
          if(err2){
            console.log(err2);
          }else{
            db.query(`Select tblOrder.intStatus as order_stat, tblOrder.*, tblUser.* from tblOrder join tblUser on
              tblOrder.intUserID = tblUser.intUserID
              join tblOrderDetails on tblOrder.intOrderNo = tblOrderDetails.intOrderNo
              where intPaymentMethod = 2
              group by intOrderNo`,(err3,results3,fields3)=>{
                if(err3){
                  console.log(err3);
                }else{

                  db.query(`Select tblOrder.intStatus as order_stat, tblOrder.*, tblUser.* from tblOrder join tblUser on
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

router.post('/cancelOrder',(req,res)=>{
  var orderHistoryNo = "1000", message_no = "1000";


  db.beginTransaction(function(err){
    if(err) console.log(err);
    else{
      db.query(`Select * from tblOrderHistory order by intOrderHistoryNo desc limit 1`,(err1,res1,fie1)=>{
        if(err1) console.log(err1);
        else{
          if(res1[0].length == 0){} else{orderHistoryNo = parseInt(res1[0].intOrderHistoryNo) + 1}
          db.query(`Select * from tblMessages order by intMessageNo desc limit 1`,(err2,res2,fie2)=>{
            if(err2) console.log(err2);
            else{
              if(res2[0].length == 0){} else{message_no = parseInt(res2[0].intMessageNo) + 1}
              db.query(`Select * from tblOrder where intOrderNo = "${req.body.order_no}"`,(err3,order,fie3)=>{
                //console.log(order)
                if(err3) console.log(err3);
                else{
                  db.query(`Update tblOrder set intStatus = 6 where intOrderNo = "${req.body.order_no}"`,(err4,res4,fie4)=>{
                    if(err4) console.log(err4);
                    else{
                      db.query(`Insert into tblMessages (intMessageNo, intCustomerID, strMessage, intAdminID) values
                      ("${message_no}", "${order[0].intUserID}", "${req.body.message}", "1000")`,(err5,res5,fie5)=>{
                        if(err5) console.log(err5);
                        else{
                          db.query(`Insert into tblOrderHistory (intOrderHistoryNo, strShippingMethod, strCourier, intStatus, intPaymentStatus, intAdminID,  strShippingAddress, strBillingAddress)
                          values ("${orderHistoryNo}", "${order[0].strShippingMethod}", "${order[0].strCourier}", 6, ${order[0].intPaymentStatus}, "1000",  "${order[0].strShippingAddress}", "${order[0].strBillingAddress}")`,(err6,res6,fie6)=>{

                            db.query(`Select * from tblOrderDetails where intOrderNo = "${req.body.order_no}"`,(err7,details,fie7)=>{
                              if(err7) console.log(err7);
                              else{
                                details.forEach(function(i){
                                  // Ordinary Product
                                  if(i.intProductType == 1){
                                    db.query(`Update tblProductInventory set tblProductInventory.intReservedItems = tblProductInventory.intReservedItems - ${i.intQuantity} where intInventoryNo = "${i.intInventoryNo}"`,(err8,res8,fie8)=>{
                                      if(err8) console.log(err8);
                                      else{
                                        db.commit(function(erra){
                                          if(erra) console.log(erra);
                                          else{
                                            res.send("yes");
                                          }
                                        })
                                      }
                                    })
                                  }

                                  // Package Product
                                  else{
                                    db.query(`Update tblPackage set tblPackage.intReservedItems = tblPackage.intReservedItems - ${i.intQuantity} where intPackageNo = "${i.intInventoryNo}"`,(err9,res9,fie9)=>{
                                      if(err9) console.log(err9);
                                      else{
                                        db.commit(function(errb){
                                          if(erra) console.log(errb);
                                          else{
                                            res.send("yes");
                                          }
                                        })
                                      }
                                    })
                                  }

                                })
                              }
                            })
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
    }
  })
});

router.post('/changeStatus',(req,res)=>{
  var history_no = "1000", sales_no = "1000";
  db.beginTransaction(function(err){
    if(err) console.log(err);
    else{
      db.query(`Select * from tblOrderHistory order by intOrderHistoryNo desc limit 1`,(err1,res1,fie1)=>{
        if(err1) console.log(err1);
        else{
          if(res1.length==0){} else{ history_no = parseInt(res1[0].intOrderHistoryNo)+1;}

          db.query(`Select * from tblSales order by intSalesNo desc limit 1`,(err2,res2,fie2)=>{
            if(err2) console.log(err2);
            else{
              if(res2.length==0){} else{ sales_no = parseInt(res2[0].intSalesNo) + 1;}

              if(req.body.payment_status == 1){
                db.query(`Update tblOrder set intPaymentStatus = 1, paymentDate = NOW() where intOrderNo = "${req.body.order_no}"`,(err3,res3,fie3)=>{
                  if(err3) console.log(err3);
                  else{

                    // test amount only
                    db.query(`Insert into tblSales (intSalesNo, intOrderNo, amount, intStatus)
                      values("${sales_no}", "${req.body.order_no}", 100, 1)`,(err4,res4,fie4)=>{
                        if(err4) console.log(err4);
                        else{
                          res.send("yes");
                        }
                      })
                  }
                })
              }

            }
          })
        }
      })
    }
  })
})

exports.customerPayment = router;
