const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const firstID = 1000;

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

router.get('/checkout', checkUser, contactDetails, (req,res)=>{
  res.render('cust-summary/views/checkout', {thisUser: req.user, thisUserContact: req.contactDetails});
});
router.get('/order', (req,res)=>{
  res.render('cust-summary/views/order', {thisUser: req.user});
});
router.get('/previous', (req,res)=>{
  res.render('cust-summary/views/previous', {thisUser: req.user});
});

router.post('/checkout', checkUser, contactDetails, newOrderNo, newOrderDetailsNo, (req,res)=>{
  db.beginTransaction(function(err) {
    if (err) console.log(err);
    db.query(`INSERT INTO tblorder (intOrderNo, intUserID, intStatus, intPaymentMethod, strShippingAddress, strBillingAddress)
      VALUES (?,?,?,?,?,?)`,[req.newOrderNo, req.user.intUserID, 0, req.body.paymentMethod, req.contactDetails.strShippingAddress, req.contactDetails.strBillingAddress], (err, results, fields) => {
      if (err) console.log(err);
      function multiInsert(i){
        let cart = req.session.cart;
        db.query(`INSERT INTO tblorderdetails (intOrderDetailsNo, intOrderNo, intInventoryNo, intStatus, purchasePrice, intQuantity)
          VALUES (?,?,?,?,?,?)`,[req.newOrderDetailsNo + i, req.newOrderNo, cart[i].inv, 1, cart[i].curPrice, cart[i].curQty], (err, results, fields) => {
          if (err) console.log(err);
          ++i;
          if (cart.length > i){
            multiInsert(i);
          }
          else{
            db.commit(function(err) {
              if (err) console.log(err);
              req.session.cart = null;
              res.redirect('/home');
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
