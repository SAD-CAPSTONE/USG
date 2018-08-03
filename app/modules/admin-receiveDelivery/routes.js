var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
var async = require('async');

router.get('/', (req,res)=>{
  db.query(`Select * from tblreceiveorder join tblpurchaseOrder on tblreceiveorder.intpurchaseorderno = tblpurchaseorder.intpurchaseorderno join tblSupplier on tblPurchaseOrder.intSupplierID = tblSupplier.intUserID`, (err1,results1,fields1)=>{
  if (err1) console.log(err1);
  res.render('admin-receiveDelivery/views/receiveDelivery', {re: results1, moment: moment});

});
});

router.get('/form', (req,res)=>{

  // select last record of deliveries
  db.query(`Select * from tblreceiveOrder order by intreceiveorderno desc limit 1`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    // select from purchase order lists
    db.query(`Select * from tblPurchaseOrder join tblSupplier on tblPurchaseOrder.intSupplierID = tblSupplier.intUserID where tblPurchaseOrder.intStatus = 0`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);
      res.render('admin-receiveDelivery/views/receiveDeliveryForm', {re:results1,pu:results2, moment: moment});
    });
  });
});

var purch_no = "";
router.post('/findNo', (req,res)=>{


  if (req.body.o == null || req.body.o == " " || req.body.o == undefined || req.body.o == ""){
    purch_no = 0;
  }else{
    purch_no = req.body.o;
  }

  db.query(`Select * from tblPurchaseOrder where tblPurchaseOrder.intPurchaseOrderNo = "${purch_no}" and intStatus = 0`, (err1,results1,fields1)=>{
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

router.get('/loadOrderList',(req,res)=>{
  db.query(`Select * from tblPurchaseOrder join tblPurchaseOrderList on tblPurchaseOrder.intPurchaseOrderNo = tblPurchaseOrderList.intPurchaseOrderNo where tblPurchaseOrder.intPurchaseOrderNo = "${purch_no}" and intStatus = 0`,(err1,results1,fields1)=>{
    if(err1) console.log(err1);
    if (!err1) res.render('admin-receiveDelivery/views/productLoader', {re: results1});

  });
});

router.get('/deliveryDetails',(req,res)=>{
  db.query(`Select * from tblReceiveOrder join tblReceiveOrderlist on tblReceiveOrder.intReceiveOrderNo = tblReceiveOrderlist.intReceiveOrderNo where tblReceiveOrderlist.intReceiveOrderNo = "${req.query.delivery}" and tblReceiveOrderlist.intOrderStatus = "Good"`,(err1,good,fields1)=>{
    if(err1) console.log(err1);

    db.query(`Select * from tblReceiveOrder join tblReceiveOrderlist on tblReceiveOrder.intReceiveOrderNo = tblReceiveOrderlist.intReceiveOrderNo where tblReceiveOrderlist.intReceiveOrderNo = "${req.query.delivery}" and tblReceiveOrderlist.intOrderStatus = "Bad"`,(err2,bad,fields2)=>{
      if(err2) console.log(err2);
      if (!err2) res.render('admin-receiveDelivery/views/deliveryDetails',{re_good: good, re_bad: bad, delivery_no: req.query.delivery, moment:moment});
    });

  });
});

router.post('/newDeliveryRecord', (req,res)=>{

  var counter = 0;
  var startNo = "";
  var loop = req.body.product;

  db.beginTransaction(function(err){
    if(err){
      db.rollback(function(){
        console.log(err);
      })
    }else{
      db.query(`Insert into tblreceiveOrder (intReceiveOrderNo, intPurchaseOrderNo, intAdminID,   specialNotes) values ("${req.body.rno}", "${req.body.POno}", "1000", "${req.body.note}")`,(err1,results1,fields1)=>{
        if (err1){
          db.rollback(function(){
            console.log(err1);
          })
        }else{
          db.query(`Select * from tblReceiveOrderlist order by intOrderReceivedNo desc limit 1`,(err2,results2,fields2)=>{
            if(err2){
              db.rollback(function(){
                console.log(err2);
              })
            }else{
              if (results2 == null || results2 == undefined){

              }else if(results2.length == 0){

              }else{
                startNo = parseInt(results2[0].intOrderReceivedNo) +1;
              }

              db.query(`Update tblPurchaseOrder set intStatus = 1 where intPurchaseOrderNo = "${req.body.POno}"`,(e2,r2,f2)=>{
                if(e2){
                  db.rollback(function(){
                    console.log(e2);
                  })
                }else{
                  async.eachSeries(loop,function(data,callback){

                    var exdate = moment(req.body.expiration[counter]).format("YYYY-MM-DD");
                    console.log(exdate);
                    var d = "2001-02-31";
                    db.query(`INSERT INTO tblreceiveorderlist (intOrderReceivedNo, intReceiveOrderNo, strProduct, strSize, strConsignmentPrice, intQuantity, SRP, dateExpiration, intOrderStatus, strVariant) VALUES ("${startNo}", "${req.body.rno}", "${req.body.product[counter]}", "${req.body.size[counter]}", "", "${req.body.quantity[counter]}", "${req.body.srp[counter]}", "${exdate}", "${req.body.status[counter]}", "${req.body.variant[counter]}")`, (err3,results3,fields3)=>{
                      if (err3){
                        db.rollback(function(){
                          console.log(err3);
                        })
                      }else{
                        counter++;
                        startNo++;
                        callback();
                      }

                    });
                  }, function(e,results){
                    if (e){
                      db.rollback(function(){
                        console.log(e);
                      })
                    }else{
                      db.commit(function(e1){
                        if(e1){
                          db.rollback(function(){
                            console.log(e1);
                          })
                        }else{
                          res.send("yes");
                          console.log("Receive Delivery Done!");
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

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.receiveDelivery = router;
