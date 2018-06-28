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

router.post('/submitForm',(req,res)=>{

  var ponum = "1000";
  var startProdListNo = 1000;
  var product = req.body.product; //[prod1,prod2,prod3]
  var quantity = req.body.quantity; // [quan1,quan2,quan3]
  var counter = 0;

  db.beginTransaction(function(err){
    if(err){
      console.log(err);
    }else{
      console.log('entering 1');
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
          console.log('entering 2')
          // Insert into purchase order
          db.query(`Insert into tblPurchaseOrder (intPurchaseOrderNo, intSupplierID, intAdminID, strSpecialNote) values ("${ponum}","${req.body.supplier}", "1000", "${req.body.specialnote}")`,(err2,results2,fields2)=>{
            if(err2){
              db.rollback(function(){
                console.log(err2);
              })
            }else{
              console.log('entering 3')
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
                    startProdListNo = parseInt(results3[0].intPOrderlistno) +1;
                  }

                  console.log('entering 4')
                  // insert each to purchase order List
                  async.eachSeries(product,function(data,callback){
                    db.query(`Insert into tblPurchaseOrderList (intPOrderlistno, intPurchaseOrderNo,
                      strProduct, intQuantity) values ("${startProdListNo}", "${req.body.POnum}", "${product[counter]}", "${quantity[counter]}")`, (err4,results4,fields4)=>{
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
                    res.send("yes");
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

router.post('/findProducts',(req,res)=>{

  db.query(`Select * from tblproductownership where intUserID = ${req.body.o} and intstatus = 1`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    if (results1 == null || results1 == undefined || results1.length ==0 ){
      res.send("some");
    }else{
      res.send(results1[0].strProduct);
    }
  });
});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.purchaseOrder = router;
