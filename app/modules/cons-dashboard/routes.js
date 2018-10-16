var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
const userTypeAuth = require('../cust-0extras/userTypeAuth');
const auth_cons = userTypeAuth.cons;

router.get('/consignor-dash', auth_cons, (req,res)=>{
  db.query(`
    SELECT * from tblproductinventory
    join tblproductlist on tblproductinventory.intProductNo = tblproductlist.intproductno
    join tblUom on tblUom.intUomNo = tblproductinventory.intUomNo
    join tbluser on tbluser.intUserID = tblproductinventory.intUserID
    join tblsupplier on tblsupplier.intUserID = tblUser.intUserID
    where tbluser.intUserID = ${req.user.intUserID} and tblproductinventory.intStatus = 1`,(err1,results1)=>{
    if (err1) console.log(err1);
    res.render('cons-dashboard/views/cons-dashboard', {re: results1, moment: moment});

  });
});


router.get('/products', auth_cons, (req,res)=>{
  db.query(`
    SELECT * from tblproductinventory join tblproductlist on tblproductinventory.intProductNo = tblproductlist.intproductno
    join tbluser on tbluser.intUserID = tblproductinventory.intUserID
    join tblsubcategory on tblsubcategory.intSubCategoryNo = tblproductlist.intSubCategoryNo
    join tblcategory on tblcategory.intcategoryno = tblsubcategory.intcategoryno
    join tblsupplier on tblsupplier.intUserID = tblproductinventory.intUserID
    where tbluser.intUserID = ${req.user.intUserID}`,(err1,results1)=>{
    if (err1) console.log(err1);
    res.render('cons-dashboard/views/cons-products', {re: results1});
  });
});

router.get('/orders', auth_cons, (req,res)=>{
  // Pending Orders
  db.query(` Select * from tblpurchaseorder where intsupplierid
   = ${req.user.intUserID} and intStatus = 0`,(err1,results1,fie1)=>{
  if (err1) console.log(err1);
  else{

        res.render('cons-dashboard/views/cons-orders', {pending: results1, moment: moment});


  }

});
});

router.get('/viewOrder',(req,res)=>{
  db.query(`Select * from tblpurchaseorder join tblPurchaseOrderList on tblPurchaseOrder.intpurchaseorderno = tblPurchaseOrderList.intPurchaseOrderNo
    where tblPurchaseOrder.intPurchaseOrderNo = "${req.query.order}" and intsupplierid = "${req.user.intUserID}"`,(err1,res1,fie1)=>{
      if(err1) console.log(err1);
      else{
        db.query(`Select * from tblUser join tblsupplier on tblUser.intUserID = tblsupplier.intUserID
          where tblUser.intUserID = "${req.user.intUserID}"`,(err2,res2,fie2)=>{
            if(err2) console.log(err2);
            else{
              res.render('cons-dashboard/views/viewOrder', {re: res1, consignor: res2, moment: moment});
            }
          })
      }
    })
})

router.get('/receivedOrders',(req,res)=>{
  db.query(`Select * from tblpurchaseorder join tblreceiveorder on tblpurchaseorder.intPurchaseOrderNo
  = tblreceiveorder.intPurchaseOrderNo where tblPurchaseOrder.intsupplierid = "${req.user.intUserID}"`,(err2,res2,fie2)=>{
    if(err2) console.log(err2)
    else{
      res.render('cons-dashboard/views/cons-receivedOrders', {received: res2, moment: moment});

    }
  })
});

router.get('/viewReceivedOrder',(req,res)=>{
  db.query(`Select * from tblreceiveorder join tblreceiveorderlist on tblreceiveorder.intReceiveOrderNo
    = tblreceiveorderlist.intReceiveOrderNo where tblreceiveorder.intReceiveOrderNo = "${req.query.order}"`,(err1,res1,fie1)=>{
      if(err1) console.log(err1);
      else{
        db.query(`Select * from tblUser join tblSupplier on tblUser.intUserID = tblSupplier.intUserID
          where tblUser.intUserID = "${req.user.intUserID}"`,(err2,res2,fie2)=>{
            if(err2) console.log(err2);
            else{
              res.render('cons-dashboard/views/viewReceivedOrder',{re: res1, moment: moment, consignor: res2})
            }
          })
      }
    })
})

router.get('/returns', auth_cons, (req,res)=>{
  db.query(`
    Select * from tblReturnProducts
    where intsupplierid = ${req.user.intUserID}`,(err1,results1)=>{
    if (err1) console.log(err1);
    res.render('cons-dashboard/views/cons-returns', {re: results1, moment: moment});

  });
});

exports.consignor = router;
