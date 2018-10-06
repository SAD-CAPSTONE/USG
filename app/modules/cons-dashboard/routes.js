var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
const userTypeAuth = require('../cust-0extras/userTypeAuth');
const auth_cons = userTypeAuth.cons;

router.get('/consignor-dash', auth_cons, (req,res)=>{
  db.query(`SELECT SUM(tblorderdetails.intQuantity)QtySold, SUM(purchasePrice*tblorderdetails.intQuantity)TotalPrice FROM tblproductlist
  INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
  INNER JOIN tblorderdetails ON tblproductinventory.intInventoryNo= tblorderdetails.intInventoryNo
  INNER JOIN tblorder ON tblorderdetails.intOrderNo= tblorder.intOrderNo
  WHERE tblproductinventory.intUserID= ${req.user.intUserID} AND MONTH(tblorder.paymentDate)= MONTH(CURDATE())`,(err1,results1)=>{
  if (err1) console.log(err1)

    
    db.query(`SELECT SUM(tblproductinventory.intQuantity) FROM tblproductinventory WHERE tblproductinventory.intUserID = ${req.user.intUserID}`,(err1,results2)=>{
      if (err1) console.log(err1)


      db.query(`SELECT COUNT(intProductNo) cnt FROM tblproductinventory WHERE tblproductinventory.intUserID = ${req.user.intUserID}`,(err1,results3)=>{
        if (err1) console.log(err1)


            db.query(`SELECT * from tblproductinventory join tblproductlist on tblproductinventory.intProductNo = tblproductlist.intproductno
                      join tbluser on tbluser.intUserID = tblproductinventory.intUserID
                      join tblsubcategory on tblsubcategory.intSubCategoryNo = tblproductlist.intSubCategoryNo
                      join tblcategory on tblcategory.intcategoryno = tblsubcategory.intcategoryno
                      join tblsupplier on tblsupplier.intUserID = tblproductinventory.intUserID
                      where tbluser.intUserID = ${req.user.intUserID}`, (err1,results4)=>{
              if(err1) console.log(err1)
              
    console.log(results3)

  res.render('cons-dashboard/views/cons-dashboard', {
    re1: results1[0].cnt,
    re2: results2[0].cnt,
    re3: results3[0].cnt,
    re4: results4,
    moment: moment,
    name: "name"
  });
        })
      });
    })
  })
})

router.get('/payment', auth_cons, (req,res)=>{
  res.render('cons-dashboard/views/cons-payment');
});

router.get('/consignor-account', auth_cons, (req,res)=>{
  db.query(`
  SELECT * from tblsupplier join tbluser on tblsupplier.intUserID = tbluser.intUserID
  WHERE tbluser.intUserID = ${req.user.intUserID}`,(err1,results1)=>{
  if (err1) console.log(err1);
  res.render('cons-dashboard/views/cons-account', {re: results1});
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
  db.query(`
  SELECT * from tblpurchaseorderlist join tblreceiveorder on tblpurchaseorderlist.intpurchaseorderno = tblreceiveorder.intpurchaseorderno
  join tblpurchaseorder on tblpurchaseorderlist.intPurchaseOrderNo = tblpurchaseorder.intPurchaseOrderNo
  join tblsupplier on tblsupplier.intuserid = tblpurchaseorder.intsupplierid
  join tbluser on tbluser.intuserid = tblsupplier.intuserid
  where tbluser.intUserID = ${req.user.intUserID}`,(err1,results1)=>{
  if (err1) console.log(err1);
  db.query(`Select * from tblPurchaseOrder where intStatus = 1`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      db.query(`Select * from tblPurchaseOrder where intStatus = 0`,(err2,res2,fie2)=>{
      if(err2) console.log(err2);
      else{
        res.render('cons-dashboard/views/cons-orders',{re: results1, pending: res2, moment: moment});
        console.log(results1);
   }
   })
   }
   })
});
});

router.get('/returns', auth_cons, (req,res)=>{
  db.query(`
    SELECT * from tblpurchaseorder join tblreceiveorder on tblpurchaseorder.intpurchaseorderno = tblreceiveorder.intpurchaseorderno
    join tblreturnbadorders on tblreceiveorder.intreceiveorderno = tblreturnbadorders.intreceiveorderno
    join tblreceiveorderlist on tblreceiveorderlist.intReceiveOrderNo = tblreturnbadorders.intReceiveOrderNo
    join tblbadorderslist on tblbadorderslist.intbadordersno = tblreturnbadorders.intbadordersno
    join tblsupplier on tblsupplier.intuserid = tblpurchaseorder.intsupplierid
    join tbluser on tbluser.intuserid = tblsupplier.intuserid
    where tbluser.intUserID = ${req.user.intUserID}`,(err1,results1)=>{
    if (err1) console.log(err1);
    db.query(`Select * from tblpurchaseorderlist where intStatus = 2`,(err1,res1,fie1)=>{
      if(err1) console.log(err1);
        res.render('cons-dashboard/views/cons-returns', {re: results1, moment: moment});
        console.log(results1);
  });
});
});

exports.consignor = router;
