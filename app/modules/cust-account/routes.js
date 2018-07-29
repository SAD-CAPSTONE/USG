const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');

function checkUser(req, res, next){
  if(!req.user){
    req.session.pendRoute = 1;
    req.flash('regSuccess', 'Login to view Account Information');
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

router.get('/dashboard', checkUser, contactDetails, (req,res)=>{
  res.render('cust-account/views/dashboard', {thisUser: req.user, thisUserContact: req.contactDetails});
});
router.get('/orders', checkUser, (req,res)=>{
  db.query(`SELECT tblorder.intStatus AS Stats, tbluser.*, tblorder.*, Price.totalPrice FROM tbluser
    INNER JOIN tblorder ON tbluser.intUserID= tblorder.intUserID
    INNER JOIN (
    	SELECT SUM(purchasePrice*intQuantity)totalPrice, tblorder.intOrderNo FROM tblorder
    	INNER JOIN tblorderdetails ON tblorder.intOrderNo= tblorderdetails.intOrderNo
      GROUP BY tblorder.intOrderNo )Price ON tblorder.intOrderNo= Price.intOrderNo
    WHERE tbluser.intuserID = '1002' ORDER BY intOrderNo DESC`,[req.user.intUserID], (err1, results)=>{
    if(err1) console.log(err1);
    results[0] ? results.map( obj => obj.dateOrdered = obj.dateOrdered.toDateString("en-US").slice(4, 15) ) : 0;
    results[0] ? results.map( obj => obj.totalPrice = priceFormat(obj.totalPrice.toFixed(2)) ) : 0
    res.render('cust-account/views/orders', {thisUser: req.user, orders: results});
  })
});
router.get('/cancellations', checkUser, (req,res)=>{
  res.render('cust-account/views/cancellations', {thisUser: req.user});
});

router.post('/dashboard/info', checkUser, (req,res)=>{
  db.beginTransaction(function(err) {
    if (err) console.log(err);
    db.query(`UPDATE tbluser SET strFname= ?, strMname= ?, strLname= ?, strEmail= ? WHERE intUserID= ?`,
      [req.body.fname, req.body.mname, req.body.lname, req.body.email, req.user.intUserID], (err, results, fields) => {
      if (err) console.log(err);
      db.query(`UPDATE tblcustomer SET strShippingAddress= ?, strBillingAddress= ?, strCusPhoneNo= ?, strCusMobileNo= ? WHERE intUserID= ?`,
        [req.body.dsa, req.body.dba, req.body.phone, `0${req.body.mobile}`, req.user.intUserID], (err, results, fields) => {
        if (err) console.log(err);
        db.commit(function(err) {
          if (err) console.log(err);
          res.redirect('/account/dashboard');
        });
      });
    });
  });
});

exports.account = router;
