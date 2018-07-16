var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');


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
  db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.* from tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
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
      console.log(results1);

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

              res.render('admin-custOrder/views/assessOrder', {orderlist: results1, customer: results2, moment: moment, total: results3[0].totalAll, payment: this_total});

            });


      });


    });

  });
});

router.post('/assessOrder',(req,res)=>{

  db.beginTransaction(function(err){
    if(err){
      console.log(err);
    }else{
      // Update order status
      db.query(`Update tblOrder set intStatus = ${req.body.orderStatus}, strShippingMethod =
        "${req.body.shippingMethod}", strCourier = "${req.body.courier}", intPaymentStatus = ${req.body.paymentStatus} where intOrderNo = "${req.body.orderNo}" `, (err1,results1,fields1)=>{
          if(err1){
            db.rollback(function(){
              console.log(err1);
            })
          }else{
            var historynum = 1000;
            var messagenum = 1000;
            // Select last orderhistory no
            db.query(`Select * from tblOrderHistory order by intOrderHistoryNo desc limit 1`,
              (err2,results2,fields2)=>{
                if(err2){
                  db.rollback(function(){
                    console.log(err2);
                  });
                }else{
                  if (results2 == null || results2 == undefined){

                  }else if(results2.length == 0){

                  }else{
                    historynum = parseInt(results2[0].intOrderHistoryNo) + 1;
                  }
                  // Select last message no
                  db.query(`Select * from tblMessages order by intMessageNo desc limit 1`,
                    (err3,results3, fields3)=>{
                      if(err3){
                        db.rollback(function(){
                          console.log(err3);
                        })
                      }else{
                        if (req.body.notify == 1){
                          // insert to message
                          db.query(`Insert into tblMessages (intMessageNo, intOrderHistoryNo, strMessage,
                            intAdminID) values ("${messagenum}", "${historynum}","${req.body.message}", "1000" )`,(err4,results4,fields4)=>{
                            if (err4){
                              db.rollback(function(){
                                console.log(err4)
                              })
                            }
                          });
                        }
                        // Insert into order history
                        db.query(`Insert into tblOrderHistory (intOrderHistoryNo, intOrderNo,
                          strShippingMethod, strCourier, intStatus, intAdminID, intMessageNo) values ("${historynum}", "${req.body.orderNo}", "${req.body.shippingMethod}","${req.body.courier}", ${req.body.orderStatus}, "1000", "${messagenum}")`, (err5,results5,fields5)=>{
                            if(err5){
                              db.rollback(function(){
                                console.log(err5);
                              })
                            }else{
                              var salesno = "";
                              if(req.body.paymentStatus == 1 || req.body.paymentStatus == 2){

                                // select last sales record
                                salesno = "1000";
                                db.query(`Select * from tblSales order by intSalesNo desc limit
                                  1`,(err6,results6,fields6)=>{
                                  if (err6){
                                    db.rollback(function(){
                                      console.log(err6);
                                    })
                                  }else{
                                    console.log(results6[0]);
                                    if(results6 == null || results6 == undefined){

                                    }else if(results6.length == 0){

                                    }else{
                                      salesno = parseInt(results6[0].intSalesNo) +1;
                                    }

                                    // Insert to sales
                                    db.query(`Insert into tblSales (intSalesNo, intOrderNo, amount, intStatus)
                                      values("${salesno}","${req.body.orderNo}",${req.body.total}, 1)`,(err7,results7,fields7)=>{
                                      if(err7){
                                        db.rollback(function(){
                                          console.log(err7);
                                          res.send("no");
                                        })
                                      }else{
                                        db.commit(function(e1){
                                          if(e1){
                                            db.rollback(function(){
                                              console.log(e1);
                                            })
                                          }else{
                                            res.send("yes");
                                          }
                                        });
                                      }
                                    });

                                  }
                                });


                              }else if(req.body.paymentStatus == 4){

                                // select last sales record
                                salesno = "1000";
                                db.query(`Select * from tblSales order by intSalesNo desc limit 1`,(err6,results6,fields6)=>{
                                  if (err6){
                                    db.rollback(function(){
                                      console.log(err6);
                                    })
                                  }else{
                                    console.log(results6[0]);
                                    if(results6 == null || results6 == undefined){

                                    }else if(results6.length == 0){

                                    }else{
                                      salesno = parseInt(results6[0].intSalesNo) +1;
                                    }

                                    // Insert to sales
                                    db.query(`Insert into tblSales (intSalesNo, intOrderNo, amount, intStatus)
                                      values("${salesno}","${req.body.orderNo}",${req.body.total},0)`,(err8,results8,fields8)=>{
                                      if(err8){
                                        db.rollback(function(){
                                          console.log(err8);
                                        })
                                      }else{
                                        db.commit(function(e1){
                                          if(e1){
                                            db.rollback(function(){
                                              console.log(e1);
                                            })
                                          }else{
                                            res.send("yes");
                                          }
                                        })
                                      }
                                    });

                                  }
                                });


                              }else{

                                db.commit(function(e1){
                                  if(e1){
                                    db.rollback(function(){
                                      console.log(e1);
                                    })
                                  }else{
                                    res.send("yes");
                                  }
                                })
                              }
                            }
                        })
                      }
                  });
                }
            });
          }
      });
    }
  })

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
