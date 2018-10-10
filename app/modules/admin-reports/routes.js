const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const moment = require('moment');
const priceFormat = require('../cust-0extras/priceFormat');
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function now(req,res,next){
  db.query(`SELECT curdate()currentDate, YEAR(curdate())currentYear`, (err, results, fields) => {
    if (err) console.log(err);
    results.map( obj => obj.currentDate = moment(obj.currentDate).format('YYYY-MM-DD') );
    req.now= results[0];
    return next();
  });
}
function yearsAvailable(req,res,next){
  db.query(`SELECT YEAR(tblsales.transactionDate)year FROM tblsales GROUP BY year`, (err, results, fields) => {
    if (err) console.log(err);
    req.yearsAvailable= results;
    return next();
  });
}
function datesAvailable(req,res,next){
  db.query(`SELECT (transactionDate)date FROM tblsales GROUP BY date`, (err, results, fields) => {
    if (err) console.log(err);
    if (results[0]){
      results.map( obj => obj.date = moment(obj.date).format('YYYY-MM-DD') );
    }
    req.datesAvailable= results;
    return next();
  });
}
router.get('/', (req,res)=>{
  res.render('admin-reports/views/reports');
});

router.get('/sales',(req,res)=>{
  res.render('admin-reports/views/sales');
});

router.get('/reviewMonthlySales', yearsAvailable, (req,res)=>{
  db.query(`SELECT DATE(transactionDate)date, SUM(amount)total, SUM(intQuantity)qty
    FROM tblsales INNER JOIN tblorderdetails USING(intOrderNo)
    WHERE tblsales.intStatus= 1 AND monthname(transactionDate) = ? AND YEAR(transactionDate) = ?
    GROUP BY date`, [req.query.month, req.query.year], (err, results, fields) => {
    if (err) console.log(err);
    headerMonth = monthNames.reduce((temp,data)=>{
      return data == req.query.month ? data : temp;
    },null);
    headerYear = req.yearsAvailable.reduce((temp,data)=>{
      return data.year == req.query.year ? data.year : temp;
    },null);
    if (results[0]){
      results.forEach((obj)=>{
        obj.total = priceFormat(obj.total.toFixed(2));
        obj.date = moment(obj.date).format('MM/DD/YYYY');
      })
    }
    if (headerMonth && headerYear){
      res.render('admin-reports/views/reviewMonthlySales',{
        sales: results,
        headerMonth: headerMonth,
        headerYear: headerYear
      });
    }
    else {
      res.redirect('/reports/sales')
    }
  });
})
router.get('/reviewDailySales', datesAvailable, (req,res)=>{
  db.query(`SELECT intProductNo, strBrand, strProductName, SUM(tblorderdetails.intQuantity)qty,
    SUM(tblorderdetails.purchasePrice*tblorderdetails.intQuantity)total FROM tblsales
    INNER JOIN tblorderdetails USING(intOrderNo)
    INNER JOIN tblproductinventory USING(intInventoryNo)
    INNER JOIN tblproductlist USING(intProductNo)
    INNER JOIN tblproductbrand USING(intBrandNo)
    WHERE tblsales.intStatus = 1 AND date(transactionDate) = ?
    GROUP BY intProductNo`, [req.query.date], (err, results, fields) => {
    if (err) console.log(err);
    headerDate = req.datesAvailable.reduce((temp,data)=>{
      return data.date == req.query.date ? data.date : temp;
    },null);
    if (results[0]){
      results.forEach((obj)=>{
        obj.total = priceFormat(obj.total.toFixed(2));
        obj.date = moment(obj.date).format('MM/DD/YYYY');
      })
    }
    if (headerDate){
      res.render('admin-reports/views/reviewDailySales',{
        sales: results,
        date: headerDate
      });
    }
    else {
      res.redirect('/reports/sales')
    }

  });
})

router.get('/inventory',(req,res)=>{
  res.render('admin-reports/views/inventory');
});

router.get('/damage',(req,res)=>{
  res.render('admin-reports/views/damage');
});

router.get('/customer',(req,res)=>{
  res.render('admin-reports/views/customer');
});

// ajax
router.post('/sales/load', now, yearsAvailable, (req,res)=>{
  let annualDate, dailyDate,
  config = {
    annual: req.now.currentYear,
    daily: req.now.currentDate,
    years: req.yearsAvailable
  }
  parseInt(req.body.annual) ?
    config.annual = req.body.annual : 0
  parseInt(req.body.daily) ?
    config.daily = req.body.daily : 0

  db.query(`SELECT MONTH(transactionDate)month, MONTHNAME(transactionDate)monthname, SUM(amount)total, SUM(intQuantity)qty
    FROM tblsales INNER JOIN tblorderdetails USING(intOrderNo)
    WHERE tblsales.intStatus= 1 AND YEAR(transactionDate) = ? GROUP BY monthname`,
    [config.annual], (err, annualResults, fields) => {
    if (err) console.log(err);
    if (annualResults[0]){
      annualResults.forEach((obj)=>{
        obj.total = priceFormat(obj.total.toFixed(2));
      })
    }
    db.query(`SELECT intProductNo, strBrand, strProductName, SUM(tblorderdetails.intQuantity)qty,
      SUM(tblorderdetails.purchasePrice*tblorderdetails.intQuantity)total FROM tblsales
      INNER JOIN tblorderdetails USING(intOrderNo) INNER JOIN tblproductinventory USING(intInventoryNo)
      INNER JOIN tblproductlist USING(intProductNo) INNER JOIN tblproductbrand USING(intBrandNo)
      WHERE tblsales.intStatus = 1 AND date(transactionDate) = ? GROUP BY intProductNo ORDER BY total DESC LIMIT 7`,
      [config.daily], (err, dailyResults, fields) => {
      if (err) console.log(err);
      if (dailyResults[0]){
        dailyResults.forEach((obj)=>{
          obj.total = priceFormat(obj.total.toFixed(2));
        })
      }
      res.send({
        config: config,
        annual: annualResults,
        daily: dailyResults
      })
    });
  });

})

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.reports = router;
