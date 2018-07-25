var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
var async = require('async');

router.get('/', (req,res)=>{

  db.query(`Select tblPurchaseOrder.intStatus as Stat, tblPurchaseOrder.*, tblSupplier.* from tblPurchaseOrder join tblSupplier on tblpurchaseorder.intSupplierID = tblSupplier.intUserID `, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    res.render('admin-purchOrder/views/purchaseOrder', {re: results1, moment: moment});
  });


});

router.get('/form', (req,res)=>{

  db.query(`Select * from tblPurchaseOrder`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    // select all suppliers
    db.query(`Select * from tblSupplier join tbluser on tblsupplier.intuserid = tbluser.intuserid
      left join tblcontract on tbluser.intuserid = tblcontract.intconsignorid where tblsupplier.intStatus = 1`, (err2,results2,fields2)=>{
      if(err2) console.log(err2);

      // select all products
      db.query(`Select * from tblproductlist where intStatus = 1`, (err3,results3,fields3)=>{
        if (err3) console.log(err3);

        // select purchase order no
        db.query(`Select * from tblPurchaseOrder order by intPurchaseOrderNo desc limit 1`, (err4,results4,fields4)=>{
          if (err4) console.log(err4);

            res.render('admin-purchOrder/views/purchaseOrderForm',  {re: results1, su: results2, products: results3, moment: moment, POno: results4});


        });
      });
    });
  });

});

router.post('/submit',(req,res)=>{

    var ponum = "1000";
    var startProdListNo = 1000;
    var product = req.body.product; //[prod1,prod2,prod3]
    var quantity = req.body.quantity; // [quan1,quan2,quan3]
    var variant = req.body.variant;
    var size = req.body.size;
    var counter = 0;

    db.beginTransaction(function(err){
      if(err){
        console.log(err);
      }else{
        // Select last purchase order no
        db.query(`Select * from tblPurchaseOrder order by intPurchaseOrderNo desc limit 1`,(err1,results1,fields1)=>{
          if (err1){
            db.rollback(function(){
              console.log(err1);
            })
          }else{
            if(results1 == undefined || results1 == null){

            }else if(results1.length == 0){

            }else{
              ponum = parseInt(results1[0].intPurchaseOrderNo) + 1;
            }
            // Insert into purchase order
            db.query(`Insert into tblPurchaseOrder (intPurchaseOrderNo, intSupplierID, intAdminID, strSpecialNote) values ("${ponum}","${req.body.supplier}", "1000", "${req.body.specialnote}")`,(err2,results2,fields2)=>{
              if(err2){
                db.rollback(function(){
                  console.log(err2);
                })
              }else{
                // Get the last po list number
                db.query(`Select * from tblPurchaseOrderList order by intPOrderlistno desc limit 1`,(err3,results3,fields3)=>{
                  if (err3){
                    db.rollback(function(){
                      console.log(err3);
                    })
                  }else{
                    if(results3 == undefined || results3 == null){

                    }else if(results3.length == 0){

                    }else{
                      startProdListNo = parseInt(results3[0].intPOrderListNo) +1;
                    }

                    // insert each to purchase order List
                    async.eachSeries(product,function (data,callback){
                      db.query(`Insert into tblPurchaseOrderList (intPOrderListNo, intPurchaseOrderNo,
                        strProduct, intQuantity, strVariant, strSize) values ("${startProdListNo}", "${ponum}", "${product[counter]}", "${quantity[counter]}", "${variant[counter]}", "${size[counter]}")`, (err4,results4,fields4)=>{
                         if (err4){
                           db.rollback(function(){
                             console.log(err4);
                           })
                         }else{

                           startProdListNo++;
                           counter++;
                           callback();
                         }
                      });
                    }, function(err, results){
                      db.commit(function(erra){
                        if (erra){
                          db.rollback(function(){
                            console.log(erra);
                          });
                        }else{
                          res.send("yes");
                        }
                      })
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

router.post('/test',(req,res)=>{
  var product = req.body.product; //[prod1,prod2,prod3]
  var quantity = req.body.quantity; // [quan1,quan2,quan3]
  var counter = 0;
  var startProdListNo = 1000;

  db.query(`Select * from tblPurchaseOrderList order by intPOrderlistno desc limit 1`,(e1,r1,f1)=>{
    if (e1) console.log(e1);
    if (r1 == undefined || r1 == null){

    }else if(r1.length == 0){

    }else{
      startProdListNo = parseInt(r1[0].intPOrderListNo) + 1;
    }

    async.eachSeries(product,function(data,c){
      db.query(`Insert into tblPurchaseOrderList (intPOrderListNo, intPurchaseOrderNo, strProduct, intQuantity) values ("${startProdListNo}", "1000", "${product[counter]}", "${quantity[counter]}")`, (err3,results3,fields3)=>{
         if (err3) console.log(err3);
         console.log(results3)
         counter++;
         startProdListNo++;
         c();
    });

    }, function(err, results){
      if (err){
        res.send(err);
      }else{
        res.send("yes");
      }


    });


  });


});


router.post('/submitForm',(req,res)=>{

  console.log(`Entering 1`);

  // query the last list no
  db.query(`Select * from tblPurchaseOrderList order by intPOrderlistno desc limit 1`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);

    var product = req.body.product; //[prod1,prod2,prod3]
    var quantity = req.body.quantity; // [quan1,quan2,quan3]
    var counter = 0;
    var startProdListNo = 1000;

    console.log(`entering 2`);

    // insert to purchase Order table
    db.query(`Insert into tblPurchaseOrder (intPurchaseOrderNo, intSupplierID, intAdminID, strSpecialNote) values ("${req.body.POnum}","${req.body.supplier}", "1000", "${req.body.specialnote}")`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);
    });

    // get the PO List no
    if (results1 == null || results1 == undefined || results1.length == 0 ){
      startProdListNo = 1000;
    }else{
      startProdListNo = parseInt(results1[0].intPOrderlistno) + 1;
    }

    console.log(`Entering 3`);

    // insert each purchase order list in db
      async.eachSeries(product,function(data,callback){
        db.query(`Insert into tblPurchaseOrderList (intPOrderlistno, intPurchaseOrderNo,      strProduct, intQuantity) values ("${startProdListNo}", "${req.body.POnum}", "${product[counter]}", "${quantity[counter]}")`, (err3,results3,fields3)=>{
           if (err3) console.log(err3);

           counter++;
           startProdListNo++;
           callback();
      });

      }, function(err, results){
        console.log("Puchase order done!");
        res.send("yes");
      });

  });
});

router.post('/addSupplier', (req,res)=>{

  var id = 0;
  db.query(`Select * from tblUser Order by intUserID desc limit 1`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    if(results1.length == 0 || results1 == 'null' || results1 == 'undefined'){
      id = 1000;
    }else{
      id = parseInt(results1[0].intUserID) + 1;
    }

    // replace with transactions
    db.query(`Insert into tblUser (intUserID,intUserTypeNo,strFname,strMname,strLname) values ("${id}","2","${req.body.fname}","${req.body.mname}","${req.body.lname}")`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);

      db.query(`Insert into tblSupplier (intUserID,strBusinessName,strBusinessAddress,strSupplierPhone,strSupplierMobile) values ("${id}","${req.body.bname}","${req.body.address}","${req.body.phone}","${req.body.mobile}")`,(err3,results3,fields3)=>{
        if (err3) console.log(err3);

        db.query(`Select * from tblPurchaseOrder`, (err,results,fields)=>{
          if (err) console.log(err);
          db.query(`Select * from tblSupplier join tblUser on tblSupplier.intUserID = tblUser.intUserID where intStatus = 1`, (erra,resultsa,fieldsa)=>{
            if(err) console.log(err);
            res.render('admin-purchOrder/views/purchaseOrderForm',  {re: results, su: resultsa});
          });
        });

      });
    });

  });


});

router.get('/findProducts/:pid',(req,res)=>{

  db.query(`Select * from tblproductownership where intUserID = "${req.params.pid}" and intstatus = 1`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    if (!err1) res.render('admin-purchOrder/views/productLoader', {re: results1});
  });
});

router.get('/invoice',(req,res)=>{
  var orderno = req.query.order;

  db.query(`Select * from tblPurchaseOrder join tblUser on tblPurchaseOrder.intSupplierID = tblUser.intUserID
    join tblSupplier on tblUser.intUserID = tblSupplier.intUserID
    where intPurchaseOrderNo = "${orderno}"`,(err1,results1,fields1)=>{
      if (err1) console.log(err1);

      db.query(`Select * from tblPurchaseOrderList where intPurchaseOrderNo = ${orderno}`,(err2,results2,fields2)=>{
        if (err2) console.log(err2);

        res.render('admin-purchOrder/views/invoice', {order: orderno, orderdetails: results1, orderlist: results2, moment: moment});
      });
    });
});

router.get('/invoice-print',(req,res)=>{
  var orderno = req.query.order;

  db.query(`Select * from tblPurchaseOrder join tblUser on tblPurchaseOrder.intSupplierID = tblUser.intUserID
    join tblSupplier on tblUser.intUserID = tblSupplier.intUserID
    where intPurchaseOrderNo = "${orderno}"`,(err1,results1,fields1)=>{
      if (err1) console.log(err1);

      db.query(`Select * from tblPurchaseOrderList where intPurchaseOrderNo = ${orderno}`,(err2,results2,fields2)=>{
        if (err2) console.log(err2);

        res.render('admin-purchOrder/views/invoice-print', {order: orderno, orderdetails: results1, orderlist: results2, moment: moment});
      });
    });
})
// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.purchaseOrder = router;
