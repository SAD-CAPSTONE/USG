const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const firstID = 1000;
const priceFormat = require('../cust-0extras/priceFormat');

function newOrderNo (req, res, next){
  db.query(`SELECT * FROM tblorder ORDER BY intOrderNo DESC LIMIT 1`, (err, results, fields) => {
    if (err) console.log(err);
    req.newOrderNo = results[0] ? parseInt(results[0].intOrderNo)+1 : firstID;
    return next();
  });
}
function newOrderDetailsNo (req, res, next){
  db.query(`SELECT * FROM tblorderdetails ORDER BY intOrderDetailsNo DESC LIMIT 1`, (err, results, fields) => {
    if (err) console.log(err);
    req.newOrderDetailsNo = results[0] ? parseInt(results[0].intOrderDetailsNo)+1 : firstID;
    return next();
  });
}

function checkUser (req, res, next){
  if(!req.user){
    req.session.pendRoute = 2;
    req.flash('regSuccess', 'Login to proceed to Checkout');
    res.redirect('/login');
  }
  else{
    req.session.pendRoute = 0;
    return next();
  }
}
function contactDetails (req, res, next){
  db.query(`SELECT * FROM tbluser
    INNER JOIN tblcustomer ON tbluser.intUserID= tblcustomer.intUserID
    WHERE tbluser.intUserID= ?`,[req.user.intUserID], (err, results, fields) => {
    if (err) console.log(err);
    req.contactDetails = results[0];
    return next();
  });
}
function checkOrder (req, res, next){
  if (!req.user){
    res.redirect('/home');
  }
  else{
    db.beginTransaction(function(err) {
      if (err) console.log(err);
      db.query(`SELECT * FROM tblorder WHERE intOrderNo= ? AND intStatus IS NULL AND intUserID= ?`,[req.params.orderNo, req.user.intUserID], (err,results,fields)=> {
        if (err) console.log(err);
        if (results[0]){
          req.checkOrder = results[0].intPaymentMethod;
          db.query(`UPDATE tblorder SET intStatus= 0 WHERE intOrderNo= ?`,[req.params.orderNo], (err,results,fields)=>{
            if (err) console.log(err);
            db.commit(function(err) {
              if (err) console.log(err);
              return next();
            });
          });
        }
        else{
          db.commit(function(err) {
            if (err) console.log(err);
            res.redirect('/summary/success')
          });
        }
      });
    });
  }
}
function orderTotal (req, res, next){
  db.query(`SELECT SUM(purchasePrice*intQuantity)totalPrice FROM tblorder
  INNER JOIN tblorderdetails ON tblorder.intOrderNo= tblorderdetails.intOrderNo
  WHERE tblorder.intOrderNo= ?`,[req.params.orderNo], (err, results, fields) => {
    if (err) console.log(err);
    results[0] ? results.map( obj => obj.totalPrice = priceFormat(obj.totalPrice.toFixed(2)) ) : 0
    req.orderTotal = results[0];
    return next();
  });
}

router.get('/checkout', checkUser, contactDetails, (req,res)=>{
  res.render('cust-summary/views/checkout', {thisUser: req.user, thisUserContact: req.contactDetails});
});
router.get('/order', (req,res)=>{
  res.render('cust-summary/views/order', {thisUser: req.user});
});
router.get('/previous', (req,res)=>{
  res.render('cust-summary/views/previous', {thisUser: req.user});
});
router.get('/success/:orderNo', checkOrder, (req,res)=>{
  res.render('cust-summary/views/orderSuccess', {
    thisUser: req.user,
    OrderNumber: req.params.orderNo,
    checkOrder: req.checkOrder
  });
});
router.get('/voucher/:orderNo', orderTotal, (req,res)=>{
  if (!req.user){
    res.send('none')
  }
  else{
    db.query(`SELECT * FROM tblorder
      INNER JOIN tbluser ON tblorder.intUserID= tbluser.intUserID
      WHERE intOrderNo= ? AND tbluser.intUserID= ? AND (intStatus= 0 OR intStatus= 1 OR intStatus= 2)`,[req.params.orderNo, req.user.intUserID],(err,results,fields)=>{
      if (err) console.log(err);
      console.log(results);
      if (results[0]){
        results.map( obj => obj.paymentDue = obj.paymentDue.toDateString("en-US").slice(4, 15) );
        res.send({order: results[0], orderTotal: req.orderTotal.totalPrice})
      }
      else{
        res.send('none')
      }
    });
  }
})

router.post('/checkout', checkUser, contactDetails, newOrderNo, newOrderDetailsNo, (req,res)=>{
  db.beginTransaction(function(err) {
    if (err) console.log(err);
    let thisOrderNo = req.newOrderNo;
    db.query(`INSERT INTO tblorder (intOrderNo, intUserID, intPaymentMethod, strShippingAddress, strBillingAddress, paymentDue)
      VALUES (?,?,?,?,?,CURDATE() + INTERVAL 7 DAY)`,[thisOrderNo, req.user.intUserID, req.body.paymentMethod, req.contactDetails.strShippingAddress, req.contactDetails.strBillingAddress, ], (err, results, fields) => {
      if (err) console.log(err);
      function multiInsert(i){
        let cart = req.session.cart;
        db.query(`INSERT INTO tblorderdetails (intOrderDetailsNo, intOrderNo, intInventoryNo, intStatus, purchasePrice, intQuantity)
          VALUES (?,?,?,?,?,?)`,[req.newOrderDetailsNo + i, thisOrderNo, cart[i].inv, 1, cart[i].curPrice, cart[i].curQty], (err, results, fields) => {
          if (err) console.log(err);
          ++i;
          if (cart.length > i){
            multiInsert(i);
          }
          else{
            db.commit(function(err) {
              if (err) console.log(err);
              req.session.cart = null;
              res.redirect(`/summary/success/${thisOrderNo}`);
            });
          }
        });
      }
      req.session.cart ? multiInsert(0) : 0;
    });
  });
});
router.post('/checkout/address', checkUser, (req,res)=>{
  db.query(`UPDATE tblcustomer SET strShippingAddress= ?, strBillingAddress= ? WHERE intUserID= ?`,
    [req.body.sa, req.body.ba, req.user.intUserID], (err, results, fields) => {
    if (err) console.log(err);
    res.redirect('/summary/checkout');
  });
})

exports.summary = router;
