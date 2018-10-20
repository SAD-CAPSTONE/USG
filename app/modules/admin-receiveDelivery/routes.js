var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
var async = require('async');
const userTypeAuth = require('../cust-0extras/userTypeAuth');
const auth_admin = userTypeAuth.admin;

router.get('/', auth_admin, (req,res)=>{
  db.query(`Select * from tblreceiveorder join tblpurchaseOrder on tblreceiveorder.intpurchaseorderno = tblpurchaseorder.intpurchaseorderno join tblSupplier on tblPurchaseOrder.intSupplierID = tblSupplier.intUserID`, (err1,results1,fields1)=>{
  if (err1) console.log(err1);
  res.render('admin-receiveDelivery/views/receiveDelivery', {re: results1, moment: moment});

});
});

router.get('/form', auth_admin, (req,res)=>{

  // select last record of deliveries
  db.query(`Select * from tblreceiveOrder order by intreceiveorderno desc limit 1`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    // select from purchase order lists
    db.query(`Select * from tblPurchaseOrder join tblSupplier on tblPurchaseOrder.intSupplierID = tblSupplier.intUserID where tblPurchaseOrder.intStatus = 0 or tblPurchaseOrder.intStatus = 2`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);
      res.render('admin-receiveDelivery/views/receiveDeliveryForm', {re:results1,pu:results2, moment: moment});
    });
  });
});

var purch_no = "";
router.post('/findNo', auth_admin, (req,res)=>{


  if (req.body.o == null || req.body.o == " " || req.body.o == undefined || req.body.o == ""){
    purch_no = 0;
  }else{
    purch_no = req.body.o;
  }

  db.query(`Select * from tblPurchaseOrder where tblPurchaseOrder.intPurchaseOrderNo = "${purch_no}" and (intStatus = 0 or intStatus = 2)`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    if (results1 == undefined || results1 == null){
      res.send("no");
    }
    else if(results1.length == 0){
      res.send("no");
    }
    else{
      res.send("yes");
    }
  });
});

router.get('/loadOrderList', auth_admin, (req,res)=>{
  // dapat kapag bad orders, yung bad lang lalabas
  db.query(`Select * from tblPurchaseOrder join tblPurchaseOrderList
    on tblPurchaseOrder.intPurchaseOrderNo = tblPurchaseOrderList.intPurchaseOrderNo
    join tblProductInventory on tblPurchaseOrderList.intInventoryNo = tblProductInventory.intInventoryNo
    where tblPurchaseOrder.intPurchaseOrderNo = "${purch_no}" and tblPurchaseOrder.intStatus = 0`,(err1,results1,fields1)=>{
    if(err1) console.log(err1);
    if (!err1) res.render('admin-receiveDelivery/views/productLoader', {re: results1});

  });
});

router.get('/deliveryDetails', auth_admin, (req,res)=>{
  db.query(`Select * from tblReceiveOrder join tblReceiveOrderlist
    on tblReceiveOrder.intReceiveOrderNo = tblReceiveOrderlist.intReceiveOrderNo
    where tblReceiveOrderlist.intReceiveOrderNo = "${req.query.delivery}"`,(err1,results,fields1)=>{
    if(err1) console.log(err1);
      db.query(`Select * from tblReceiveOrder join tblPurchaseOrder on tblReceiveOrder.intPurchaseOrderNo = tblPurchaseOrder.intPurchaseOrderNo join tblSupplier on tblSupplier.intUserID = tblPurchaseOrder.intSupplierID join tblUser on tblSupplier.intUserID = tblUser.intUserID where intReceiveOrderNo = "${req.query.delivery}"`,(err3,results2,f3)=>{
        if(err3) console.log(err3);
        if (!err3) res.render('admin-receiveDelivery/views/deliveryDetails',{re: results, delivery_no: req.query.delivery, moment:moment, from: results2});
        
      });

    });
});

router.get('/inventoryRecord', auth_admin, (req,res)=>{
  db.query(`Select * from tblReceiveOrder join tblReceiveOrderList
    on tblReceiveOrder.intReceiveOrderNo = tblReceiveOrderList.intReceiveOrderNo
    join tblProductInventory on tblProductInventory.intInventoryNo = tblReceiveOrderList.intInventoryNo
    join tblProductList on tblProductList.intProductNo = tblProductInventory.intProductNo
    join tblUom on tblUom.intUomNo = tblProductInventory.intUomNo
    where tblReceiveOrder.intReceiveOrderNo = ${req.query.ro}`,(err1,res1,fie1)=>{
      if(err1) console.log(err1);
      else{
        res.render('admin-receiveDelivery/views/inventoryRecordForm', {re: res1, moment: moment});

      }
    })
})

router.post('/newDeliveryRecord', auth_admin, (req,res)=>{

  var counter = 0;
  var startNo = "1000";
  var loop = req.body.product;

  db.beginTransaction(function(err){
    if(err){db.rollback(function(){
        console.log(err);
      })}
    else{
      db.query(`Insert into tblreceiveOrder (intReceiveOrderNo, intPurchaseOrderNo, intAdminID,   specialNotes)
        values ("${req.body.rno}", "${req.body.POno}", "${req.user.intUserID}", "${req.body.note}")`,(err1,results1,fields1)=>{
        if (err1){db.rollback(function(){
            console.log(err1);
          })}
        else{
          db.query(`Select * from tblReceiveOrderlist order by intOrderReceivedNo desc limit 1`,(err2,results2,fields2)=>{
            if(err2){db.rollback(function(){
                console.log(err2);
              })}
            else{
              if (results2 == null || results2 == undefined){

              }else if(results2.length == 0){

              }else{
                startNo = parseInt(results2[0].intOrderReceivedNo) +1;
              }

              db.query(`Update tblPurchaseOrder set intStatus = 1 where intPurchaseOrderNo = "${req.body.POno}"`,(e2,r2,f2)=>{
                if(e2){db.rollback(function(){
                    console.log(e2);
                  })}
                else{
                  async.eachSeries(loop,function(data,callback){

                    var exdate = moment(req.body.expiration[counter]).format("YYYY-MM-DD");

                    var d = "2001-02-31";
                    db.query(`INSERT INTO tblreceiveorderlist (intOrderReceivedNo, intReceiveOrderNo, intInventoryNo, strProduct, strSize, productPrice, intQuantity, SRP, dateExpiration, intOrderStatus, strVariant)
                     VALUES ("${startNo}", "${req.body.rno}", "${req.body.inventory[counter]}", "${req.body.product[counter]}", "${req.body.size[counter]}", "", "${req.body.quantity[counter]}", "${req.body.srp[counter]}", "${exdate}", "${req.body.status[counter]}", "${req.body.variant[counter]}")`, (err3,results3,fields3)=>{
                      if (err3){db.rollback(function(){console.log(err3);})}
                      else{
                        counter++;
                        startNo++;
                        callback();
                      }

                    });
                  }, function(e,results){
                    if (e){  db.rollback(function(){
                        console.log(e);
                      })}
                    else{
                      db.commit(function(e1){
                        if(e1){  db.rollback(function(){
                            console.log(e1);
                          })}
                        else{
                          res.send(`${req.body.rno}`);

                        }
                      })
                    }
                  });
                }
              });
            }
          })
        }
      });
    }
  })

});

router.get('/print', auth_admin, (req,res)=>{
  db.query(`Select * from tblReceiveOrder join tblReceiveOrderlist on tblReceiveOrder.intReceiveOrderNo = tblReceiveOrderlist.intReceiveOrderNo where tblReceiveOrderlist.intReceiveOrderNo = "${req.query.ro}" and tblReceiveOrderlist.intOrderStatus = "Good"`,(err1,good,fields1)=>{
    if(err1) console.log(err1);

    db.query(`Select * from tblReceiveOrder join tblReceiveOrderlist on tblReceiveOrder.intReceiveOrderNo = tblReceiveOrderlist.intReceiveOrderNo where tblReceiveOrderlist.intReceiveOrderNo = "${req.query.ro}" and tblReceiveOrderlist.intOrderStatus = "Bad"`,(err2,bad,fields2)=>{
      if(err2) console.log(err2);

      db.query(`Select * from tblReceiveOrder join tblPurchaseOrder on tblReceiveOrder.intPurchaseOrderNo = tblPurchaseOrder.intPurchaseOrderNo join tblSupplier on tblSupplier.intUserID = tblPurchaseOrder.intSupplierID join tblUser on tblSupplier.intUserID = tblUser.intUserID where intReceiveOrderNo = "${req.query.ro}"`,(err3,r3,f3)=>{
        if(err3) console.log(err3);
        if (!err3) res.render('admin-receiveDelivery/views/deliveryPrint',{re_good: good, re_bad: bad, delivery_no: req.query.ro, moment:moment, from: r3});
      });

    });

  });

});

router.get('/returnBadOrders', auth_admin, (req,res)=>{
  db.query(`Select * from tblReceiveOrder join tblReceiveOrderList on tblReceiveOrder.intReceiveOrderNo = tblReceiveOrderList.intReceiveOrderNo where tblReceiveOrder.intReceiveOrderNo = "${req.query.ro}" and tblReceiveOrderList.intOrderStatus = "Bad"`,(e1,bad,f1)=>{
    if(e1) console.log(e1);
    if(!e1){
      res.render('admin-receiveDelivery/views/returnBadOrdersForm',{bad: bad, delivery_no: req.query.ro, moment: moment});
    }
  });
});

router.post('/returnBadOrders', auth_admin, (req,res)=>{
  var rb_no = "1000";
  var rblist_no = "1000";
  var loop = req.body.product;
  var count = 0;
  db.beginTransaction(function(e1){
    if(e1){db.rollback(function(){console.log(e1); res.send("no");})}
    if(!e1){
      db.query(`Select * from tblreturnbadorders order by intbadordersno desc limit 1`,(e2,r2,f2)=>{
        if(e2) {db.rollback(function(){console.log(e2); res.send("no");})}
        if(!e2){
          if(r2==null||r2==undefined){} else if(r2.length==0){}
          else{rb_no = parseInt(r2[0].intBadOrdersNo) + 1}

          db.query(`Select * from tblbadorderslist order by intbadorderslistno desc limit 1`,(e3,r3,f3)=>{
            if(e3){db.rollback(function(){console.log(e2); res.send("no");})}
            if(!e3){
              if(r3==null||r3==undefined){} else if(r3.length==0){}
              else{ rblist_no = parseInt(r3[0].intBadOrdersListNo) + 1}

              db.query(`Insert into tblreturnbadorders (intBadOrdersNo, intReceiveOrderNo, strReason) values("${rb_no}","${req.body.rno}","${req.body.reason}")`,(e4,r4,f4)=>{
                if(e4) {db.rollback(function(){console.log(e4); res.send("no");})}
                if(!e4){

                  async.eachSeries(loop, function(data,callback){
                    db.query(`Insert into tblbadorderslist (intBadOrdersListNo, intBadOrdersNo, strProduct, strVariant, strSize, intQuantity) values("${rblist_no}","${rb_no}","${req.body.product[count]}", "${req.body.variant[count]}","${req.body.size[count]}",${req.body.quantity[count]})`,(e5,r5,f5)=>{
                      if(e5) {db.rollback(function(){console.log(e5); res.send("no");})}
                      else{
                        count++;
                        rblist_no++;
                        callback();
                      }
                    });
                  },function(error,results){
                    if(error) {db.rollback(function(){console.log(error); res.send("no");})}
                    else{

                      db.query(`Update tblPurchaseOrder set tblPurchaseOrder.intStatus = 2 where tblPurchaseOrder.intPurchaseOrderNo = (Select intPurchaseOrderNo from tblReceiveOrder join tblReturnBadOrders on tblReceiveOrder.intReceiveOrderNo = tblReturnBadOrders.intReceiveOrderNo where intBadOrdersNo = "${rb_no}")`,(e7,r7,f7)=>{
                        if(e7)  {db.rollback(function(){console.log(e7); res.send("no");})}
                        else{
                          db.commit(function(e6){
                            if(e6){db.rollback(function(){console.log(e6); res.send("no");})}
                            else{
                              res.send("yes");
                            }
                          })
                        }
                      });

                    }
                  });

                }
              });
            }
          });
        }
      });
    }
  })
});

router.post('/addToInventory', auth_admin, (req,res)=>{
  var batch_no = "1000", transact_no="1000", count = 0;

  db.beginTransaction(function(err){
    if(err) console.log(err);
    else{
      db.query(`Select * from tblBatch order by intBatchNo desc limit 1`,(err1,res1,fie1)=>{
        if(err1) console.log(err1);
        else{
          if(res1.length==0){} else{ batch_no = parseInt(res1[0].intBatchNo) + 1}

          db.query(`Select * from tblInventoryTransactions order by intTransactionId desc limit 1`,(err2,res2,fie2)=>{
            if(err2) console.log(err2);
            else{
              if(res2.length==0){} else{ transact_no = parseInt(res2[0].intTransactionID) + 1}

              async.eachSeries(req.body.inventory, function(data,callback){

                db.query(`Select * from tblProductInventory where intInventoryNo = "${req.body.inventory[count]}"`,(err3,inv,fie3)=>{
                  if(err3) console.log(err3);
                  else{
                    db.query(`Insert into tblBatch (intBatchNo, expirationDate, intInventoryNo, intQuantity)
                      values ("${batch_no}", "${req.body.expiration[count]}", "${req.body.inventory[count]}", ${req.body.quantity[count]})`,(err4,res4,fie4)=>{
                        if(err4) console.log(err4)
                        else{
                          db.query(`Insert into tblInventoryTransactions (intTransactionID, intInventoryNo, intShelfNo, intCriticalLimit, strTypeOfChanges, intUserID, productSRP, productPrice, currQuantity)
                            values ("${transact_no}", "${req.body.inventory[count]}", ${inv[0].intShelfNo}, ${inv[0].intCriticalLimit}, "(+${req.body.quantity[count]}) Received Delivery", "${req.user.intUserID}", ${inv[0].productSRP}, ${inv[0].productPrice}, ${inv[0].intQuantity + req.body.quantity[count]})`,(err5,res5,fie5)=>{
                              if(err5) console.log(err5);
                              else{
                                db.query(`Update tblProductInventory set intQuantity = intQuantity + ${req.body.quantity[count]} where intInventoryNo = "${req.body.inventory[count]}"`,(err6, res6, fie6)=>{
                                  if(err6) console.log(err6);
                                  else{

                                    db.query(`Update tblReceiveOrderList set inventoryRecordStatus = 1
                                      where intOrderReceivedNo = "${req.body.list[count]}"`,(err7,res7, fie7)=>{
                                        if(err7) console.log(err7);
                                        else{
                                          batch_no++;
                                          transact_no++;
                                          count++;
                                          callback();
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

              }, function(erra,resa){
                if(erra) console.log(erra);
                else{
                  db.commit(function(errb){
                    if(errb) console.log(errb);
                    else{
                      res.send("yes")
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
})

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.receiveDelivery = router;
