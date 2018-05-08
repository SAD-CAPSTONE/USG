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
        res.send('success');

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

  // ERROR IN THIS AREA (req.query)
  console.log(req.query.name);

/*  db.query(`
    Select * from tblproductinventory join tblproductlist on tblproductinventory.intProductno  = tblproductlist.intproductno
    join tblproductbrand on tblproductinventory.intbrandno = tblproductbrand.intbrandno
    join tbluser on tbluser.intuserid = tblproductinventory.intuserid
    join tblsupplier on tblsupplier.intuserid = tblproductinventory.intuserid
    join tbluom on tbluom.intuomno = tblproductinventory.intuomno
    where tblproductinventory.intstatus = 1 and tblproductinventory.int`, (err1,results1,fields1)=>{

    if (err1) console.log(err1);

    db.query(`Select * from tblProductInventory order by intInventoryno desc limit 1`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);

      db.query(`Select * from tbluom`, (err3,results3,fields3)=>{
        if (err3) console.log(err3);

        db.query(`Select * from tblSupplier join tblUser on tblSupplier.intUserID = tblUser.intUserID where intStatus = 1`, (err4,results4,fields4)=>{
          if (err4) console.log(err4);
          res.render('admin-inventory/views/productInventory', {re: results1, moment: moment, list: results2, uom: results3, su: results4});

        });

      });

    });
  });
*/

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
  db.query(`Insert into tblProductInventory (intInventoryNo, intProductNo, intUserID, productSRP, intUOMno, intSize, productPrice) values ("${req.body.add_inventoryno}","${req.body.add_productno}", "${req.body.add_sno}", ${req.body.add_srp}, "${req.body.add_uom}", ${req.body.add_size}, ${req.body.add_price})`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    db.query(`Select * from tblinventorytransactions order by intTransactionID desc limit 1`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);


      if (results2[0] == 'null' || results2[0] == 'undefined' || results2[0].length == 0){
        // db.query(`Insert into tblinventorytransactions (intTransactionID, )`)

      }
    });
  });
});

router.get('/sample', (req,res)=>{

  function query1(callback){
    setTimeout(function(){
      console.log("Test1");
    }, 1000);
  }
  function query2(callback){
    setTimeout(function(){
      console.log("Test2");
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
          console.log('Inside parallel');
         // render([dataObject.data1, dataObject.data2, dataObject.data3]);
         // var profile = req.session.user;
         //  res.render('businessman/views/transactionList', {profile: profile,event: dataObject.data1, item: dataObject.data2, service: dataObject.data3, user: `${req.session.user.strProviderFName}`+" "+ `${req.session.user.strProviderLName}`});
      });

});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.inventory = router;
