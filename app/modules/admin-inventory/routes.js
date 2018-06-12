var router = require('express').Router();
var db = require('../../lib/database')();
var fileUpload = require('express-fileUpload');
var path = require('path');
var moment = require('moment');
var async = require('async');
var url = require('url');



router.use(fileUpload());

router.get('/allProducts', (req,res)=>{

  db.query(`Select * from tblproductlist join tblproductbrand on tblproductlist.intBrandNo = tblproductbrand.intBrandNo
  join tblSubCategory on tblproductlist.intSubcategoryno = tblsubcategory.intsubcategoryno
  join tblcategory on tblsubcategory.intcategoryno = tblcategory.intcategoryno where tblproductlist.intStatus = 1`, (err1,results1,fields1)=>{
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

  if (!req.files){
      db.query(`Insert into tblProductList (intProductNo, intSubCategoryNo, intBrandNo, strProductCode, strProductName, strDescription, strProductPicture) values ("${req.body.add_prodno}", ${req.body.add_pcat}, ${req.body.add_brand}, "${req.body.add_pcode}", "${req.body.add_pname}", "${req.body.add_pdesc}", "" )`, (err1,results1,fields1)=>{
        if (err1) console.log(err1);
        res.send('success');
      });
  }else{

    let sample = req.files.add_pic;
    var filename = req.files.add_pic.name;

    db.query(`Insert into tblProductList (intProductNo, intSubCategoryNo, intBrandNo, strProductCode, strProductName, strDescription, strProductPicture) values ("${req.body.add_prodno}", ${req.body.add_pcat}, ${req.body.add_brand}, "${req.body.add_pcode}", "${req.body.add_pname}", "${req.body.add_pdesc}", "${filename}")`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);
      var link = path.join(path.dirname(path.dirname(path.dirname(__dirname))), 'public/images/'+filename);
      sample.mv(link, function(err){
        if (err) console.log(err);
        res.redirect('/inventory/allProducts');

      });

    });

  }

});

router.post('/addImage', (req,res)=>{
  //console.log(req.body.file);
  if (!req.files) return res.status(400).send('No files Uploaded');
  console.log(req.files.filename);
  //console.log(req.files.filename);
  let sample = req.files.filename;
  var filename = req.files.filename.name;
  //console.log(filename.name);

  //console.log(path.join(path.dirname(path.dirname(path.dirname(__dirname))), 'public/images'));
  var link = path.join(path.dirname(path.dirname(path.dirname(__dirname))), 'public/images/'+filename);
  sample.mv(link, function(err){
    if (err) return res.status(500).send(err);

    res.send('file uploaded');
  })

});

router.get('/supplierProducts', (req,res)=>{
  res.render('admin-inventory/views/supplierProducts');
});

router.get('/productInventory', (req,res)=>{

  var product = req.query.product;
  db.query(`
    Select * from tblproductinventory join tblproductlist on tblproductinventory.intProductno  = tblproductlist.intproductno
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

            res.render('admin-inventory/views/productInventory', {re: results1, moment: moment, list: results2, uom: results3, su: results4, product: product, title: results5});

          })


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

router.post('/addSupplier2', (req,res)=>{

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

  db.query(`
    Insert into tblProductInventory (intInventoryNo, intProductNo, intUserID, productSRP,      intUOMno, intSize, productPrice) values ("${req.body.add_inventoryno}","${req.body.add_productno}", "${req.body.add_sno}", ${req.body.add_srp}, "${req.body.add_uom}", ${req.body.add_size}, ${req.body.add_price})`, (err1,results1,fields1)=>{
      if (err1) console.log(err1);
      db.query(`Select * from tblinventorytransactions order by intTransactionID desc limit 1`, (err2,results2,fields2)=>{
        if (err2) console.log(err2);


        if (results2 == 'null' || results2 == 'undefined' || results2.length == 0){
           db.query(`Insert into tblinventorytransactions (intTransactionID,intInventoryNo, intBatchNo, intShelfNo, intCriticalLimit,  strTypeOfChanges, intUserID ) values ("1000","${req.body.add_inventoryno}",${req.body.add_batch},${req.body.add_shelf},${req.body.add_critical},"New Product Item","1000")`, (err3,results3,fields3)=>{
             if (err3) console.log(err3);

             res.redirect('/inventory/productInventory?product=1000');

           });

        }else{
          var ino = parseInt(results2[0].intTransactionID) + 1;
          db.query(`Insert into tblinventorytransactions (intTransactionID,intInventoryNo, intBatchNo, intShelfNo, intCriticalLimit,  strTypeOfChanges, intUserID ) values ("${ino}","${req.body.add_inventoryno}",${req.body.add_batch},${req.body.add_shelf},${req.body.add_critical},"New Product Item","1000")`, (err4,results4,fields4)=>{
            if (err4) console.log(err4);
            res.redirect('/inventory/productInventory?product=1000');


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

router.get('/sample', (req,res)=>{

  function query1(callback){
    setTimeout(function(){
      callback("Test1");
    }, 1000);
  }
  function query2(callback){
    setTimeout(function(){
      callback("Test2");
    }, 1000);
  }

    async.parallel({
    data1: function (cb) {
      query1(function (data) {
        cb(null, data);
      });
    },
    data2: function (cb) {
      query2(function (data) {
        cb(null, data);
      });
    }
      }, function (err, dataObject) {
          console.log(dataObject.data1);
         // render([dataObject.data1, dataObject.data2, dataObject.data3]);
         // var profile = req.session.user;
         //  res.render('businessman/views/transactionList', {profile: profile,event: dataObject.data1, item: dataObject.data2, service: dataObject.data3, user: `${req.session.user.strProviderFName}`+" "+ `${req.session.user.strProviderLName}`});
      });

});

router.get('/allStocks', (req,res)=>{

  // Query inventory
  db.query(`
    Select count(*) as Quantity, tblproductList.*, tblProductBrand.* from tblProductList
    join tblProductBrand on tblProductList.intBrandno = tblProductBrand.intBrandNo
    join tblProductInventory on tblProductList.intProductNo = tblProductInventory.intProductNo
    join tblProductStock on tblProductInventory.intInventoryNo = tblProductStock.intInventoryNo
    group by tblProductList.intProductNo`, (err1,results1,fields1)=>{
      if (err1) console.log(err1);

      // Query suppliers
      db.query(`Select * from tbluser join tblsupplier on tbluser.intuserid = tblsupplier.intuserid where intstatus = 1`, (err2,results2,fields2)=>{
        if (err2) console.log(err2);

        // Query products
        db.query(`Select * from tblproductlist join tblProductBrand on tblProductList.intBrandNo = tblProductBrand.intBrandNo where tblProductList.intstatus = 1`, (err3,results3,fields3)=>{
          if (err3) console.log(err3);

          // Query uom
          db.query(`Select * from tbluom where intstatus = 1`, (err4,results4,fields4)=>{
            if (err4) console.log(err4);

            // Query productstock last record
            db.query(`Select * from tblproductstock order by intproductquantityno desc limit 1`, (err5,results5,fields5)=>{
              if (err5) console.log(err5);

              // query product inventory last record
              db.query(`Select * from tblproductinventory order by intinventoryno desc limit 1`, (err6,results6,fields6)=>{
                if (err6) console.log(err6);

                // query inventory transaction last record
                db.query(`Select * from tblinventorytransactions order by inttransactionid desc limit 1`, (err7,results7,fields7)=>{
                  if (err7) console.log(err7);

                  res.render('admin-inventory/views/stock', {re: results1, tbl_q: results5, tbl_i: results6, products: results3, uom: results4, suppliers: results2, transact: results7 });

                });



              });
            });

          });
        });
      });

    });
});

router.post('/addStock', (req,res)=>{
  // Change to transactions

  db.query(`Insert into tblProductInventory(intInventoryNo, intProductNo, intUserID, productSRP, productPrice, intUomNo, intSize) values ("${req.body.add_ino}", "${req.body.add_pno}", "${req.body.add_sno}", ${req.body.add_srp}, ${req.body.add_price}, ${req.body.add_uom}, ${req.body.add_size})`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    db.query(`Insert into tblInventoryTransactions(intTransactionID, intInventoryNo, intUserID, intShelfNo, intBatchNo, intCriticalLimit, strTypeOfChanges) values ("${req.body.add_tno}", "${req.body.add_ino}", "1000", ${req.body.add_shelf}, ${req.body.add_batch}, ${req.body.add_critical}, "New Product Item")`, (err2,results2, fields2)=>{
      if (err2) console.log(err2);

      res.redirect('/inventory/allStocks');
    });
  })
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

router.post('/samp', (req,res)=>{
  console.log("test");

  res.send(req.body.name);
});

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

router.post('/searchExpired',(req,res)=>{
  var dates = (req.body.val).split("-");

  db.query(`Select * from tblproductStock
join tblproductinventory on tblproductstock.intinventoryno = tblproductstock.intinventoryno
join tblproductlist on tblproductlist.intproductno = tblproductinventory.intproductno
where tblproductstock.expirationDate between '${dates[0]}' and '${dates[1]}'`,(err1,results1,fiels1)=>{
  if (err1) console.log(err);
  //console.log(results1);
  res.send(results1);

});
});

router.post('/updateShelf',(req,res)=>{
  db.query(`Update tblProductInventory set intShelfNo = ${req.body.shelf} where intInventoryNo = ${req.body.ino}`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);

    var num = "1000";
    db.query(`Select * from tblInventoryTransactions order by intTransactionID desc limit 1`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);

      if (results2 == null || results2 == undefined){

      }else if (results2.length == 0){

      }else{
        num = parseInt(results2[0].intTransactionID) + 1;
      }

      db.query(`Insert into tblInventoryTransactions (intTransactionID, intInventoryNo, intUserID, intShelfNo, strTypeOfChanges) values ("${num}","${req.body.ino}", "1000",${req.body.shelf},"Price Changes")`, (err3,results3,fields3)=>{
        if (err3) console.log(err3);

        var url = `/inventory/productInventory?product=${req.body.pno}`;
        res.redirect(url);
      });

    });

  });
});

router.post('/update',(req,res)=>{
  db.query(`Update tblProductInventory set productSRP = ${req.body.srp}, productPrice =
    ${req.body.price}, intShelfNo = ${req.body.shelf}, intCriticalLimit = ${req.body.critical}, intPromoType = ${req.body.promotype} where intInventoryno = "${req.body.ino}"`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    var num = "1000";
    db.query(`Select * from tblInventoryTransactions order by intTransactionID desc limit 1`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);

      if (results2 == null || results2 == undefined){

      }else if (results2.length == 0){

      }else{
        num = parseInt(results2[0].intTransactionID) + 1;
      }

      db.query(`Insert into tblInventoryTransactions (intTransactionID, intInventoryNo, intUserID, productSRP, productPrice, intShelfNo, intCriticalLimit, intPromoType, strTypeOfChanges) values ("${num}","${req.body.ino}", "1000",${req.body.srp},${req.body.price}, ${req.body.shelf}, ${req.body.critical}, ${req.body.promotype},"${req.body.changes}")`, (err3,results3,fields3)=>{
        if (err3) console.log(err3);

        var url = `/inventory/productInventory?product=${req.body.pno}`;
        res.redirect(url);
      });

    })
  });
});


// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.inventory = router;
