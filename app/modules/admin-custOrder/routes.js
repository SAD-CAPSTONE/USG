var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
var async = require('async');


router.get('/', (req,res)=>{
  db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.* from
    tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
    join tblCustomer on tblUser.intUserID = tblCustomer.intUSerID `, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    else{
      db.query(`
        Select CURDATE() - INTERVAL 5 DAY as DatesFrom, tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.* from tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
        join tblCustomer on tblUser.intUserID = tblCustomer.intUSerID where dateOrdered >= CURDATE() - INTERVAL 5 DAY`, (err2,results2,fiels2)=>{
        if (err2) console.log(err2);
        else{
          db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.* from tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
            join tblCustomer on tblUser.intUserID = tblCustomer.intUSerID where tblOrder.intStatus = 6`, (err3,results3,fields3)=>{
              if (err3) console.log(err3);
              else{
                res.render('admin-custOrder/views/allOrders', {re: results1, re2: results2, re3: results3,  moment: moment});

              }

          });
        }
      });
    }


  });
});

router.post('/checkNewOrders',(req,res)=>{
    db.query(`Select count(*) as qty from tblOrder where  tblOrder.intStatus = 0`, (err1,results1,fields1)=>{
        if (err1) console.log(err1);

        if (results1 == null || results1 == undefined){
          res.send("no");
        }else if(results1.length > 0){
          res.send(results1);
        }else{
          res.send("no");
        }
  });
});

router.get('/checkNewOrders',(req,res)=>{
  // pending orders
  db.query(`Select tblOrder.intStatus as Stat,
    tblOrder.*, tblUser.*, tblCustomer.* from tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
    join tblCustomer on tblUser.intUserID = tblCustomer.intUSerID where  tblOrder.intStatus = 0`,(err1,pending,fields1)=>{
      if (err1) console.log(err1);
      else{
        // bank deposits
        db.query(`Select * from tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
          where intpaymentstatus = 0 and  depositSlip <> ""`,(err2,bank,fie1)=>{
            if(err2) console.log(err2);
            else{
              // returned orders
              db.query(`Select * from tblReturnOrder join tblOrder on tblReturnOrder.intOrderNo = tblOrder.intOrderNo
                join tblUser on tblOrder.intUserID = tblUser.intUserID
                where tblReturnOrder.intStatus = 0`,(err3,returns,fie3)=>{
                  if(err3) console.log(err3);
                  else{
                    // cancelled orders
                    db.query(`Select * from tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
                      where tblOrder.intStatus = 6 and (dateOrdered >= CURDATE() - INTERVAL 3 DAY)`,(err4,cancel,fie4)=>{
                        if(err4) console.log(err4);
                        else{
                          res.render('admin-custOrder/views/newOrders', {pending: pending, moment: moment, bank: bank, returns: returns,cancel: cancel })

                        }
                      })
                  }
                })
            }

          })
      }

    });
});

router.get('/allOrders', (req,res)=>{
  db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.* from
    tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
    join tblCustomer on tblUser.intUserID = tblCustomer.intUSerID
    order by intOrderNo desc`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    else{
      db.query(`
        Select CURDATE() - INTERVAL 5 DAY as DatesFrom, tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.* from tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
        join tblCustomer on tblUser.intUserID = tblCustomer.intUSerID where dateOrdered >= CURDATE() - INTERVAL 5 DAY`, (err2,results2,fiels2)=>{
        if (err2) console.log(err2);
        else{
          db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.* from tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
            join tblCustomer on tblUser.intUserID = tblCustomer.intUSerID where tblOrder.intStatus = 6`, (err3,results3,fields3)=>{
              if (err3) console.log(err3);
              else{
                res.render('admin-custOrder/views/allOrders', {re: results1, re2: results2, re3: results3,  moment: moment});

              }

          });
        }
      });
    }


  });
});


router.get('/assessOrder',(req,res)=>{
  var orderno = req.query.order;

  // Order list
  db.query(`(Select tblOrderDetails.intOrderDetailsNo, tblOrderDetails.intOrderNo, tblOrderDetails.intInventoryNo, tblOrderDetails.intQuantity, tblOrderDetails.purchasePrice, tblOrderDetails.discount, tblOrderDetails.intProductType,
    CONCAT(tblProductList.strProductName, tblProductInventory.strVariant,tblProductInventory.intSize, tblUom.strUnitname) as productName from tblOrder
    join tblorderdetails on tblorder.intorderno = tblorderdetails.intorderno
    join tblproductinventory on tblproductinventory.intinventoryno = tblorderdetails.intinventoryno
    join tblUOM on tblProductinventory.intUOMno = tblUom.intUOMno
    join tblproductlist on tblproductlist.intproductno = tblproductinventory.intproductno
    where tblOrder.intOrderno = "${orderno}" and tblOrderdetails.intProductType = 1 )

    UNION

    ( Select tblOrderDetails.intOrderDetailsNo, tblOrderDetails.intOrderNo, tblOrderDetails.intInventoryNo, tblOrderDetails.intQuantity,  tblOrderDetails.purchasePrice, tblOrderDetails.discount, tblOrderDetails.intProductType, CONCAT(tblPackage.strPackageName) as productName from tblOrder join tblOrderDetails on tblOrder.intOrderNo = tblOrderDetails.intOrderNo join tblPackage on tblOrderDetails.intInventoryNo = tblPackage.intPackageNo
    where tblOrder.intOrderNo = "${orderno}" and tblOrderDetails.intProductType = 2)`,(err1,results1,fields1)=>{
      if (err1) console.log(err1);


    // customer details
    db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.*
      from tblOrder join tblUser on tblOrder.intUSerID = tblUser.intUserID
      join tblCustomer on tblUser.intUserID = tblCustomer.intUserID
      where tblOrder.intOrderno = "${orderno}"`,(err2,results2,fields2)=>{
        if (err2) console.log(err2);

      // total
      db.query(`Select SUM((tblorderdetails.intquantity * tblorderdetails.purchaseprice) - ((tblorderdetails.intquantity * tblorderdetails.purchaseprice) * (tblOrderDetails.discount / 100)))
        totalAll from tblOrder
        join tblorderdetails on tblorder.intorderno = tblorderdetails.intorderno
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

              db.query(`Select * from tblOrderHistory where intOrderNo = ${orderno} order by intOrderHistoryNo desc limit 3`,(err5,res5,fie5)=>{
                if(err5) console.log(err5);
                else{
                  res.render('admin-custOrder/views/assessOrder', {orderno: orderno, orderlist: results1, customer: results2, moment: moment, total: results3[0].totalAll, payment: this_total, history: res5});

                }
              })

            });


      });


    });

  });
});

function pending(req,res){

} // end of pending

function processing(req,res){

} // end of processing


function forPackage(req,res){

}

function shipped(req,res){
  var c = 0, transact_no = "1000";
  // update product inventory
  db.query(`Select * from tblorderdetails where intOrderNo = "${req.body.orderNo}"`,(errz,orders,fieldsz)=>{
    if(errz){db.rollback(function(){console.log(errz)})}
    else{

      async.eachSeries(orders,function(data,callback){

        // if ordinary product
        if(orders[c].intProductType == 1){

          // check if stock is in Quantity
          db.query(`Select * from tblProductinventory where intInventoryNo = "${orders[c].intInventoryNo}" and intQuantity  >= ${orders[c].intQuantity}`,(errw,resw,fieldsw)=>{
            if(errw){db.rollback(function(){console.log(errw); res.send("no")})}
            else{
              if(resw==undefined||resw==null){db.rollback(function(){ res.send("false")})}
              else if(resw.length==0){db.rollback(function(){ res.send("false")})}
              else{
                // Update inventory (less quantity , reserved items )
                db.query(`Update tblproductinventory set intQuantity = intQuantity - ${orders[c].intQuantity}, intReservedItems = intReservedItems - ${orders[c].intQuantity}
                  where (tblproductinventory.intInventoryNo = "${orders[c].intInventoryNo}") and (intQuantity  >= ${orders[c].intQuantity})`,(errx,resultsx,fieldsx)=>{
                    if(errx){db.rollback(function(){console.log(errx); res.send("no");})}

                    else{
                      db.query(`Select * from tblInventoryTransactions order by intTransactionID desc limit 1`,(err01,res01,fie01)=>{
                        if(err01) {db.rollback(function(){console.log(err01); res.send("no");})}
                        else{
                          if(res01.length==0){} else{ transact_no = parseInt(res01[0].intTransactionID) + 1}

                          db.query(`Insert into tblInventoryTransactions (intTransactionID, intInventoryNo, intShelfNo, intCriticalLimit, strTypeOfChanges, intUSerID, productSRP, productPrice, currQuantity)
                            values ("${transact_no}", "${orders[c].intInventoryNo}", ${resw[0].intShelfNo}, ${resw[0].intCriticalLimit}, "Sold Products (-${orders[c].intQuantity} deduct from Inventory)", "1000", ${resw[0].productSRP}, ${resw[0].productPrice}, ${resw[0].intQuantity - orders[c].intQuantity})`,(err02,res02,fie02)=>{
                              if(err02) {db.rollback(function(){console.log(err02); res.send("no");})}
                              else{
                                // batch deduct
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
                                      c++;
                                      callback();
                                  }) // end of batch deduct
                              }

                            }) // End of inventory transaction update
                        }
                      })


                    }
                  });
              }
            }
          });

        } // end of ordinary product

        // if package product
        else{
          // check if stock is in quantity
          db.query(`Select * from tblPackage where intPackageNo = "${orders[c].intInventoryNo}" and intQuantity >= ${orders[c].intQuantity}`,(errw,resw,fiew)=>{
            if(errw) {console.log(errw); res.send("no")}
            else{
              if(resw==undefined||resw==null){res.send("false")} else if(resw.length==0){res.send("false")}
              else{
                // Update package (less quantity, reserved items)
                db.query(`Update tblPackage set intQuantity = intQuantity - ${orders[c].intQuantity}, intReservedItems = intReservedItems - ${orders[c].intQuantity}
                  where (intPackageNo = "${orders[c].intInventoryNo}") and (intQuantity  >= ${orders[c].intQuantity})`,(errx,resx,fiex)=>{
                    if(errx) {console.log(errx); res.send("no");}
                    else{
                      c++;
                      callback();
                    }
                  })
              }
            }
          })
        } // end of package product


      },function(erry,resultsy){
        if(erry){db.rollback(function(){console.log(erry)})}
        else{


        }

      })
    }
  });

} // end of Shipped

function delivered(req,res){

} // end of delivered

function notDeliver(req,res){

} // end of not delivered

function returned(req,res){

} // end of returned

function cancelled(req,res){
  db.query(`Select * from tblOrderDetails where intOrderNo = "${req.body.orderNo}"`,(err1,details,fie1)=>{
    if(err1) console.log(err1);
    else{
      details.forEach(function(i){
        // For ordinary product
        if(i.intProductType == 1){
          db.query(`Update tblProductInventory set intReservedItems = intReservedItems - ${i.intQuantity} where intInventoryNo = ${i.intInventoryNo}`,(err2,res2,fie2)=>{
            if(err2) console.log(err2);
            else{

            }
          })

        }
        // For package product
        else{
          db.query(`Update tblPackage set intReservedItems = intReservedItems - ${i.intQuantity} where intPackageNo = ${i.intInventoryNo}`,(err3,res3,fie3)=>{
            if(err3) console.log(err3);
            else{

            }
          })
        }
      })
    }
  })

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
  var orderStat = 0, paymentStat = 0, sameStat = 0;

  if(req.body.orderStatus == ""){ orderStat = req.body.currentOrderStat } else{ orderStat = req.body.orderStatus}
  if(req.body.paymentStatus == ""){ paymentStat = req.body.currentPaymentStat} else{ paymentStat = req.body.paymentStatus}

  if (req.body.orderStatus == req.body.currentOrderStat){ sameStat = 1}

  if(req.body.orderStatus == req.body.currentOrderStat && req.body.paymentStatus == req.body.currentPaymentStat){
    res.send("same");
  }else{

    db.beginTransaction(function(err){
    if(err){ console.log(err);}
    else{

      // Update order status
      db.query(`Update tblOrder set intStatus = ${orderStat}, strShippingMethod ="${req.body.shippingMethod}",
       strCourier = "${req.body.courier}", intPaymentStatus = ${paymentStat} where intOrderNo = "${req.body.orderNo}" `, (err1,results1,fields1)=>{
          if(err1){db.rollback(function(){console.log(err1); res.send("no")})}
          else{
            var historynum = 1000, messagenum = 0;

            // Select customer ID
            db.query(`Select * from tblOrder where intOrderNo = "${req.body.orderNo}"`,(err01,cust,fie01)=>{
              if(err01) console.log(err01);
              else{

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

                              var new_message = `${req.body.message}`+ ` `+ `(Order #${req.body.orderNo})`;

                              if(results3==null||results3==undefined){messagenum = "1000"}else if(results3.length==0){messagenum = "1000"}
                              else{messagenum = parseInt(results3[0].intMessageNo)+1}
                              // insert to message
                              db.query(`Insert into tblMessages (intMessageNo, intCustomerID, strMessage,
                                intAdminID) values ("${messagenum}", "${cust[0].intUserID}","${new_message}", "1000" )`,(err4,results4,fields4)=>{
                                if (err4){db.rollback(function(){console.log(err4); res.send("no")})}
                              });
                            }
                            // Insert into order history
                            db.query(`Insert into tblOrderHistory (intOrderHistoryNo, intOrderNo,
                              strShippingMethod, strCourier, intStatus, intAdminID, intPaymentStatus)
                              values ("${historynum}", "${req.body.orderNo}", "${req.body.shippingMethod}","${req.body.courier}", ${orderStat}, "1000",  ${paymentStat})`, (err5,results5,fields5)=>{
                                if(err5){db.rollback(function(){console.log(err5); res.send("no")})}
                                else{

                                  // For order status ------------------------
                                  if(orderStat == 0){
                                    // execute pending function
                                    pending(req,res);
                                  }
                                  else if(orderStat == 1){
                                    // execute processing function
                                    processing(req,res);
                                  }
                                  else if(orderStat == 2){
                                    // you cannot set shipped twice
                                    if(sameStat == 1) {

                                    }else{
                                      // execute shipped function
                                      shipped(req,res);
                                    }

                                  }
                                  else if(orderStat == 3){
                                    // execute delivered function
                                    delivered(req,res);
                                  }
                                  else if(orderStat == 4){
                                    // execute will not deliver function
                                    notDeliver(req,res);
                                  }
                                  else if(orderStat == 5){
                                    // execute returned function
                                    returned(req,res);
                                  }
                                  else if(orderStat == 6){
                                    // execute cancelled function
                                    cancelled(req,res);
                                  }else{
                                    // execute blank orderStat
                                  }

                                  // For payment status ----------------------
                                  if (paymentStat == 0){

                                      db.commit(function(erri){
                                        if(erri){db.rollback(function(){console.log(erri); res.send("no")})}
                                        else{
                                          res.send("yes")

                                        }
                                      });


                                  }else if(paymentStat == 1){

                                      paid(req,res);

                                  }else{

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
            })
            // End of select customer no -------------------------
          }
      });
      // End of order status update -----------------------------
    }
  });
    // END OF TRANSACTION ----------------
  }

});

router.get('/orderHistory',(req,res)=>{
  var orderno = req.query.order;

  db.query(`Select tblOrderHistory.intStatus as orderStatus, tblOrderHistory.intPaymentStatus as paymentStatus, tblOrderHistory.*,tblMessages.* from tblOrderHistory join tblMessages on tblOrderHistory.intOrderHistoryNo = tblMessages.intOrderHistoryNo where intOrderNo = ${orderno}`, (err1,results1,fields1)=>{
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
      res.render('admin-custOrder/views/cancelledOrders',{re: results1, moment: moment});
  });
});

router.get('/invoice-print',(req,res)=>{
  var orderno = req.query.order;

  // Order list
  db.query(`Select * from tblOrder
    join tblorderdetails on tblorder.intorderno = tblorderdetails.intorderno
    join tblproductinventory on tblorderdetails.intinventoryno = tblProductinventory.intinventoryno
    join tblproductlist on tblproductlist.intproductno = tblProductinventory.intproductno
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
            join tblproductinventory on tblorderdetails.intinventoryno = tblProductinventory.intinventoryno
            join tblproductlist on tblproductlist.intproductno = tblProductinventory.intproductno
            where tblOrder.intOrderno = ${orderno}`, (err3,results3,fields3)=>{
              if (err3) console.log(err3);

              res.render('admin-custOrder/views/invoice-print', {orderlist: results1, customer: results2, moment: moment, total: results3[0].totalAll });
            });
        });
    });
});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.customerOrder = router;
