const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();

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
  db.query(`SELECT tblorder.intStatus as Stats, tbluser.*,tblorder.* FROM
    tbluser JOIN tblorder on tbluser.intUserID =
    tblorder.intUserID WHERE tbluser.intuserID = ?`,[req.user.intUserID], (err1, results1)=>{
    if(err1) console.log(err1);
    res.render('cust-account/views/orders', {orders: results1,thisUser: req.user});
    console.log(results1);
    console.log(req.user.intUserID);  

  })
});
router.get('/payment', checkUser, (req,res)=>{
  res.render('cust-account/views/payment', {thisUser: req.user});
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
