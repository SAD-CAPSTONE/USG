var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
var async = require('async');
const nodemailer = require('nodemailer');

const user_name = 'test.ultrasupergreen@gmail.com';
const email_to = 'imjanellealag@gmail.com';
const passw = 'testusg123';
const userTypeAuth = require('../cust-0extras/userTypeAuth');
const auth_admin = userTypeAuth.admin;

var header = '';
var body = '';
var count = 0;

router.get('/email',auth_admin, (req,res)=>{
  let transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
   auth: {
     user: user_name,
     pass: passw
   }
  });
  var html = "";


  var orderno = req.query.order;

  db.query(`Select * from tblPurchaseOrder join tblUser on tblPurchaseOrder.intSupplierID = tblUser.intUserID
    join tblSupplier on tblUser.intUserID = tblSupplier.intUserID
    where intPurchaseOrderNo = "${orderno}"`,(err1,results1,fields1)=>{
      if (err1) console.log(err1);

      db.query(`Select * from tblPurchaseOrderList where intPurchaseOrderNo = ${orderno}`,(err2,results2,fields2)=>{
        if (err2) console.log(err2);
        else{
          console.log(results2)
          for(count = 0; count < results2.length; count++){
            body = `${count+1}. ` + `${results2[count].strProduct}` + ' ' + `${results2[count].strVariant}` + '<br>'
          }
          console.log(body);
          html = buildHtml();
          mailOptions = {
              from    : user_name, // sender address
              to      : email_to, // list of receivers
              subject : 'USG ', // Subject line
              text    : '', // plaintext body
              html    : html, // html body

          };

          exec();
        }
      });
    });


  function buildHtml() {

            return '<!DOCTYPE html>'
                 + '<html>'
                 +'<head>' + header + '</head>'
                 +'<body>'
                 + '<h3>From: </h3> &nbsp;'
                 + 'Gustle Agulto' + '<br>'
                 + '<br>'

                 + '<h3>To: </h3> &nbsp;'
                 + 'Your company' + '<br>'
                 + '<br>'
                 + '<br>'

                 + '<p>Good day! We would like to request an order to your shop.</p>'
                 + '<p>Here is the list</p>'
                 + '<br>'
                 + '<strong> Order List </strong> <br>'
                 + body
                 + '</body>'
                 + '</html>';


    // concatenate header string
    // concatenate body string


  };
  let mailOptions = ""

  function exec(){
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send("error");
        }else{
          res.send("yes")

        }


      });
  }



})


router.get('/', auth_admin, (req,res)=>{

  db.query(`Select tblPurchaseOrder.intStatus as Stat, tblPurchaseOrder.*, tblSupplier.* from tblPurchaseOrder join tblSupplier on tblpurchaseorder.intSupplierID = tblSupplier.intUserID `, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    res.render('admin-purchOrder/views/purchaseOrder', {re: results1, moment: moment});
  });


});

router.get('/form', auth_admin, (req,res)=>{

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

router.post('/submit',auth_admin, (req,res)=>{

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
            db.query(`Insert into tblPurchaseOrder (intPurchaseOrderNo, intSupplierID, intAdminID, strSpecialNote) 
              values ("${ponum}","${req.body.supplier}", "${req.user.intUserID}", "${req.body.specialnote}")`,(err2,results2,fields2)=>{
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
                          res.send(`${ponum}`);
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


router.post('/addSupplier', auth_admin, (req,res)=>{

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

router.get('/findProducts/:pid',auth_admin, (req,res)=>{

  db.query(`Select * from tblProductList join tblProductInventory on tblProductList.intProductNo = tblProductInventory.intProductNo where tblProductInventory.intUserID = "${req.params.pid}" and tblProductList.intstatus = 1`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    if (!err1) res.render('admin-purchOrder/views/productLoader', {re: results1});
  });
});

router.get('/invoice',auth_admin, (req,res)=>{
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

router.get('/invoice-print',auth_admin, (req,res)=>{
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
});


// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.purchaseOrder = router;
