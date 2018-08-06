var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
var async = require('async');


router.get('/', (req,res)=>{
  res.render('admin-custOrder/views/allOrders');
});

router.post('/checkNewOrders',(req,res)=>{
    db.query(`Select CURDATE() - INTERVAL 2 DAY as DatesFrom, tblOrder.intStatus as Stat,
    tblOrder.*, tblUser.*, tblCustomer.* from tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
    join tblCustomer on tblUser.intUserID = tblCustomer.intUSerID where dateOrdered >= CURDATE() - INTERVAL 2 DAY and tblOrder.intStatus = 0`, (err1,results1,fields1)=>{
        if (err1) console.log(err1);

        if (results1 == null || results1 == undefined){
          res.send("no");
        }else if(results1.length > 0){
          res.send("new");
        }else{
          res.send("no");
        }
  });
});

router.get('/checkNewOrders',(req,res)=>{
  db.query(`Select CURDATE() - INTERVAL 2 DAY as DatesFrom, tblOrder.intStatus as Stat,
    tblOrder.*, tblUser.*, tblCustomer.* from tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
    join tblCustomer on tblUser.intUserID = tblCustomer.intUSerID where dateOrdered >= CURDATE() - INTERVAL 2 DAY and tblOrder.intStatus = 0`,(err1,results1,fields1)=>{
      if (err1) console.log(err1);

      res.render('admin-custOrder/views/newOrders', {re: results1, moment: moment})
    });
});

router.get('/allOrders', (req,res)=>{
  db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.* from
    tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
    join tblCustomer on tblUser.intUserID = tblCustomer.intUSerID`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    res.render('admin-custOrder/views/allOrders', {re: results1, moment: moment});

  });
});


router.get('/assessOrder',(req,res)=>{
  var orderno = req.query.order;

  // Order list
  db.query(`Select tblorderdetails.intQuantity as quantity, tblOrder.*, tblUOM.*, tblorderdetails.*,
    tblproductinventory.*, tblproductlist.* from tblOrder
    join tblorderdetails on tblorder.intorderno = tblorderdetails.intorderno
    join tblproductinventory on tblproductinventory.intinventoryno = tblorderdetails.intinventoryno
    join tblUOM on tblProductinventory.intUOMno = tblUom.intUOMno
    join tblproductlist on tblproductlist.intproductno = tblproductinventory.intproductno
    where tblOrder.intOrderno = "${orderno}"`,(err1,results1,fields1)=>{
      if (err1) console.log(err1);


    // customer details
    db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.*
      from tblOrder join tblUser on tblOrder.intUSerID = tblUser.intUserID
      join tblCustomer on tblUser.intUserID = tblCustomer.intUserID
      where tblOrder.intOrderno = "${orderno}"`,(err2,results2,fields2)=>{
        if (err2) console.log(err2);

      // total
      db.query(`Select SUM(tblorderdetails.intquantity * tblorderdetails.purchaseprice) as
        totalAll from tblOrder
        join tblorderdetails on tblorder.intorderno = tblorderdetails.intorderno
        join tblproductinventory on tblorderdetails.intinventoryno = tblproductinventory.intinventoryno
        where tblOrder.intOrderno = "${orderno}"`, (err3,results3,fields3)=>{
          if (err3) console.log(err3);


          // total payment
          db.query(`Select sum(amountPaid) as total from tblCustomerpayment
            where intStatus = 1 and intOrderno = ${orderno}
            group by intOrderno`,(err4,results4,fields4)=>{
              if(err4) console.log(err4);

              var this_total = 0;
              if (results4[0] == null || results4[0] == undefined){} else if(results4[0].total == ""){}
              else{ this_total = results4[0].total }

              res.render('admin-custOrder/views/assessOrder', {orderno: orderno, orderlist: results1, customer: results2, moment: moment, total: results3[0].totalAll, payment: this_total});

            });


      });


    });

  });
});

function pending(req,res){
  if (req.body.paymentStatus == 0){
    db.commit(function(erri){
      if(erri){db.rollback(function(){console.log(erri); res.send("no")})}
      else{
        res.send("yes")

      }
    });
  }else if(req.body.paymentStatus == 1){
    paid(req,res);
  }
} // end of pending

function processing(req,res){
  if (req.body.paymentStatus == 0){
    db.commit(function(erri){
      if(erri){db.rollback(function(){console.log(erri); res.send("no")})}
      else{
        res.send("yes")

      }
    });
  }else if(req.body.paymentStatus == 1){
    paid(req,res);
  }
} // end of processing


function shipped(req,res){
var c = 0;
  // update product inventory
  db.query(`Select * from tblorderdetails where intOrderNo = "${req.body.orderNo}"`,(errz,orders,fieldsz)=>{
    if(errz){db.rollback(function(){console.log(errz)})}
    else{
      async.eachSeries(orders,function(data,callback){
        // check if stock is in Quantity
        db.query(`Select * from tblProductinventory where intInventoryNo = "${orders[c].intInventoryNo}" and intQuantity  >= ${orders[c].intQuantity}`,(errw,resw,fieldsw)=>{
          if(errw){db.rollback(function(){console.log(errw); res.send("no")})}
          else{
            if(resw==undefined||resw==null){db.rollback(function(){ res.send("false")})}
            else if(resw.length==0){db.rollback(function(){ res.send("false")})}
            else{
              db.query(`Update tblproductinventory set intQuantity = intQuantity - ${orders[c].intQuantity}
                where (tblproductinventory.intInventoryNo = "${orders[c].intInventoryNo}") and (intQuantity  >= ${orders[c].intQuantity})`,(errx,resultsx,fieldsx)=>{
                  if(errx){db.rollback(function(){console.log(errx); res.send("no");})}

                  else{
                    var remaining = orders[c].intQuantity; // 22
                    var remaining2 = orders[c].intQuantity;


                      db.query(`Select * from tblBatch where intInventoryNo = "${orders[c].intInventoryNo}" order by created_at`,(e3,batch,f3)=>{
                        if(e3) console.log(e3);

                        for(var a in batch){
                          if(remaining == 0){
                            break;


                          }
                          else if(batch[a].intQuantity < remaining || batch[a].intQuantity == remaining){
                            let newValue = 0;
                            remaining -= batch[a].intQuantity;
                            console.log('newValue: '+newValue);
                            console.log('remaining: '+remaining);
                            db.query(`Update tblBatch set intQuantity = ${newValue} where intBatchNo = "${batch[a].intBatchNo}"`,(e4,r4,f4)=>{
                              if(e4)console.log(e4);
                            });

                          }
                          else{
                            let newValue = batch[a].intQuantity - remaining;
                            remaining = 0;
                            console.log('newValue: '+newValue);
                            console.log('remaining: '+remaining);
                            db.query(`Update tblBatch set intQuantity = ${newValue} where intBatchNo = "${batch[a].intBatchNo}"`,(e5,r5,f5)=>{
                              if(e5)console.log(e5);
                            });
                          }
                        }

                          for(var b in batch){
                            if(remaining2 == 0){
                            //  console.log('finished');
                              //c++; callback();
                              break;
                            }
                            else if(batch[b].intReservedItems < remaining2 || batch[b].intReservedItems == remaining2){
                              let newValue = 0;
                              remaining2 -= batch[b].intReservedItems;
                              console.log('newValue2: '+newValue);
                              console.log('remaining2: '+remaining2);
                              db.query(`Update tblBatch set intReservedItems = ${newValue} where intBatchNo = "${batch[b].intBatchNo}"`,(e6,r6,f6)=>{
                                if(e6)console.log(e6);
                              });

                            }
                            else{
                              let newValue = batch[b].intReservedItems - remaining2;
                              remaining2 = 0;
                              console.log('newValue2: '+newValue);
                              console.log('remaining2: '+remaining2);
                              db.query(`Update tblBatch set intReservedItems = ${newValue} where intBatchNo = "${batch[b].intBatchNo}"`,(e7,r7,f7)=>{
                                if(e7)console.log(e7);
                              });
                            }
                          }

                          c++;
                          callback();


                      })

                  }
                });
            }
          }
        });


      },function(erry,resultsy){
        if(erry){db.rollback(function(){console.log(erry)})}
        else{
          if (req.body.paymentStatus == 0){
            db.commit(function(erri){
              if(erri){db.rollback(function(){console.log(erri); res.send("no")})}
              else{
                res.send("yes");

              }
            });
          }else if(req.body.paymentStatus == 1){
            paid(req,res);
          }

        }

      })
    }
  });

} // end of Shipped

function delivered(req,res){
  if (req.body.paymentStatus == 0){
    db.commit(function(erri){
      if(erri){db.rollback(function(){console.log(erri); res.send("no")})}
      else{
        res.send("yes")

      }
    });
  }else if(req.body.paymentStatus == 1){
    paid(req,res);
  }
} // end of delivered

function notDeliver(req,res){
  if (req.body.paymentStatus == 0){
    db.commit(function(erri){
      if(erri){db.rollback(function(){console.log(erri); res.send("no")})}
      else{
        res.send("yes")

      }
    });
  }else if(req.body.paymentStatus == 1){
    paid(req,res);
  }
} // end of not delivered

function returned(req,res){
  if (req.body.paymentStatus == 0){
    db.commit(function(erri){
      if(erri){db.rollback(function(){console.log(erri); res.send("no")})}
      else{
        res.send("yes")

      }
    });
  }else if(req.body.paymentStatus == 1){
    paid(req,res);
  }
} // end of returned

function cancelled(req,res){
  if (req.body.paymentStatus == 0){
    db.commit(function(erri){
      if(erri){db.rollback(function(){console.log(erri); res.send("no")})}
      else{
        res.send("yes")

      }
    });
  }else if(req.body.paymentStatus == 1){
    paid(req,res);
  }
} // end of cancelled

function paid(req,res){
    var salesno = "1000";
  db.query(`Select * from tblSales order by intSalesNo desc limit 1`,(e1,r1,f1)=>{
    if(e1){db.rollback(function(){console.log(e1); res.send("no")})}
    if(!e1){
      if(r1==null||r1==undefined){} else if(r1.length==0){}
      else{ salesno = parseInt(r1[0].intSalesNo) + 1}

      db.query(`Insert into tblSales (intSalesNo, intOrderNo, amount, intStatus) values("${salesno}", "${req.body.orderNo}",${req.body.total},1)`,(e2,r2,f2)=>{
        if(e2){db.rollback(function(){console.log(e2); res.send("no");})}
        else{
          db.commit(function(e3){
            if(e3) {db.rollback(function(){console.log(e3); res.send("no");})}
            else{
              res.send("yes");
            }
          })
        }
      });
    }
  });
} // end of paid

function awaitingPayment(req,res){
  db.commit(function(e1){
    if(e1){db.rollback(function(){console.log(e1); res.send("no");})}
    else{
      res.send("yes");
    }
  })
} // end of awaitingPayment



router.post('/assessOrder',(req,res)=>{

  db.beginTransaction(function(err){
    if(err){ console.log(err);}
    else{
      // Update order status
      db.query(`Update tblOrder set intStatus = ${req.body.orderStatus}, strShippingMethod =
        "${req.body.shippingMethod}", strCourier = "${req.body.courier}", intPaymentStatus = ${req.body.paymentStatus} where intOrderNo = "${req.body.orderNo}" `, (err1,results1,fields1)=>{
          if(err1){db.rollback(function(){console.log(err1); res.send("no")})}
          else{
            var historynum = 1000, messagenum = 0;
            // Select last orderhistory no
            db.query(`Select * from tblOrderHistory order by intOrderHistoryNo desc limit 1`,
              (err2,results2,fields2)=>{
                if(err2){db.rollback(function(){console.log(err2); res.send("no")})}
                else{
                  if (results2 == null || results2 == undefined){}else if(results2.length == 0){}
                  else{
                    historynum = parseInt(results2[0].intOrderHistoryNo) + 1;
                  }
                  // Select last message no
                  db.query(`Select * from tblMessages order by intMessageNo desc limit 1`,
                    (err3,results3, fields3)=>{
                      if(err3){db.rollback(function(){console.log(err3); res.send("no")})}
                      else{
                        if (req.body.notify == 1){

                          if(results3==null||results3==undefined){messagenum = "1000"}else if(results3.length==0){messagenum = "1000"}
                          else{messagenum = parseInt(results3[0].intMessageNo)+1}
                          // insert to message
                          db.query(`Insert into tblMessages (intMessageNo, intOrderHistoryNo, strMessage,
                            intAdminID) values ("${messagenum}", "${historynum}","${req.body.message}", "1000" )`,(err4,results4,fields4)=>{
                            if (err4){db.rollback(function(){console.log(err4); res.send("no")})}
                          });
                        }
                        // Insert into order history
                        db.query(`Insert into tblOrderHistory (intOrderHistoryNo, intOrderNo,
                          strShippingMethod, strCourier, intStatus, intAdminID, intMessageNo) values ("${historynum}", "${req.body.orderNo}", "${req.body.shippingMethod}","${req.body.courier}", ${req.body.orderStatus}, "1000", "${messagenum}")`, (err5,results5,fields5)=>{
                            if(err5){db.rollback(function(){console.log(err5); res.send("no")})}
                            else{

                              if(req.body.orderStatus == 0){
                                // execute pending function
                                pending(req,res);
                              }
                              else if(req.body.orderStatus == 1){
                                // execute processing function
                                processing(req,res);
                              }
                              else if(req.body.orderStatus == 2){
                                // execute shipped function
                                shipped(req,res);
                              }
                              else if(req.body.orderStatus == 3){
                                // execute delivered function
                                delivered(req,res);
                              }
                              else if(req.body.orderStatus == 4){
                                // execute will not deliver function
                                delivered(req,res);
                              }
                              else if(req.body.orderStatus == 5){
                                // execute returned function
                                returned(req,res);
                              }
                              else{
                                // execute cancelled function
                              }



                            }
                        }) // End of Order History -------
                        // End of insert to order history
                      }
                  });
                  // End of last message no ----------------------
                }
            });
            // End of last ordhist no -------------------------
          }
      });
      // End of order status update -----------------------------
    }
  });
  // END OF TRANSACTION ----------------
});

router.get('/orderHistory',(req,res)=>{
  var orderno = req.query.order;

  db.query(`Select * from tblOrderHistory where intOrderNo = ${orderno}`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    res.render('admin-custOrder/views/orderHistory', {re: results1, moment: moment, order: orderno});
  });
});

router.get('/invoice', (req,res)=>{
  var orderno = req.query.order;

  // Order list
  db.query(`Select tblorderdetails.intQuantity as quantity, tblOrder.*, tblorderdetails.*,
    tblproductinventory.*, tblproductlist.* from tblOrder
    join tblorderdetails on tblorder.intorderno = tblorderdetails.intorderno
    join tblproductinventory on tblproductinventory.intinventoryno = tblorderdetails.intinventoryno
    join tblproductlist on tblproductlist.intproductno = tblproductinventory.intproductno
    where tblOrder.intOrderno = "${orderno}"`, (err1,results1,fields1)=>{
      if (err1) console.log(err1);

      // customer
      db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.*
        from tblOrder join tblUser on tblOrder.intUSerID = tblUser.intUserID
        join tblCustomer on tblUser.intUserID = tblCustomer.intUserID
        where tblOrder.intOrderno = "${orderno}"`, (err2,results2,fields2)=>{
          if (err2) console.log(err2);

          // total
          db.query(`Select SUM(tblorderdetails.intquantity * tblorderdetails.purchaseprice) as
            totalAll from tblOrder
            join tblorderdetails on tblorder.intorderno = tblorderdetails.intorderno
            join tblproductinventory on tblorderdetails.intinventoryno = tblproductinventory.intinventoryno
            where tblOrder.intOrderno = "${orderno}"`, (err3,results3,fields3)=>{
              if (err3) console.log(err3);

              res.render('admin-custOrder/views/invoice', {orderlist: results1, customer: results2, moment: moment, total: results3[0].totalAll });
            });
        });
    });

});

router.get('/recentOrders', (req,res)=>{

  db.query(`
    Select CURDATE() - INTERVAL 5 DAY as DatesFrom, tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.* from tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
    join tblCustomer on tblUser.intUserID = tblCustomer.intUSerID where dateOrdered >= CURDATE() - INTERVAL 5 DAY`, (err1,results1,fiels1)=>{
    if (err1) console.log(err1);

    res.render('admin-custOrder/views/recentOrders', {re: results1, moment: moment});
  });
});

router.get('/cancelledOrders',(req,res)=>{
  db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.* from tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
    join tblCustomer on tblUser.intUserID = tblCustomer.intUSerID where tblOrder.intStatus = 6`, (err1,results1,fields1)=>{
      if (err1) console.log(err1);

      res.render('admin-custOrder/views/cancelledOrders',{re: results1});
  });
});

router.get('/invoice-print',(req,res)=>{
  var orderno = req.query.order;

  // Order list
  db.query(`Select * from tblOrder
    join tblorderdetails on tblorder.intorderno = tblorderdetails.intorderno
    join tblproductlist on tblorderdetails.intproductno = tblproductlist.intproductno
    where tblOrder.intOrderno = ${orderno}`, (err1,results1,fields1)=>{
      if (err1) console.log(err1);

      // customer
      db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.*
        from tblOrder join tblUser on tblOrder.intUSerID = tblUser.intUserID
        join tblCustomer on tblUser.intUserID = tblCustomer.intUserID
        where tblOrder.intOrderno = ${orderno}`, (err2,results2,fields2)=>{
          if (err2) console.log(err2);

          // total
          db.query(`Select SUM(tblorderdetails.intquantity * tblorderdetails.purchaseprice) as
            totalAll from tblOrder
            join tblorderdetails on tblorder.intorderno = tblorderdetails.intorderno
            join tblproductlist on tblorderdetails.intproductno = tblproductlist.intproductno
            where tblOrder.intOrderno = ${orderno}`, (err3,results3,fields3)=>{
              if (err3) console.log(err3);

              res.render('admin-custOrder/views/invoice-print', {orderlist: results1, customer: results2, moment: moment, total: results3[0].totalAll });
            });
        });
    });
});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.customerOrder = router;
