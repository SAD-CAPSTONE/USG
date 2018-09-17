var router = require('express').Router();
var db = require('../../lib/database')();
var fileUpload = require('express-fileUpload');
var path = require('path');
var moment = require('moment');
var async = require('async');
var url = require('url');
var fs = require('fs');



router.get('/allProducts', (req,res)=>{

  db.query(`Select tblproductlist.intstatus as stats, tblproductlist.*, tblproductbrand.*,tblsubcategory.*, tblcategory.* from tblproductlist join tblproductbrand on tblproductlist.intBrandNo = tblproductbrand.intBrandNo
  join tblSubCategory on tblproductlist.intSubcategoryno = tblsubcategory.intsubcategoryno
  join tblcategory on tblsubcategory.intcategoryno = tblcategory.intcategoryno `, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    db.query(`Select * from tblProductBrand where intStatus = 1`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);
      db.query(`Select * from tblSubCategory`, (err3,results3,fields3)=>{
        if (err3) console.log(err3);
        db.query(`Select * from tblProductList Order by intProductno desc limit 1`, (err4, results4, fields4)=>{
          if (err4) console.log(err4);
          res.render('admin-inventory/views/allProducts', {re:results1, brand:results2, category:results3, list:results4});

        });

      });

    });
  });
});

router.post('/addProduct', (req,res)=>{

  db.query(`Select * from tblProductList Order by intProductno desc limit 1`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);

    // generate ID
    var lastnum = "1000";
    if (results1 == null || results1 == undefined){

    }else if(results1.length == 0){

    }else{
      lastnum = parseInt(results1[0].intProductNo) + 1;
    }

    // Insert new product

    if (!req.files){
        db.query(`Insert into tblProductList (intProductNo, intSubCategoryNo, intBrandNo, strProductCode, strProductName, strDescription, strProductPicture) values ("${lastnum}", ${req.body.add_pcat}, ${req.body.add_brand}, "${req.body.add_pcode}", "${req.body.add_pname}", "${req.body.add_pdesc}", "" )`, (err1,results1,fields1)=>{
          if (err1) console.log(err1);
          res.send('not successful');
        });
    }else{

      let sample = req.files.add_pic;

      db.query(`Insert into tblProductList (intProductNo, intSubCategoryNo, intBrandNo, strProductCode, strProductName, strDescription, strProductPicture) values ("${lastnum}", ${req.body.add_pcat}, ${req.body.add_brand}, "${req.body.add_pcode}", "${req.body.add_pname}", "${req.body.add_pdesc}", "${lastnum}.jpg")`, (err2,results2,fields2)=>{
        if (err2) console.log(err2);
        var link = path.join(path.dirname(path.dirname(path.dirname(__dirname))), 'public/assets/images/products/'+lastnum+'.jpg');
        sample.mv(link, function(err){
          if (err) console.log(err);
          res.redirect(`/inventory/productInventory?product=${lastnum}`);

        });

      });

    }
  });

});

router.post('/editProduct',(req,res)=>{

  var checked = 0;
  if (req.body.active == 'on') checked = 1;

  var linky = path.join(path.dirname(path.dirname(path.dirname(__dirname))), 'public/images/products/'+req.body.view_prodno+'.jpg');
  console.log(linky);

  fs.unlink(linky,function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
   });


  if (!req.files){
      db.query(`Update tblProductList set intSubCategoryNo = "${req.body.view_pcat}", intBrandNo = "${req.body.view_brand}", strProductCode="${req.body.view_pcode}", strProductName = "${req.body.view_pname}", strDescription="${req.body.view_pdesc}", strProductPicture = "", intStatus = ${checked} where intProductNo = "${req.body.view_prodno}"`,(err1,results1,fields1)=>{
        if (err1) console.log(err1);
        res.redirect('/inventory/allProducts');

      });

  }else{

    let sample = req.files.view_pic;
    var filename = req.body.view_prodno;

    db.query(`Update tblProductList set intSubCategoryNo = "${req.body.view_pcat}", intBrandNo = "${req.body.view_brand}", strProductCode="${req.body.view_pcode}", strProductName = "${req.body.view_pname}", strDescription="${req.body.view_pdesc}", strProductPicture = "${filename}.jpg", intStatus = ${checked} where intProductNo = "${req.body.view_prodno}"`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);
      var link = path.join(path.dirname(path.dirname(path.dirname(__dirname))), 'public/assets/images/products/'+filename+'.jpg');
      sample.mv(link, function(err){
        if (err) console.log(err);
        res.redirect('/inventory/allProducts');

      });
    });
  }
});


router.get('/supplierProducts', (req,res)=>{
  db.query(`
    SELECT * from tblproductinventory join tblproductlist on tblproductinventory.intProductNo = tblproductlist.intproductno
    join tblsupplier on tblsupplier.intUserID = tblproductinventory.intUserID`,(err1,results1)=>{
    if (err1) console.log(err1);
    res.render('admin-inventory/views/supplierProducts', {re: results1});
  });
});

router.get('/productInventory', (req,res)=>{

  var product = req.query.product;
  db.query(`
    Select * from tblproductinventory join tblproductlist on tblproductinventory.intProductno = tblproductlist.intproductno
    join tblproductbrand on tblproductlist.intbrandno = tblproductbrand.intbrandno
    join tbluser on tbluser.intuserid = tblproductinventory.intuserid
    join tblsupplier on tblsupplier.intuserid = tblproductinventory.intuserid
    join tbluom on tbluom.intuomno = tblproductinventory.intuomno
    where tblproductinventory.intProductNo = ${product}`, (err1,results1,fields1)=>{
    //console.log(results1[0].tblProductInventory.intStatus);
    if (err1) console.log(err1);

    db.query(`Select * from tblProductInventory order by intInventoryno desc limit 1`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);

      db.query(`Select * from tbluom`, (err3,results3,fields3)=>{
        if (err3) console.log(err3);

        db.query(`Select * from tblSupplier join tblUser on tblSupplier.intUserID = tblUser.intUserID where intStatus = 1`, (err4,results4,fields4)=>{
          if (err4) console.log(err4);

          db.query(`Select * from tblproductlist where intProductNo = ${product}`, (err5,results5,fields5)=>{
            if (err5) console.log(err5);

            db.query(`Select * from tblbatch order by intBatchNo desc limit 1`,(err6,results6,fields6)=>{
              if (err6) console.log(err6);

              res.render('admin-inventory/views/productInventory', {re: results1, moment: moment, list: results2, uom: results3, su: results4, product: product, title: results5, lastbatch: results6});

            });


          });


        });

      });

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



      });
    });

  });


});

router.post('/addProductItem', (req,res)=>{
  // Change to transaction
  var url = `/inventory/productInventory?product=${req.body.add_productno}`;
  db.query(`
    Insert into tblProductInventory (intInventoryNo, intProductNo, intUserID, productSRP, intUOMno, intSize, productPrice, strBarcode, intCriticalLimit, strVariant, intShelfNo) values ("${req.body.add_inventoryno}","${req.body.add_productno}", "${req.body.add_sno}", ${req.body.add_srp}, "${req.body.add_uom}", ${req.body.add_size}, ${req.body.add_price}, "${req.body.add_barcode}", ${req.body.add_critical}, "${req.body.add_variant}", ${req.body.add_shelf})`, (err1,results1,fields1)=>{
      if (err1) console.log(err1);
      db.query(`Select * from tblinventorytransactions order by intTransactionID desc limit 1`, (err2,results2,fields2)=>{
        if (err2) console.log(err2);


        if (results2 == null || results2 == undefined || results2.length == 0){
           db.query(`Insert into tblinventorytransactions (intTransactionID,intInventoryNo, intBatchNo, intShelfNo, intCriticalLimit,  strTypeOfChanges, intUserID ) values ("1000","${req.body.add_inventoryno}",${req.body.add_batch},${req.body.add_shelf},${req.body.add_critical},"New Product Item","1000")`, (err3,results3,fields3)=>{
             if (err3) console.log(err3);

             res.send(url);
           });

        }else{
          var ino = parseInt(results2[0].intTransactionID) + 1;
          db.query(`Insert into tblinventorytransactions (intTransactionID,intInventoryNo, intBatchNo, intShelfNo, intCriticalLimit,  strTypeOfChanges, intUserID ) values ("${ino}","${req.body.add_inventoryno}",${req.body.add_batch},${req.body.add_shelf},${req.body.add_critical},"New Product Item","1000")`, (err4,results4,fields4)=>{
            if (err4) console.log(err4);
            res.send(url);


          });
        }


    });
  });

});

router.get('/transactions', (req,res)=>{
  var product = req.query.product;
  var ino = req.query.ino;

  db.query(`Select * from tblinventorytransactions join tbluser on tblinventorytransactions.intuserID = tbluser.intUserID where intinventoryno = ${ino} order by transactionDate desc`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    db.query(`Select * from tblproductlist where intProductNo = ${product}`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);
      res.render('admin-inventory/views/inventoryTransaction', {re: results1, moment: moment, title: results2});
    });

  });
});

router.get('/allStocks', (req,res)=>{

  // Query inventory
  db.query(`
    Select sum(tblproductinventory.intquantity) as quantity,  tblproductlist.*, tblproductinventory.*, tblproductbrand.* from  tblProductInventory join tblProductList on tblProductList.intProductNo = tblProductInventory.intProductNo join tblProductBrand on tblProductlist.intBrandNo = tblProductBrand.intBrandNo where tblProductList.intStatus = 1 group by tblproductlist.intproductno`, (err1,results1,fields1)=>{
      if (err1) console.log(err1);

      // Query suppliers
      db.query(`Select * from tbluser join tblsupplier on tbluser.intuserid = tblsupplier.intuserid where intstatus = 1`, (err2,results2,fields2)=>{
        if (err2) console.log(err2);

        // Query products inside inventory
        db.query(`Select * from tblProductlist join tblproductinventory on tblproductlist.intproductno = tblproductinventory.intproductno join tblproductbrand on tblproductlist.intbrandno = tblproductbrand.intbrandno join tbluom on tblproductinventory.intuomno = tbluom.intuomno`, (err3,results3,fields3)=>{
          if (err3) console.log(err3);

          // Query uom
          db.query(`Select * from tbluom where intstatus = 1`, (err4,results4,fields4)=>{
            if (err4) console.log(err4);

            // // Query productstock last record
            // db.query(`Select * from tblproductstock order by intproductquantityno desc limit 1`, (err5,results5,fields5)=>{
            //   if (err5) console.log(err5); tbl_q = results5

              // query product inventory last record
              db.query(`Select * from tblproductinventory order by intinventoryno desc limit 1`, (err6,results6,fields6)=>{
                if (err6) console.log(err6);

                // query inventory transaction last record
                db.query(`Select * from tblinventorytransactions order by inttransactionid desc limit 1`, (err7,results7,fields7)=>{
                  if (err7) console.log(err7);

                  // query last batch no
                  db.query(`Select * from tblbatch order by intbatchno desc limit 1`,(err8,results8, fields8)=>{
                    if (err8) console.log(err8);

                    // query expired
                    db.query(`Select * from tblbatch
                      join tblproductinventory on tblbatch.intinventoryno = tblproductinventory.intinventoryno
                      join tblproductlist on tblproductlist.intproductno = tblproductinventory.intproductno
                      join tblProductBrand on tblproductlist.intbrandno = tblproductbrand.intBrandNo
                      join tblSupplier on tblProductInventory.intuserID = tblSupplier.intUserID
                      where ((tblbatch.expirationDate between NOW() and DATE_ADD(NOW(), INTERVAL 14 DAY)) or tblBatch.expirationDate <= CURDATE()) and tblbatch.intStatus = 1`,(err9,res9,fie9)=>{
                        if(err9) console.log(err9);

                        // query critical
                        db.query(`Select * from tblProductinventory
                          join tblproductlist on tblproductinventory.intproductno = tblproductlist.intproductno
                          join tbluom on tblproductinventory.intuomno = tbluom.intuomno
                          join tblSupplier on tblproductinventory.intuserid = tblsupplier.intuserid where intQuantity < intCriticalLimit or intQuantity = intCriticalLimit`,(err10,res10,fie10)=>{
                          if(err10) console.log(err10);
                          else{
                            res.render('admin-inventory/views/stock', {re: results1,  tbl_i: results6, products: results3, uom: results4, suppliers: results2, transact: results7, lastbatch: results8,all: res9, moment: moment, critical: res10 });

                          }
                        })

                      })


                  });


                });



              });
          //  });

          });
        });
      });

    });
});

router.post('/addToStock', (req,res)=>{

  var batch = "1000";
  var transaction = "1000";
  var inv = "";

  // select last batch no
  db.query(`Select * from tblbatch order by intbatchno desc limit 1`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);

    if (results1 == null || results1 == undefined){

    }else if (results1.length == 0){

    }else{
      batch = parseInt(results1[0].intBatchNo) + 1;
    }

    // select last transaction id
    db.query(`Select * from tblInventoryTransactions order by intTransactionID desc limit 1`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);

      if (results2 == null || results2 == undefined){

      }else if (results2.length == 0){

      }else{
        transaction = parseInt(results2[0].intTransactionID) + 1;
      }

      // select all products in inventory
      db.query(`Select * from tblProductInventory where intInventoryNo = "${req.body.ino_name}"`,(erra,resultsa,fieldsa)=>{
        if (erra) console.log(erra);
        inv = resultsa[0];


        // transaction
        db.beginTransaction(function(err){
          if (err) console.log(err);

          db.query(`Insert into tblBatch (intBatchNo,intInventoryNo, expirationDate, intQuantity) values ("${batch}","${req.body.ino_name}","${req.body.expiration}",${req.body.quantity})`,(err3,results3,fields3)=>{
            if (err3){
              db.rollback(function(){console.log(err3)});
            }else{

              db.query(`Update tblProductInventory set intQuantity = intQuantity + ${req.body.quantity} where intInventoryNo = "${req.body.ino_name}"`,(err4,results4,fields4)=>{
                if (err4){
                  db.rollback(function(){console.log(err4)});
                }else{



                  db.query(`Insert into tblInventoryTransactions (intTransactionID, intInventoryNo, intUserID, intShelfNo, intCriticalLimit, productSRP, productPrice, strTypeOfChanges) values("${transaction}","${req.body.ino_name}","1000", 0, ${inv.intCriticalLimit}, ${inv.productSRP}, ${inv.productPrice}, "Added Batch Products" )`,(err5,results5,fields5)=>{
                    if (err5){
                      db.rollback(function(){console.log(err5)});

                    }else{
                      db.commit(function(err){
                        if (err){
                          db.rollback(function(){console.log(err)});
                        }else{
                          res.redirect('/inventory/allStocks');
                        }
                      })
                    }
                  });
                }
              });
            }

          });

        }); // end of transaction

      });
    });
  });



});

router.post('/addStock', (req,res)=>{

  // Select last batch no
  db.query(`Select * from tblBatch order by intBatchNo desc limit 1`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    var num = "1000";
    if (results1 == null || results1 == undefined){

    }else if (results1.length == 0){

    }else{
      num = parseInt(results1[0].intBatchNo) + 1;
    }

    // Select product inventory details
    db.query(`Select * from tblproductinventory where intinventoryno = ${req.body.ino}`,(erra,resultsa,fieldsa)=>{
      if (erra) console.log(erra);

      // Select last transaction id
      db.query(`Select * from tblInventoryTransactions order by intTransactionID desc limit 1`,(errb,resultsb,fieldsb)=>{
        if (errb) console.log(errb);

        var lasttransact = "1000";
        if (resultsb == null || resultsb == undefined){

        }else if (resultsb.length == 0){

        }else{
          lasttransact = parseInt(resultsb[0].intTransactionID) + 1;
        }

        // Transaction
        db.beginTransaction(function(err){
          if (err) console.log(err);

          db.query(`Insert into tblbatch (intBatchNo, intInventoryNo, expirationDate, intQuantity) values ("${num}","${req.body.ino}","${req.body.expire}",${req.body.quantity})`, (err2,results2,fields2)=>{
            if (err2){
              console.log(err2);
              db.rollback(function(){
                console.log(err2);
              });
            }

            db.query(`Update tblProductInventory set intQuantity = intQuantity +
              ${req.body.quantity} where intInventoryNo = "${req.body.ino}"`,(err3,results3,fields3)=>{
              if (err3){
                console.log(err3);
                db.rollback(function(){
                  console.log(err3);
                })
              }

              db.query(`Insert into tblInventoryTransactions (intTransactionID, intInventoryNo,
                intUserID, intShelfNo, intCriticalLimit, productSRP, productPrice,  strTypeOfChanges) values("${lasttransact}","${req.body.ino}", "1000",${resultsa[0].intShelfNo}, ${resultsa[0].intCriticalLimit}, ${resultsa[0].productSRP}, ${resultsa[0].productPrice},  "Added Batch Products")`,(err5,results5,fields5)=>{
                if (err5){
                  console.log(err5);
                  db.rollback(function(){
                    console.log(err5);
                  });
                }

                db.commit(function(err4){
                  if (err4){
                    db.rollback(function(){
                      console.log(err4)
                    })
                  }

                  res.send("yes");
                });
              });
            });
          });
        }) // end of transaction
      });
    });
  });
});


router.get('/viewStock', (req,res)=>{
  var product = req.query.product;
  var ino = req.query.ino;

  db.query(`Select * from tblProductStock where intInventoryNo = ${ino}`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    db.query(`Select * from tblProductList where intProductNo = ${product}`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);
      db.query(`Select * from tblProductStock order by intProductQuantityNo desc limit 1`, (err3,results3,fields3)=>{
        if (err3) console.log(err3);

        res.render('admin-inventory/views/stockPerProduct', {re: results1, title: results2, moment: moment, list: results3, inventory: ino});

      });

    });
  });
});


// replaced
router.post('/newStock', (req,res)=>{
  db.query(`Insert into tblProductStock (intProductQuantityNo, intInventoryNo, strBarcode, expirationDate) values ("${req.body.prodno}","${req.body.ino}","${req.body.barcode}", "${req.body.expiration}")`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    // ? pano nga ulit subquery?
    db.query(`Select * from tblproductInventory where intInventoryno = "${req.body.ino}"`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);

      var newQuantity = results2[0].intQuantity + 1;

      db.query(`Update tblproductinventory set intQuantity = ${newQuantity} where intInventoryno = "${req.body.ino}"`,(err3,results3,fields3)=>{
        res.send("yes");

      });
    });

  });
});

var expired_result = "";
router.get('/showExpired',(req,res)=>{
  res.render('admin-inventory/views/loader',{re: expired_result, moment: moment});
});

router.post('/searchExpired',(req,res)=>{
  //var dates = (req.body.val).split("-");
  var dates = (req.body.o).split("-");
  var newDate = moment(dates[0]).format("YYYY/MM/DD");
  var newDate1 = moment(dates[1]).format("YYYY/MM/DD");
  console.log(newDate);

  db.query(`Select * from tblbatch
    join tblproductinventory on tblbatch.intinventoryno = tblproductinventory.intinventoryno
    join tblproductlist on tblproductlist.intproductno = tblproductinventory.intproductno
    join tblProductBrand on tblproductlist.intbrandno = tblproductbrand.intBrandNo
    join tblSupplier on tblProductInventory.intuserID = tblSupplier.intUserID
    where tblbatch.expirationDate between '${newDate}' and '${newDate1}' and tblbatch.intStatus = 1`,(err1,results1,fiels1)=>{
      if (err1) console.log(err1);

      expired_result = results1;
      res.send("yes")
      //res.render('admin-inventory/views/loader',{re: results1, moment: moment});


  });
});

router.post('/pullOutItem',(req,res)=>{


  var pullOutNo = "1000";

  db.beginTransaction(function(err){
    if (err){
      console.log(err);
    }else{

          db.query(`Select * from tblbatch where intBatchNo = "${req.body.batch}" `,(err2,results2,fields2)=>{
            if (err2){db.rollback(function(){console.log(err2)});
            }else{

              db.query(`Update tblProductInventory set intQuantity = intQuantity - ${results2[0].intQuantity} where intInventoryNo = "${results2[0].intInventoryNo}"`,(err3,results3,fields3)=>{
                if (err3){db.rollback(function(){console.log(err3)})
                }else{
                  db.query(`Select * from tblstockpullout order by intPullOutNo desc limit 1`, (err4,results4,fields4)=>{
                    if (err4){db.rollback(function(){console.log(err4)})}
                    else{
                      if (results4 == null || results4 == undefined){}else if(results4.length == 0){}
                      else{
                        pullOutNo = parseInt(results4[0].intPullOutNo) + 1;
                      }
                        db.query(`Insert into tblstockpullout (intPullOutNo, intInventoryNo, intAdminID, intQuantity) values("${pullOutNo}","${results2[0].intInventoryNo}","1000",${results2[0].intQuantity})`,(err5,results5,fields5)=>{
                          if (err5){
                            db.rollback(function(){console.log(err5)});
                          }else{
                            db.query(`Update tblBatch set intQuantity = 0, intStatus = 0 where intBatchNo = "${req.body.batch}"`,(err6,res6,fie6)=>{
                              if(err6) db.rollback(function(){console.log(err5)});
                              else{
                                db.commit(function(e1){
                                  if(e1){db.rollback(function(){console.log(e1)})}
                                  else{
                                    res.send("yes");
                                  }
                                })
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

});

router.post('/pullOut',(req,res)=>{

  var dates = (req.body.val).split("-");
  var pullOutNo = "1000";

  db.beginTransaction(function(err){
    if(err){
      console.log(err);
    }else{
      db.query(`Update tblBatch set intStatus = 0 where expirationDate between '1111-12-12' and '1111-12-12'`,(err1,results1,fields1)=>{
        if (err1){
          db.rollback(function(){
            console.log(err1);
          })
        }else{
          db.query(`Select * from tblstockpullout order by intPulloutNo desc limit 1`,(err2,results2,fields2)=>{
            if (err2){
              db.rollback(function(){
                console.log(err2);
              })
            }else{
              if(results2 == null || results2 == undefined){

              }else if(results2.length == 0){

              }else{
                pullOutNo = parseInt(results2[0].intPullOutNo) + 1;
              }


            }

          });
        }
      });
    }
  })

});

router.post('/checkCritical',(req,res)=>{
  db.query(`Select count(*) as allCrit from tblProductinventory where intQuantity < intCriticalLimit or intQuantity = intCriticalLimit`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    if(!err1){
      if(res1==null||res1==undefined){res.send("no");} else if(res1.length==0){ res.send("no");}
      else{res.send(res1)}
    }
  })
});

router.post('/checkExpired',(req,res)=>{
  db.query(`Select count(*) as allExp from tblbatch
    where ((tblbatch.expirationDate between NOW() and DATE_ADD(NOW(), INTERVAL 14 DAY)) or tblbatch.expirationDate <= CURDATE() ) and tblbatch.intStatus = 1`,(err1,res1,fie1)=>{
      if(err1) console.log(err1);
      if(!err1){
        if(res1==null||res1==undefined){res.send("no");} else if(res1.length==0){ res.send("no");}
        else{res.send(res1)}
      }
    })
});



router.get('/expiredProducts',(req,res)=>{

    db.query(`Select * from tblbatch
      join tblproductinventory on tblbatch.intinventoryno = tblproductinventory.intinventoryno
      join tblproductlist on tblproductlist.intproductno = tblproductinventory.intproductno
      join tblProductBrand on tblproductlist.intbrandno = tblproductbrand.intBrandNo
      join tblSupplier on tblProductInventory.intuserID = tblSupplier.intUserID
      where ((tblbatch.expirationDate between NOW() and DATE_ADD(NOW(), INTERVAL 14 DAY)) and tblbatch.intStatus = 1) and tblBatch.intQuantity <> 0`,(err2,res2,fie2)=>{
        if(err2) console.log(err2);

        if(!err2) res.render('admin-inventory/views/expiredProducts',{moment: moment, all: res2});

      })

});

router.get('/pullOutProduct',(req,res)=>{
  // Select batch
  db.query(`Select tblBatch.intQuantity as quantity, tblBatch.intStatus as stats, tblBatch.*, tblProductInventory.*, tblProductlist.*, tblProductBrand.*, tblUom.*
    from tblBatch join tblProductInventory on tblBatch.intInventoryNo = tblProductinventory.intInventoryNo
    join tblProductList on tblProductList.intProductNo = tblProductInventory.intProductNo
    join tblProductBrand on tblProductlist.intBrandNo = tblProductBrand.intBrandNo
    join tblUom on tblProductInventory.intUOMno = tblUom.intUOMno
    where tblBatch.intStatus = 1 and tblBatch.intQuantity <> 0 `,(err1,batch,fie1)=>{
      if(err1) console.log(err1);
      else{
        // select all pullOut
        db.query(`Select tblStockPullOut.intQuantity as quantity, tblStockPullOut.*, tblProductInventory.*, tblProductBrand.*, tblUom.*
           from tblStockPullOut join tblProductInventory on tblStockPullOut.intInventoryNo = tblProductInventory.intInventoryNo
          join tblProductList on tblProductInventory.intProductNo = tblProductList.intProductNo
          join tblProductBrand on tblProductList.intBrandNo = tblProductBrand.intBrandNo
          join tblUom on tblProductinventory.intuomno = tbluom.intuomno`,(err2,res2,fie2)=>{
            if(err2) console.log(err2);
            else{
              console.log(res2)
              res.render('admin-inventory/views/pullOutProducts',{batch: batch, moment: moment, all: res2});

            }
          })

      }
    });
})

router.post('/update',(req,res)=>{
  var transact_no = "1000";
  db.query(`Update tblProductInventory set intCriticalLimit = ${req.body.critical}, intShelfNo = ${req.body.shelf}, strVariant = "${req.body.variant}" where intInventoryNo = "${req.body.ino}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1)
    else{
      db.query(`Select * from tblInventoryTransactions order by intTransactionID desc limit 1`,(err2,res2,fie2)=>{
        if(err2) console.log(err2)
        else{
          if(res2==null||res2==undefined){} else if(res2.length==0){}
          else{transact_no = parseInt(res2[0].intTransactionID) + 1}

          db.query(`Select * from tblProductInventory where intInventoryNo = "${req.body.ino}"`,(err3,inv,fie3)=>{
            if(err3) console.log(err3);
            else{
              db.query(`Insert into tblInventoryTransactions (intTransactionID, intInventoryNo, intUserID, intShelfNo, intCriticalLimit, productSRP, productPrice, strTypeOfChanges) values("${transact_no}", "${req.body.ino}", "1000", ${req.body.shelf}, ${req.body.critical}, ${inv[0].productSRP}, ${inv[0].productPrice}, "Update Inventory Details")`,(err4,res4,fie4)=>{
                if(err4) console.log(err4);
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

router.get('/adjustments',(req,res)=>{
  db.query(`Select tblAdjustments.intQuantity as qty, tblProductInventory.*, tblProductList.*, tblAdjustments.*, tblAdjustmentTypes.* from tblAdjustments join tblProductInventory on tblAdjustments.intInventoryNo = tblProductInventory.intInventoryNo join tblProductList on tblProductlist.intProductNo = tblProductInventory.intProductNo join tblAdjustmentTypes on tblAdjustmentTypes.intAdjustmentTypeNo = tblAdjustments.intAdjustmentTypeNo`,(err1,res1,fie1)=>{
    if(err1){console.log(err1)}
    else{
      db.query(`Select * from tblAdjustmentTypes where intStatus = 1`,(err2,res2,fie2)=>{
        if(err2) console.log(err2);
        else{
          db.query(`Select * from tblProductInventory join tblProductList on tblProductinventory.intProductNo = tblProductList.intProductNo where tblProductlist.intStatus = 1`,(err3,res3,fie3)=>{
            if(err3) console.log(err3);
            res.render('admin-inventory/views/adjustments',{all: res1, moment: moment, type: res2, inv: res3});

          });

        }
      })
    }
  });
});

router.get('/count',(req,res)=>{
  db.query(`Select * from tblbatch where intInventoryNo = "${req.query.inv}" and intStatus = 1`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    db.query(`Select * from tblAdjustmentTypes where intStatus = 1`,(err2,res2,fie2)=>{
      if(err2) console.log(err2);
      res.render('admin-inventory/views/batchAdjust',{re: res1, moment: moment, types: res2});

    })
  });
});

router.post('/addBatchAdjust',(req,res)=>{
  var adj = "1000";

  db.beginTransaction(function(e){
    db.query(`Select * from tblAdjustmentTypes where intAdjustmentTypeNo = "${req.body.types}"`,(err1,res1,fie1)=>{
      if(err1) console.log(err1);
      console.log(res1[0]);
      db.query(`Select * from tblAdjustments order by intAdjustmentNo desc limit 1`,(erra,resa,fiea)=>{
        if(erra) console.log(erra);

        else{
          if(resa.length == 0){}
          else{ adj = parseInt(resa[0].intAdjustmentNo) + 1}

          // loss
          if(res1[0].intAdjustmentType == 0){

            db.query(`Select * from tblBatch where intBatchNo = "${req.body.batch_no}"`,(err2,res2,fie2)=>{
              if(err2) console.log(err2);
              else{
                if(res2[0].intQuantity == 0 || res2[0].intQuantity < req.body.quantity){ res.send("no");}
                else{
                  db.query(`Update tblBatch set intQuantity = intQuantity - ${req.body.quantity} where intBatchNo = ${req.body.batch_no}`,(err3,res3,fie3)=>{
                    if(err3) console.log(err3);
                    else{

                      db.query(`Insert into tblAdjustments (intAdjustmentNo, intInventoryNo, intAdjustmentTypeNo, strAdjustmentNote, intAdminID, intQuantity) values ("${adj}", "${res2[0].intInventoryNo}","${req.body.types}","${req.body.details}",1000,${req.body.quantity})`,(errq,resq,fieq)=>{
                        if(errq) console.log(errq);
                        else{


                          db.query(`Update tblProductInventory set intQuantity = intQuantity - ${req.body.quantity} where intInventoryNo = ${res2[0].intInventoryNo}`,(errf,resf,fief)=>{
                            if(errf) console.log(errf);
                            else{
                              db.commit(function(ee){
                                if(ee) console.log(ee);
                                else{ res.send("yes");}
                              })
                            }
                          });

                        }
                      })
                    }
                  })
                }
              }
            })
          }
          // gain
          else{
            db.query(`Update tblBatch set intQuantity = intQuantity + ${req.body.quantity} where intBatchNo = ${req.body.batch_no}`,(err4,res4,fie4)=>{
              if(err4) console.log(err4);
              else{
                db.query(`Select * from tblBatch where intBatchNo = ${req.body.batch_no}`,(err5,res5,fie5)=>{
                  if(err5) console.log(err5);
                  else{
                    db.query(`Update tblProductInventory set intQuantity = intQuantity + ${req.body.quantity} where intInventoryNo = "${res5[0].intInventoryNo}"`,(err6,res6,fie6)=>{
                      if(err6) console.log(err6);
                      else{
                        db.query(`Insert into tblAdjustments (intAdjustmentNo, intInventoryNo, intAdjustmentTypeNo, strAdjustmentNote, intAdminID, intQuantity) values ("${adj}", "${res5[0].intInventoryNo}","${req.body.type}","${req.body.details}",1000,${req.body.quantity})`,(errq,resq,fieq)=>{
                          if(errq) console.log(errq);
                          else{
                            db.commit(function(eew){
                              if(eew) console.log(eew);
                              else{ res.send("yes");}
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
    })
  })
});

router.post('/getBarcode',(req,res)=>{
  db.query(`Select * from tblProductInventory
    join tblProductList on tblProductInventory.intProductNo = tblProductList.intProductNo
     where tblProductInventory.strBarcode = "${req.body.o}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      if(res1==null||res1==undefined){res.send("no");} else if(res1.length==0){res.send("no")}
      else{
        res.send(res1);
      }
    }
  })
});

router.post('/sample',(req,res)=>{
  var tr = '-'
  console.log(`this is ${tr}`);
});

router.post('/addAdjustment',(req,res)=>{
  db.beginTransaction(function(err){
    if(err){db.rollback(function(){console.log(err)})}
    else{
      var list = req.body.barcode;
      var count = 0;
      var adj_no = "1000";
      var inv_no = 0;
      var type = "", type_details = "";
      var transact_no = "1000";

      async.eachSeries(list,function(data,callback){

        // Insert to tblAdjustments
        db.query(`Select * from tblAdjustments order by intAdjustmentNo desc limit 1`,(err1,res1,fie1)=>{
          if(err1){db.rollback(function(){console.log(err1)})}
          else{
            if(res1==null||res1==undefined){} else if(res1.length==0){}
            else{ adj_no = parseInt(res1[0].intAdjustmentNo) + 1; }

            db.query(`Select * from tblProductInventory where strBarcode = "${req.body.barcode[count]}"`,(err2,res2,fie2)=>{
              if(err2) {db.rollback(function(){console.log(err2)})}
              else{
                inv_no = res2[0].intInventoryNo;

                db.query(`Insert into tblAdjustments (intAdjustmentNo, intInventoryNo, intAdjustmentTypeNo, strAdjustmentNote, intAdminID, intQuantity) values ("${adj_no}","${inv_no}","${req.body.type[count]}","${req.body.note[count]}","1006",${req.body.quantity[count]})`,(err3,res3,fie3)=>{
                  if(err3) {db.rollback(function(){console.log(err3)})}
                  else{

                    // Adjust product inventory
                    db.query(`Select * from tblAdjustmentTypes where intAdjustmentTypeNo = "${req.body.type[count]}"`,(err4,res4,fie4)=>{
                      if(err4){db.rollback(function(){console.log(err4)})}
                      else{
                        if(res4[0].intAdjustmentType == 0){ type = '-'; type_details = "Removed Products ("+res4[0].strAdjustment+")" ;}
                        else{ type = '+'; type_details = "Added Products ("+res4[0].strAdjustment+")" ; }

                        db.query(`Update tblProductInventory set intQuantity = intQuantity ${type} ${req.body.quantity[count]} where intInventoryNo = "${inv_no}"`,(err5,res5,fie5)=>{
                          if(err5) {db.rollback(function(){console.log(err5)})}
                          else{
                            db.query(`Select * from tblInventoryTransactions order by intTransactionID desc limit 1`,(err6,res6,fie6)=>{
                              if(err6){db.rollback(function(){console.log(err6)})}
                              else{
                                if(res6==null||res6==undefined){} else if(res6.length==0){}
                                else{ transact_no = parseInt(res6[0].intTransactionID) + 1;}

                                db.query(`Insert into tblInventoryTransactions (intTransactionID, intInventoryNo, intUserID, strTypeOfChanges, intShelfNo, intCriticalLimit, productSRP, productPrice) values ("${transact_no}","${inv_no}","1006","Sample",${res2[0].intShelfNo},${res2[0].intCriticalLimit},${res2[0].productSRP},${res2[0].productPrice})`,(err7,res7,fie7)=>{
                                  if(err7){db.rollback(function(){console.log(err7)})}
                                  else{

                                    // Adjust Batch
                                    db.query(`Select * from tblBatch where intBatchNo = "${req.body.batch[count]}"`,(err8,res8,fie8)=>{
                                      if(err8) {db.rollback(function(){console.log(err8)})}
                                      else{
                                        if(type == 0){ // if loss
                                          if(res8[0].intQuantity == 0){
                                            res.send("no");
                                          }else{
                                            db.query(`Update tblBatch set intQuantity = intQuantity - ${req.body.quantity[count]} where intBatchNo = "${res8[0].intBatchNo}"`,(err9,res9,fie9)=>{
                                              if (err9) {db.rollback(function(){console.log(err9)})}
                                              count++;
                                              callback();
                                            });
                                          }
                                        }
                                        else{ // if gain
                                          db.query(`Update tblBatch set intQuantity = intQuantity + ${req.body.quantity[count]} where intBatchNo = "${res8[0].intBatchNo}"`,(err10,res10,fie10)=>{
                                            if (err10) {db.rollback(function(){console.log(err10)})}
                                            count++;
                                            callback();
                                          });
                                        }
                                      }
                                    });
                                  }
                                });
                              }
                            })
                          }
                        })

                      }
                    });

                  }
                });
              }
            })
          }
        })


      },function(errx,results){
        if(errx) {db.rollback(function(){console.log(errx)})}
        else{
          db.commit(function(e){
            if(e){db.rollback(function(){console.log(e)})}
            else{
              res.send("yes");
            }
          })
        }
      })
    }
  })
});

router.get('/seeBatch',(req,res)=>{
  db.query(`Select tblBatch.intQuantity as quantity, tblProductInventory.*, tblProductlist.*, tblBatch.* from tblBatch join tblProductInventory on tblBatch.intInventoryNo = tblProductInventory.intInventoryNo join tblProductList on tblProductList.intProductNo = tblProductInventory.intProductNo
    where tblBatch.intInventoryNo = "${req.query.p}" and tblBatch.intStatus = 1`,(err1,res1,fie1)=>{
      if(err1) console.log(err1);
      else{
        res.render('admin-inventory/views/seeBatch',{re: res1, moment: moment});
      }
    })
});

router.post('/updatePrice',(req,res)=>{
  var transact_no = "1000";
  db.query(`Update tblProductInventory set productSRP = ${req.body.srp}, productPrice = ${req.body.price} where intInventoryNo = "${req.body.ino}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1)
    else{
      db.query(`Select * from tblInventoryTransactions order by intTransactionID desc limit 1`,(err2,res2,fie2)=>{
        if(err2) console.log(err2)
        else{
          if(res2==null||res2==undefined){} else if(res2.length==0){}
          else{transact_no = parseInt(res2[0].intTransactionID) + 1}

          db.query(`Select * from tblProductInventory where intInventoryNo = "${req.body.ino}"`,(err3,inv,fie3)=>{
            if(err3) console.log(err3);
            else{
              db.query(`Insert into tblInventoryTransactions (intTransactionID, intInventoryNo, intUserID, intShelfNo, intCriticalLimit, productSRP, productPrice, strTypeOfChanges) values("${transact_no}", "${req.body.ino}", "1000", ${inv[0].intShelfNo}, ${inv[0].intCriticalLimit}, ${req.body.srp}, ${req.body.price}, "Price Changes")`,(err4,res4,fie4)=>{
                if(err4) console.log(err4);
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

router.post('/checkQuantity',(req,res)=>{
  db.query(`Select * from tblBatch where intBatchNo = "${req.body.batch}" and intQuantity >= ${req.body.quantity}`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      if(res1.length==0){ res.send("no")}
      else{ res.send("yes")}
    }
  })
});

router.post('/singlePullOut/:id',(req,res)=>{
  var pullout_no = "1000";

  // with warning
  if(req.params.id==1){

    db.beginTransaction(function(err){
      if(err) console.log(err);
      else{
        db.query(`Select * from tblStockPullOut order by intPullOutNo desc limit 1`,(err1,res1,fie1)=>{
          if(err1) console.log(err1);
          else{
            if(res1.length==0){} else{ pullout_no = parseInt(res1[0].intPullOutNo) + 1;}

            db.query(`Select * from tblBatch where intBatchNo = "${req.body.batch}" and intQuantity >= ${req.body.quantity}`,(err2,res2,fie2)=>{
              if(err2){ console.log(err2); res.send("no")}
              else{

                db.query(`Select * from tblProductInventory where intInventoryNo = "${res2[0].intInventoryNo}"
                  and (intQuantity - intReservedItems) >= ${req.body.quantity}`,(err3,res3,fie3)=>{
                    if(err3) console.log(err3);
                    else{
                      if(res3.length==0){ res.send("reserved")}
                      else{
                        db.query(`Update tblProductInventory set intQuantity = intQuantity - ${req.body.quantity} where intInventoryNo = ${res2[0].intInventoryNo}
                         and (intQuantity - intReservedItems) >= ${req.body.quantity} `,(err4,res4,fie4)=>{
                           if(err4) console.log(err4);
                           else{
                             db.query(`Update tblBatch set intQuantity = intQuantity - ${req.body.quantity} where intBatchNo = "${req.body.batch}" and intQuantity >= ${req.body.quantity}`,(err5,res5,fie5)=>{
                               if(err5) console.log(err5);
                               else{
                                 db.query(`Insert into (intPullOutNo, intInventoryNo, intAdminID, intQuantity)
                                 values("${pullout_no}", "${res2[0].intInventoryNo}", "1000",  ${req.body.quantity})`,(err6,res6,fie6)=>{
                                   if(err6) console.log(err6);
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
      }
    });

  // without warning
  }else{
    db.beginTransaction(function(err){
      if(err) console.log(err);
      else{
        db.query(`Select * from tblStockPullOut order by intPullOutNo desc limit 1`,(err1,res1,fie1)=>{
          if(err1) console.log(err1);
          else{
            if(res1.length==0){} else{ pullout_no = parseInt(res1[0].intPullOutNo) + 1;}

            db.query(`Select * from tblBatch where intBatchNo = "${req.body.batch}" and intQuantity >= ${req.body.quantity}`,(err2,res2,fie2)=>{
              if(err2){ console.log(err2); }
              else{

                db.query(`Select * from tblProductInventory where intInventoryNo = "${res2[0].intInventoryNo}"`,(err3,res3,fie3)=>{
                    if(err3) console.log(err3);
                    else{
                      if(res3.length==0){ }
                      else{
                        db.query(`Update tblProductInventory set intQuantity = intQuantity - ${req.body.quantity} where intInventoryNo = ${res2[0].intInventoryNo}`,(err4,res4,fie4)=>{
                           if(err4) console.log(err4);
                           else{
                             db.query(`Update tblBatch set intQuantity = intQuantity - ${req.body.quantity} where intBatchNo = "${req.body.batch}" and intQuantity >= ${req.body.quantity}`,(err5,res5,fie5)=>{
                               if(err5) console.log(err5);
                               else{
                                 db.query(`Insert into tblStockPullOut (intPullOutNo, intInventoryNo, intAdminID, intQuantity)
                                 values ("${pullout_no}", "${res2[0].intInventoryNo}", "1000", ${req.body.quantity})`,(err6,res6,fie6)=>{
                                   if(err6) console.log(err6);
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
      }
    });

  }


});


// Packages -----------------------
router.get('/package', (req,res)=>{
  db.query(`Select * from tblpackage`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    db.query(`Select * from tblpackage where dateDue <= CURDATE()`,(err2,res2,fie2)=>{
      if(err2) console.log(err2);
      else{
        res.render('admin-inventory/views/package',{re: results1, moment: moment, due: res2});
      }
    })
  });
});

router.post('/packageGetBarcode',(req,res)=>{
  db.query(`Select (intQuantity - intReservedItems) as totalQty, tblProductInventory.*, tblProductlist.*, tblUom.*, tblProductBrand.*
  from tblproductInventory
    join tblproductlist on tblproductinventory.intproductno = tblproductlist.intproductno
  join tbluom on tbluom.intUomNo = tblproductInventory.intUomNo
  join tblProductBrand on tblProductList.intBrandno = tblProductBrand.intBrandNo
  where strBarcode = "${req.body.o}"`,(err1,inventory,fields1)=>{
    if(err1){
      console.log(err1); res.send("error");
    }
    if(!err1){
      if(inventory == null|| inventory == undefined){res.send("error")}
      else if(inventory.length == 0){res.send("error")}
      else{ res.json({inventory: inventory})}

    }
  });
});

router.post('/addPackage',(req,res)=>{
  db.query(`Select * from tblpackage order by intPackageNo desc limit 1`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);

    var num = "1000";
    if (results1 == null || results1 == undefined){

    }else if (results1.length == 0){

    }else{
      num = parseInt(results1[0].intPackageNo) + 1;
    }

    db.query(`Insert into tblpackage (intPackageNo, intAdminID, strPackageName, strPackageDescription, packagePrice, intQuantity, dateDue) values ("${num}","1000","${req.body.pname}","${req.body.pdesc}",${req.body.pprice}, ${req.body.pquantity}, "${req.body.pdue}")`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);
      if (!err2) res.send("yes");
    });
  })
});

router.get('/packageList',(req,res)=>{
  var pack = req.query.package;

  db.query(`Select * from tblpackagelist
    join tblproductinventory on tblpackagelist.intinventoryno = tblproductinventory.intinventoryno
    join tblproductlist on tblproductlist.intproductno = tblproductinventory.intproductno
    join tbluom on tblproductinventory.intuomno = tbluom.intuomno
    join tbluser on tblproductinventory.intuserid = tbluser.intuserid
    where tblpackagelist.intpackageno = ${pack}`,(err1,results1,fields1)=>{
      if (err1) console.log(err1);

      db.query(`Select * from tblPackage where intPackageNo = ${pack}`,(err2,results2,fields2)=>{
        if(err2) console.log(err2);

        res.render('admin-inventory/views/packagelist',{re:results1, moment: moment, package: pack, quantity: results2[0].intQuantity});
      });


    });
});

router.post('/addPackageList',(req,res)=>{
  var no = "1000";

  db.beginTransaction(function(err){
    if(err){db.rollback(function(){console.log(err); res.send("error");})}
    else{
      db.query(`Select * from tblPackageList order by intpackagelistno desc limit 1`,(err1,results1,fields1)=>{
        if(err1){db.rollback(function(){console.log(err1); res.send("error");})}
        if(!err1){
          if(results1==null||results1==undefined){} else if(results1.length==0){}
          else{
            no = parseInt(results1[0].intPackageListNo) + 1;
          }

          db.query(`Insert into tblPackageList (intPackageListNo, intInventoryNo, intPackageNo, intProductQuantity) values ("${no}","${req.body.inventory}","${req.body.package}","${req.body.quantity}")`,(err2,results2,fields2)=>{
            if(err2){db.rollback(function(){console.log(err2); res.send("error");})}

            db.query(`Update tblPackage set intQuantity = ${req.body.package_quantity} where intPackageNo = "${req.body.package}"`,(err3,res3,fie3)=>{
              if(err3) {db.rollback(function(){console.log(err3); res.send("error");})}

              db.query(`Update tblProductInventory set intQuantity = intQuantity - (${req.body.package_quantity} * ${req.body.quantity}) where intInventoryNo = "${req.body.inventory}"`,(err4,res4,fie4)=>{
                if(err4) {db.rollback(function(){console.log(err4); res.send("error");})}
                else{
                  db.query(`SELECT * FROM tblbatch where intinventoryno = "${req.body.inventory}"  order by created_at`,(err5,batch,fie5)=>{
                    if(err5) {db.rollback(function(){console.log(err5); res.send("error");})}
                    else{
                      var remaining = req.body.package_quantity * req.body.quantity;
                      for(var a in batch){
                        if(remaining == 0){
                          break;

                        }
                        else if(batch[a].intQuantity < remaining || batch[a].intQuantity == remaining){
                          let newValue = 0;
                          // remaining -= batch[a].intQuantity;
                          // console.log('newValue: '+newValue);
                          // console.log('remaining: '+remaining);
                          db.query(`Update tblBatch set intQuantity = ${newValue} where intBatchNo = "${batch[a].intBatchNo}"`,(e4,r4,f4)=>{
                            if(e4)console.log(e4);
                          });

                        }
                        else{
                          let newValue = batch[a].intQuantity - remaining;
                          remaining = 0;
                          // console.log('newValue: '+newValue);
                          // console.log('remaining: '+remaining);
                          db.query(`Update tblBatch set intQuantity = ${newValue} where intBatchNo = "${batch[a].intBatchNo}"`,(e5,r5,f5)=>{
                            if(e5)console.log(e5);
                          });
                        }
                      }
                      com(req,res);
                      function com(req,res){
                        db.commit(function(e){
                          if(e){db.rollback(function(){console.log(e); res.send("error");})}
                          else{
                            res.send("success");

                          }
                        })
                      }


                    }
                  })
                }
              });
            });

          });
        }
      });
    }
  })


});

router.post('/changePackageStat',(req,res)=>{
  db.query(`Update tblPackage set intStatus = ${req.body.value} where intPackageNo = "${req.body.no}"`,(err2,res2,fie2)=>{
    if(err2) console.log(err2);
    res.send("")
  })
});

router.post('/editPackage',(req,res)=>{
  //var d = moment(req.body.date).format('')
  db.query(`Update tblPackage set strPackageName = "${req.body.name}", strPackageDescription="${req.body.description}", packagePrice=${req.body.price}, dateDue="${req.body.date}" where intPackageNo = "${req.body.no}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      res.send("yes")
    }
  })
})

// Discount - Promotion

router.get('/productDiscount',(req,res)=>{
  db.query(`Select * from tblProductDiscount join tblProductInventory on tblProductDiscount.intInventoryNo = tblProductInventory.intInventoryNo
    join tblProductList on tblProductList.intProductNo = tblProductInventory.intProductNo
    join tblUom on tblUom.intUomno = tblProductInventory.intUomno`, (err1,res1,fie1)=>{
      if(err1) console.log(err1);
      else{
        db.query(`Select * from tblProductInventory
          join tblProductList on tblProductList.intProductNo = tblProductInventory.intProductNo
          join tblUom on tblUom.intUomno = tblProductInventory.intUomno
          join tblProductBrand on tblProductlist.intBrandNo = tblProductBrand.intBrandNo`,(err2,res2,fie2)=>{
            if(err2) console.log(err2);
            else{
              res.render('admin-inventory/views/discount', {list: res1, moment: moment, inventory: res2});
            }
          })
      }
    })
});

router.post('/addDiscount',(req,res)=>{
  var discount_no = "1000", transact_no = "1000";

  db.beginTransaction(function(err){
    if(err) console.log(err1)
    else{
      db.query(`Select * from tblProductDiscount order by intDiscountNo desc limit 1`,(err1,res1,fie1)=>{
        if(err1) console.log(err1);
        else{
          if(res1.length==0){} else{ discount_no = parseInt(res1[0].intDiscountNo) + 1; }

          db.query(`Insert into tblProductDiscount (intDiscountNo, intInventoryNo, discount, strDescription, discountDueDate)
          values ("${discount_no}", "${req.body.inventory}", ${req.body.discount}, "${req.body.description}", "${req.body.date}")`,(err2,res2,fie2)=>{
            if(err2) console.log(err2);
            else{
              db.query(`Select * from tblInventoryTransactions order by intTransactionID desc limit 1`,(err4,res4,fie4)=>{
                if(err4) console.log(err4);
                else{
                  if(res4.length==0){} else{ transact_no = parseInt(res4[0].intTransactionID) + 1;}
                  db.query(`Select * from tblProductInventory where intInventoryNo = "${req.body.inventory}"`,(err3,inventory,fie3)=>{
                    if(err3) console.log(err3);
                    else{
                      db.query(`Insert into tblInventoryTransactions (intTransactionID, intInventoryNo, intUserID, intShelfNo, intCriticalLimit, productSRP, productPrice, strTypeOfChanges)
                      values ("${transact_no}", "${req.body.inventory}", "1000", ${inventory[0].intShelfNo}, ${inventory[0].intCriticalLimit}, ${inventory[0].productSRP}, ${inventory[0].productPrice}, "Discounted ${req.body.discount}% (No: ${discount_no})")`,(err5,res5,fie5)=>{
                        if(err5) console.log(err5);
                        else{
                          db.commit(function(errb){
                            if(errb) console.log(errb);
                            else{
                              res.send("yes");
                            }
                          })
                        }
                      })
                    }
                  })
                }
              });

            }
          })
        }
      })
    }
  })

})



// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.inventory = router;
