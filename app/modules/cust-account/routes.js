const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');
const moment = require('moment');
const userTypeAuth = require('../cust-0extras/userTypeAuth');
const auth_cust = userTypeAuth.cust;
const pageLimit = 10;
const orderQuery = `SELECT tblorder.intStatus AS Status, IF(discountPrice IS NOT NULL, totalOriginalPrice-discountPrice, totalOriginalPrice)totalPrice,
  tblorder.* FROM tbluser INNER JOIN tblorder ON tbluser.intUserID= tblorder.intUserID INNER JOIN (
  SELECT SUM(purchasePrice*intQuantity)totalOriginalPrice, SUM(purchasePrice*discount*0.01*intQuantity)discountPrice,
  tblorder.intOrderNo FROM tblorder INNER JOIN tblorderdetails ON tblorder.intOrderNo= tblorderdetails.intOrderNo
  GROUP BY tblorder.intOrderNo )Price ON tblorder.intOrderNo= Price.intOrderNo WHERE tblorder.intUserID = ? `

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
function locations (req, res, next){
  db.query(`SELECT strLocation FROM tblshippingfee WHERE intStatus= 1 ORDER BY strLocation`, (err, results, fields) => {
    if (err) console.log(err);
    req.locations = results;
    return next();
  });
}

router.get('/dashboard', checkUser, auth_cust, contactDetails, locations, (req,res)=>{
  res.render('cust-account/views/dashboard', {
    thisUser: req.user,
    thisUserContact: req.contactDetails,
    locations: req.locations
  });
});
router.get('/orders', checkUser, auth_cust, (req,res)=>{
  res.render('cust-account/views/orders', {thisUser: req.user});
});
router.get('/messages', checkUser, auth_cust, (req,res)=>{
  db.query(`SELECT * FROM tblmessages WHERE intCustomerID = ? ORDER BY intMessageNo DESC`,[req.user.intUserID], (err, results, fields) => {
    if (err) console.log(err);
    results[0] ? results.map( obj => obj.historyDate = moment(obj.historyDate).format('MM - DD - YYYY') ) : 0;
    db.query(`UPDATE tblmessages SET seenStatus= 1 WHERE seenStatus= 0 AND intCustomerID= ?`,
      [req.user.intUserID], (err, update, fields) => {
      if (err) console.log(err);
      res.render('cust-account/views/messages', {
        thisUser: req.user,
        messages: results
      });
    });
  });
});

router.post('/dashboard/info', checkUser, auth_cust, (req,res)=>{
  db.beginTransaction(function(err) {
    let fname = req.body.fname, mname = req.body.mname, lname = req.body.lname, email = req.body.email,
    dsa = `${req.body.dsaCity} - ${req.body.dsa}`, dba = `${req.body.dbaCity} - ${req.body.dba}`,
    phone = req.body.phone.replace(/-/g, ""), mobile = req.body.mobile

    if (err) console.log(err);
    db.query(`UPDATE tbluser SET strFname= ?, strMname= ?, strLname= ?, strEmail= ? WHERE intUserID= ?`,
      [fname, mname, lname, email, req.user.intUserID], (err, results, fields) => {
      if (err) console.log(err);
      db.query(`UPDATE tblcustomer SET strShippingAddress= ?, strBillingAddress= ?, strCusPhoneNo= ?, strCusMobileNo= ? WHERE intUserID= ?`,
        [dsa, dba, phone, mobile, req.user.intUserID], (err, results, fields) => {
        if (err) console.log(err);
        db.commit(function(err) {
          if (err) console.log(err);
          res.redirect('/account/dashboard');
        });
      });
    });
  });
});

// ajax
router.post('/dashboard/checkInfo', checkUser, (req,res)=>{
  db.query(`SELECT strEmail FROM tbluser WHERE strEmail= ? AND intUserID!= ?`,
    [req.body.email, req.user.intUserID], (err, results, fields) => {
    if (err) console.log(err);
    if (results[0]){
      res.send({email: 'Email is taken'})
    }
    else{
      res.send({email: null})
    }
  });
});

router.post('/orders/load', checkUser, (req,res)=>{
  // ORDER BY intOrderNo DESC
  let config = {
    status: 'all',
    page: 1,
    total_pages: 1
  }
  config.page = req.body.page ?
    Number(req.body.page) ?
      parseInt(req.body.page)
      : 1
    : 1
  config.status = req.body.status ? req.body.status : 'all'

  let filterQuery = orderQuery;

  config.status ?
    config.status != 'all' ?
      filterQuery = filterQuery.concat(`AND intStatus = ${config.status} `) : 0
    : 0

  filterQuery = filterQuery.concat(`ORDER BY intOrderNo DESC `)

  db.beginTransaction(function(err) {
    if (err) console.log(err);
    db.query(`SELECT COUNT(C.intUserID)cnt FROM(${filterQuery})C`, [req.user.intUserID], function (err,  results, fields) {
      if (err) console.log(err);
      if(results[0]){
        config.total_pages =
          results[0].cnt >= pageLimit ?
            results[0].cnt % pageLimit ?
              Math.floor(results[0].cnt / pageLimit) + 1 :
            Math.floor(results[0].cnt / pageLimit)
          : 1
        config.page =
          config.page > config.total_pages ?
            config.total_pages :
            config.page < 1 ? 1 : config.page
        config.page =
          config.page > config.total_pages ?
            config.total_pages :
            config.page < 1 ?
              1 : config.page
      }
      // limit
      let start = 0;
      for(let i=0; i<config.page-1; i++){
        start += pageLimit;
      }
      limitQuery = filterQuery.concat(`LIMIT ${start},${pageLimit} `);
      // console.log(limitQuery)
      db.query(limitQuery, [req.user.intUserID], (err,results,fields)=>{
        if (err) console.log(err);
        results[0] ? results.map( obj => obj.dateOrdered = moment(obj.dateOrdered).format('LL') ) : 0;
        results[0] ? results.map( obj => obj.totalPrice = priceFormat(obj.totalPrice.toFixed(2)) ) : 0;
        db.commit(function(err) {
          if (err) console.log(err);
          res.send({config: config, orders: results})
        });
      });
    });
  });
});

exports.account = router;
