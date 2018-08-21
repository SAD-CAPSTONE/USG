const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');
const moment = require('moment');
const pageLimit = 2;
const orderQuery = `SELECT tblorder.intStatus AS Status, tblorder.*, Price.totalPrice FROM tbluser
  INNER JOIN tblorder ON tbluser.intUserID= tblorder.intUserID INNER JOIN (
	SELECT SUM(purchasePrice*intQuantity)totalPrice, tblorder.intOrderNo FROM tblorder
	INNER JOIN tblorderdetails ON tblorder.intOrderNo= tblorderdetails.intOrderNo
  GROUP BY tblorder.intOrderNo )Price ON tblorder.intOrderNo= Price.intOrderNo
  WHERE tblorder.intUserID = ? `

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
  res.render('cust-account/views/orders', {thisUser: req.user});
});
router.get('/messages', checkUser, (req,res)=>{
  res.render('cust-account/views/messages', {thisUser: req.user});
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

// ajax

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
          console.log(config)
          res.send({config: config, orders: results})
        });
      });
    });
  });
});

exports.account = router;
