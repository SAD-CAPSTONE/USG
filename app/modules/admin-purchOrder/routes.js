var router = require('express').Router();
var db = require('../../lib/database')();
//var moment = require('moment');

router.get('/', (req,res)=>{

  res.render('admin-purchOrder/views/purchaseOrder');

});

router.get('/form', (req,res)=>{
  //var test = "AD1";
  //var test2 = test.substr(2);

  db.query(`Select * from tblPurchaseOrder`, (err,results,fields)=>{
    if (err) console.log(err);
    db.query(`Select * from tblSupplier join tblUser on tblSupplier.intUserID = tblUser.intUserID where intStatus = 1`, (erra,resultsa,fieldsa)=>{
      if(err) console.log(err);

      res.render('admin-purchOrder/views/purchaseOrderForm',  {re: results, su: resultsa});
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

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.purchaseOrder = router;
