var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
var async = require('async');

var adj_returned = 0;


router.get('/', (req,res)=>{
  db.query(`Select * from tblReturnOrder`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      res.render('admin-returnOrder/views/returnOrder',{re: res1, moment: moment});

    }
  })
});

router.get('/view',(req,res)=>{
  db.query(`Select * from tblReturnOrder where intReturnOrderNo = "${req.query.q}"`,(err1,return_order,fie1)=>{
    if(err1) console.log(err1);
    else{
      db.query(`Select * from tblReturnOrder join tblOrder on tblReturnOrder.intOrderNo = tblOrder.intOrderNo
        join tblUser on tblOrder.intUserID = tblUser.intUserID
        join tblCustomer on tblCustomer.intUserID = tblUser.intUserID
        where tblReturnOrder.intReturnOrderNo = "${req.query.q}"`,(err2,customer,fie2)=>{
          if(err2) console.log(err2);
          else{
            db.query(`Select Concat_WS(' ', a2.strProductName, a1.strVariant, a1.intSize, a3.strUnitName) as orderedProducts, intOrderQuantity as orderedQuantity,
              Concat_WS(' ', b2.strProductName, b1.strVariant, b1.intSize, b3.strUnitName) as replacedProduct, intReplaceQuantity as replacedQuantity, z1.*

              from tblReturnOrderList as z1 join tblOrderDetails as o1 on z1.intOrderDetailsNo = o1.intOrderDetailsNo
              join tblProductInventory as a1 on o1.intInventoryNo = a1.intInventoryNo
              join tblProductlist as a2 on a1.intProductNo = a2.intProductNo
              join tblUom as a3 on a3.intuomno = a1.intuomno

              join tblProductInventory as b1 on z1.intInventoryNo = b1.strBarcode
              join tblProductList as b2 on b2.intProductNo = b1.intProductNo
              join tblUom as b3 on b3.intUomno = b1.intuomno

              where intReturnOrderNo = "${req.query.q}"`,(err3,list,fie3)=>{
                if(err3) console.log(err3);
                else{
                  res.render('admin-returnOrder/views/invoice',{return_order: return_order, customer: customer, list: list, moment: moment})
                }
              })
          }
        })
    }
  })
});

router.get('/invoice-print',(req,res)=>{
  db.query(`Select * from tblReturnOrder where intReturnOrderNo = "${req.query.q}"`,(err1,return_order,fie1)=>{
    if(err1) console.log(err1);
    else{
      db.query(`Select * from tblReturnOrder join tblOrder on tblReturnOrder.intOrderNo = tblOrder.intOrderNo
        join tblUser on tblOrder.intUserID = tblUser.intUserID
        join tblCustomer on tblCustomer.intUserID = tblUser.intUserID
        where tblReturnOrder.intReturnOrderNo = "${req.query.q}"`,(err2,customer,fie2)=>{
          if(err2) console.log(err2);
          else{
            db.query(`Select Concat_WS(' ', a2.strProductName, a1.strVariant, a1.intSize, a3.strUnitName) as orderedProducts, intOrderQuantity as orderedQuantity,
              Concat_WS(' ', b2.strProductName, b1.strVariant, b1.intSize, b3.strUnitName) as replacedProduct, intReplaceQuantity as replacedQuantity, z1.*

              from tblReturnOrderList as z1 join tblOrderDetails as o1 on z1.intOrderDetailsNo = o1.intOrderDetailsNo
              join tblProductInventory as a1 on o1.intInventoryNo = a1.intInventoryNo
              join tblProductlist as a2 on a1.intProductNo = a2.intProductNo
              join tblUom as a3 on a3.intuomno = a1.intuomno

              join tblProductInventory as b1 on z1.intInventoryNo = b1.strBarcode
              join tblProductList as b2 on b2.intProductNo = b1.intProductNo
              join tblUom as b3 on b3.intUomno = b1.intuomno

              where intReturnOrderNo = "${req.query.q}"`,(err3,list,fie3)=>{
                if(err3) console.log(err3);
                else{
                  res.render('admin-returnOrder/views/invoice-print',{return_order: return_order, customer: customer, list: list, moment: moment})
                }
              })
          }
        })
    }
  })
})

router.get('/assessForm',(req,res)=>{
  db.query(`Select * from tblReturnOrder where intReturnOrderNo = "${req.query.q}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      db.query(`Select tblReturnOrderList.intOrderQuantity as qty, tblReturnOrderList.*, tblOrderDetails.*, tblProductInventory.*, tblProductList.*, tblUom.*
        from tblReturnOrderList join tblOrderDetails on tblReturnOrderList.intOrderDetailsNo = tblOrderDetails.intOrderDetailsNo
        join tblProductInventory on tblOrderDetails.intInventoryNo = tblProductInventory.intInventoryNo
        join tblProductList on tblProductList.intProductNo = tblProductInventory.intProductNo
        join tblUom on tblUom.intUomno = tblProductInventory.intUomno
        where intReturnOrderNo = "${req.query.q}"`,(err2,res2,fie2)=>{
          if(err2) console.log(err2);
          else{

            db.query(`Select * from tblReturnOrder join tblOrder on tblReturnOrder.intOrderNo = tblOrder.intOrderNo
              join tblUser on tblUser.intUserID = tblOrder.intUserID`,(err3,res3,fie3)=>{
                if(err3) console.log(err3);
                else{
                  res.render('admin-returnOrder/views/assessOrderForm',{ret: res1, det: res2, cust: res3, moment: moment})

                }
              })
          }
        })
    }
  })
})

router.get('/form', (req,res)=>{
  db.query(`Select * from tblReturnOrder order by intReturnOrderNo desc limit 1`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    db.query(`Select * from tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID where tblOrder.intStatus = 2 or tblOrder.intStatus = 3`,(err2,res2,fie2)=>{
      if(err2) console.log(err2);
      else{
        res.render('admin-returnOrder/views/returnOrderForm',{resu: res1, moment:moment, orders: res2});

      }
    })

  })
});

var order_no = 0;
router.post('/findOrderNo',(req,res)=>{
  db.query(`Select * from tblOrder where (intStatus = 2 or intStatus = 3) and intOrderNo = ${req.body.o}`,(err1,res1,fie1)=>{
    if(err1) { res.send("no")}
    else{
      if(res1.length == 0){order_no = 0; res.send("no"); }
      else{order_no = res1[0].intOrderNo; res.send("yes"); }
    }
  })
})

router.get('/loadOrderList',(req,res)=>{
  db.query(`Select tblOrderDetails.intQuantity as quantity, tblOrder.*, tblOrderDetails.*, tblProductList.*, tblProductInventory.*, tblUom.*
    from tblOrder join tblOrderDetails on tblOrder.intOrderNo = tblOrderDetails.intOrderNo
    join tblProductInventory on tblOrderdetails.intInventoryNo = tblProductInventory.intInventoryNo join tblProductList on tblProductList.intProductNo = tblProductInventory.intProductNo
    join tbluom on tblProductInventory.intUomno = tbluom.intuomno where tblOrder.intOrderNo = "${order_no}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1)
    else{
      res.render('admin-returnOrder/views/productLoader',{re:res1})
    }
  })
});


router.post('/newReturn',(req,res)=>{
  console.log(req.body.order_no)
  var return_no = "1000", list_no = "1000", adj_no = "1000", sales_no = "1000", transact_no = "1000";
  var loop = req.body.inventory;
  var count = 0;
  var total = 0;
  db.beginTransaction(function(e){
    if(e){console.log(e)}
    else{
      // Select return order no
      db.query(`Select * from tblReturnOrder order by intReturnOrderNo desc limit 1`,(err1,res1,fie1)=>{
        if(err1) console.log(err1);
        else{
          if(res1.length==0){} else{return_no = parseInt(res1[0].intReturnOrderNo) + 1;}
          // Select return order list no
          db.query(`Select * from tblReturnOrderList order by intReturnOrderListNo desc limit 1`,(err2,res2,fie2)=>{
            if(err2) console.log(err2);
            else{
              if(res2.length==0){} else{list_no = parseInt(res2[0].intReturnOrderListNo)+1;}
              // Select adjustment no
              db.query(`Select * from tblAdjustments order by intAdjustmentNo desc limit 1`,(err3,res3,fie3)=>{
                if(err3) console.log(err3);
                else{
                  if(res3.length==0){} else{adj_no = parseInt(res3[0].intAdjustmentNo) + 1;}
                  // Select sales no
                  db.query(`Select * from tblSales order by intSalesNo desc limit 1`,(err4,res4,fie4)=>{
                    if(err4) console.log(err4);
                    else{
                      if(res4.length==0){} else{sales_no = parseInt(res4[0].intSalesNo) +1;}
                      // Select inventory transaction no
                      db.query(`Select * from tblInventoryTransactions order by inttransactionID desc limit 1`,(err5,res5,fie5)=>{
                        if(err5) console.log(err5);
                        else{
                          if(res5.length==0){} else{transact_no = parseInt(res5[0].intTransactionID) + 1;}
                          // Insert to tblreturnOrder
                          db.query(`Insert into tblReturnOrder (intReturnOrderNo, intOrderNo) values ("${return_no}", "${req.body.order_no}")`,(err6,res6,fie6)=>{
                            if(err6) console.log(err6);
                            else{

                              async.eachSeries(loop,function(data,callback){

                                // Insert to tblReturnOrderList
                                db.query(`Insert into tblReturnOrderList (intReturnOrderListNo, intReturnOrderNo, intOrderDetailsNo, intOrderQuantity, intInventoryNo, intReplaceQuantity)
                                  values ("${list_no}", "${return_no}", "${req.body.inventory[count]}", ${req.body.orderQuantity[count]}, "${req.body.replacementProduct[count]}", ${req.body.replacementQuantity[count]})`,(err7,res7,fie7)=>{
                                  if(err7) console.log(err7);

                                  else{
                                    // Check stock from tblProductInventory
                                    db.query(`Select * from tblProductInventory where strBarcode = "${req.body.replacementProduct[count]}" and ((intQuantity - intReservedItems)  >= ${req.body.replacementQuantity[count]})`,(err8,res8,fie8)=>{
                                      if(err8) console.log(err8);
                                      else{
                                        if(res8.length==0){ db.rollback(function(){res.send("no");}) }
                                        else{
                                          // Deduct from tblProductInventory
                                          db.query(`Update tblProductInventory set intQuantity = intQuantity - ${req.body.replacementQuantity[count]} where intInventoryNo = ${res8[0].intInventoryNo}`,(err9,res9,fie9)=>{
                                            if(err9) console.log(err9);
                                            else{
                                              // Deduct from tblBatch
                                              db.query(`Select * from tblBatch where intInventoryNo = "${res8[0].intInventoryNo}" order by created_at `,(err10,batch,fie10)=>{
                                                if(err10) console.log(err10);
                                                else{
                                                  // FIFO deduct
                                                  var remaining = req.body.replacementQuantity[count];

                                                  for(a in batch){
                                                    if(remaining == 0){ break; }
                                                    else if(batch[a].intQuantity == remaining || batch[a].intQuantity < remaining){
                                                      let newValue = 0;
                                                      remaining -= batch[a].intQuantity;
                                                      db.query(`Update tblBatch set intQuantity = ${newValue} where intBatchNo = "${batch[a].intBatchNo}"`,(ee1,rr1,ff1)=>{
                                                        if(ee1) console.log(ee1);
                                                      })
                                                    }
                                                    else{
                                                      let newValue = batch[a].intQuantity - remaining;
                                                      remaining = 0;
                                                      db.query(`Update tblBatch set intQuantity = ${newValue} where intBatchNo = "${batch[a].intBatchNo}"`,(ee2,rr2,ff2)=>{
                                                        if(ee2) console.log(ee2);
                                                      })
                                                    }
                                                  } // end of batch FIFO

                                                  // insert to tblAdjustmentss
                                                  db.query(`Insert into tblAdjustments (intAdjustmentNo, intAdjustmentType, strAdjustmentNote, intAdminID, intQuantity, intInventoryNo) values("${adj_no}", "${adj_returned}", "Used for Replacement", "1000", ${req.body.replacementQuantity[count]}, "${res8[0].intInventoryNo}")`,(err11,res11,fie11)=>{
                                                    if(err11) console.log(err11);
                                                    else{
                                                      // insert into tblInventoryTransactions
                                                      db.query(`Insert into tblInventoryTransactions (intTransactionID, intInventoryNo, intShelfNo, intCriticalLimit, productSRP, productPrice, intUserID, strTypeOfChanges) values ("${transact_no}","${res8[0].intInventoryNo}",${res8[0].intShelfNo}, ${res8[0].intCriticalLimit}, ${res8[0].productSRP}, ${res8[0].productPrice},"1000","Used Product for Replacement")`,(err12,res12,fie12)=>{
                                                        if(err12) console.log(err12);
                                                        else{
                                                          // add to total deduct to sales
                                                          db.query(`Select tblOrderDetails.intInventoryNo from tblProductInventory join tblOrderDetails on tblProductInventory.intInventoryNo = tblOrderDetails.intInventoryNo
                                                            where tblOrderDetails.intOrderDetailsNo = "${req.body.inventory[count]}"`,(err15,res15,fie15)=>{
                                                            if(err15) console.log(err15);
                                                            db.query(`Select * from tblOrder join tblOrderDetails on tblOrder.intOrderNo = tblOrderDetails.intOrderNo
                                                              where tblOrderDetails.intOrderNo = "${req.body.order_no}" and tblOrderDetails.intInventoryNo = "${res15[0].intInventoryNo}"`,(err13,res13,fie13)=>{
                                                              if(err13) console.log(err13);
                                                              else{
                                                                total += res13[0].purchasePrice * res13[0].intQuantity;

                                                                count++;
                                                                list_no++;
                                                                adj_no++;
                                                                transact_no++;
                                                                callback();
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
                                      }
                                    })
                                  }
                                })

                              }, function(err,results){

                                // Insert into tblSales
                                db.query(`Insert into tblSales (intSalesNo, intOrderNo, amount, intStatus) values ("${sales_no}", "${req.body.order_no}", ${total}, 0)`,(err14,res14,fie14)=>{
                                  if(err14) console.log(err14);
                                  else{
                                    db.query(`Update tblReturnOrder set intStatus = 1 where intReturnOrderNo = ${return_no}`,(err01,res01,fie01)=>{
                                      if(err01) console.log(err01);
                                      else{
                                        db.commit(function(err){
                                          if(err){db.rollback(function(){console.log(err);})}
                                          else{
                                            res.send("yes");
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
    }
  })
})

router.post('/assessReturn',(req,res)=>{
  var loop = req.body.replacementProduct;
  var adj_no = "1000", transact_no = "1000", sales_no = "1000", count = 0;
  var returnlist = "";
  var total = 0;

  db.beginTransaction(function(err){
    if(err) console.log(err);
    else{
      db.query(`Select * from tblReturnOrderList where intReturnOrderNo = "${req.body.rno}"`,(err1,res1,fie1)=>{
        if(err1) console.log(err1);
        else{
          returnlist = res1;
          // Select adj_no
          db.query(`Select * from tblAdjustments order by intAdjustmentNo desc limit 1`,(err2,res2,fie2)=>{
            if(err2) console.log(err2);
            else{
              if(res2.length==0){} else{adj_no = parseInt(res2[0].intAdjustmentNo) + 1}

              // select inventory transact
              db.query(`Select * from tblInventoryTransactions order by inttransactionID desc limit 1`,(err3,res3,fie3)=>{
                if(err3) console.log(err3);
                else{
                  if(res3.length==0){} else{transact_no = parseInt(res3[0].intTransactionID) + 1}

                  // Select sales_no
                  db.query(`Select * from tblSales order by intSalesNo desc limit 1`,(err4,res4,fie4)=>{
                    if(err4) console.log(err4);

                    else{
                      if(res4.length==0){} else{sales_no = parseInt(res4[0].intSalesNo) + 1}
                      async.eachSeries(loop,function(data,callback){
                        // check stock from tblproductInventory
                        db.query(`Select * from tblProductInventory where strBarcode = "${req.body.replacementProduct[count]}" and intQuantity  >= ${req.body.replacementQuantity[count]}`,(err6,res6,fie6)=>{
                          if(err6) console.log(err6);
                          else{
                            if(res6.length==0){ db.rollback(function(){res.send("no");}) }
                            else{

                              // Deduct from tblProductInventory
                              db.query(`Update tblProductInventory set intQuantity = intQuantity - ${req.body.replacementQuantity[count]} where intInventoryNo = ${res6[0].intInventoryNo}`,(err7,res7,fie7)=>{
                                if(err7) console.log(err7);
                                else{

                                  // Deduct from tblBatch
                                  db.query(`Select * from tblBatch where intInventoryNo = "${res6[0].intInventoryNo}" order by created_at `,(err8,batch,fie8)=>{
                                    if(err8) console.log(err8);
                                    else{

                                      // FIFO deduct
                                      var remaining = req.body.replacementQuantity[count];

                                      for(a in batch){
                                        if(remaining == 0){ break; }
                                        else if(batch[a].intQuantity == remaining || batch[a].intQuantity < remaining){
                                          let newValue = 0;
                                          remaining -= batch[a].intQuantity;
                                          db.query(`Update tblBatch set intQuantity = ${newValue} where intBatchNo = "${batch[a].intBatchNo}"`,(ee1,rr1,ff1)=>{
                                            if(ee1) console.log(ee1);
                                          })
                                        }
                                        else{
                                          let newValue = batch[a].intQuantity - remaining;
                                          remaining = 0;
                                          db.query(`Update tblBatch set intQuantity = ${newValue} where intBatchNo = "${batch[a].intBatchNo}"`,(ee2,rr2,ff2)=>{
                                            if(ee2) console.log(ee2);
                                          })
                                        }
                                      } // end of batch FIFO

                                      // Insert to tblAdjustments
                                      db.query(`Insert into tblAdjustments (intAdjustmentNo, intAdjustmentType, strAdjustmentNote, intAdminID, intQuantity, intInventoryNo)
                                        values("${adj_no}", "${adj_returned}", "Used for Replacement", "1000", ${req.body.replacementQuantity[count]}, "${res6[0].intInventoryNo}")`,(err9,res9,fie9)=>{
                                        if(err9) console.log(err9);
                                        else{

                                          // insert into tblInventoryTransactions
                                          db.query(`Insert into tblInventoryTransactions (intTransactionID, intInventoryNo, intShelfNo, intCriticalLimit, productSRP, productPrice, intUserID, strTypeOfChanges)
                                            values ("${transact_no}","${res6[0].intInventoryNo}",${res6[0].intShelfNo}, ${res6[0].intCriticalLimit}, ${res6[0].productSRP}, ${res6[0].productPrice},"1000","Used Product for Replacement")`,(err10,res10,fie10)=>{
                                              if(err10) console.log(err10);
                                              else{

                                                // update tblReturnorderlist
                                                db.query(`Update tblReturnOrderList set intInventoryNo = "${req.body.replacementProduct[count]}", intReplaceQuantity = ${req.body.replacementQuantity[count]}
                                                  where intReturnOrderListNo = ${returnlist[count].intReturnOrderListNo}`,(err5,res5,fie5)=>{
                                                    if(err5) console.log(err5);
                                                    else{

                                                      // add to total deduct to sales
                                                      db.query(`Select * from tblProductInventory join tblOrderDetails on tblProductInventory.intInventoryNo = tblOrderDetails.intInventoryNo
                                                         where tblOrderDetails.intOrderDetailsNo = "${returnlist[0].intOrderDetailsNo}"`,(err15,res15,fie15)=>{
                                                        if(err15) console.log(err15);
                                                        else{

                                                          db.query(`Select * from tblOrder join tblOrderDetails on tblOrder.intOrderNo = tblOrderDetails.intOrderNo
                                                            where tblOrderDetails.intOrderNo = "${req.body.order_no}" and tblOrderDetails.intInventoryNo = "${res15[0].intInventoryNo}"`,(err11,res11,fie11)=>{
                                                              if(err11) console.log(err11);
                                                              else{
                                                                total += res11[0].purchasePrice * res11[0].intQuantity;
                                                                adj_no++;
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
                                    }
                                  })
                                }
                              });

                            }


                          }
                        })

                      }, function(erra,resultsa){
                        if(erra) console.log(erra);
                        else{

                          // Insert into tblSales
                          db.query(`Insert into tblSales (intSalesNo, intOrderNo, amount, intStatus) values ("${sales_no}", "${req.body.order_no}", ${total}, 0)`,(err12,res12,fie12)=>{
                            if(err12) console.log(err12);
                            else{
                              // change status of return order
                              db.query(`Update tblReturnOrder set intStatus = 1 where intReturnOrderNo = "${req.body.rno}"`,(err14,res14,fie14)=>{
                                if(err14) console.log(err14);
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

exports.returnOrder = router;
