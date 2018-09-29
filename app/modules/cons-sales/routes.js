const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');
const userTypeAuth = require('../cust-0extras/userTypeAuth');
const auth_cons = userTypeAuth.cons;
const pageLimit = 10;

function sizeString(obj){
  let curSize = ``;
  obj.strVariant ? curSize+= `${obj.strVariant}`: 0
  obj.strVariant && obj.intSize ? curSize+= ` - `: 0
  obj.intSize ? curSize+= `${obj.intSize}`: 0
  obj.strUnitName ? curSize+= ` ${obj.strUnitName}`: 0
  return curSize;
}

function checkUser(req, res, next){
  if(!req.user){
    res.redirect('/login');
  }
  else{
    return next();
  }
}
function monthsAvailable(req,res,next){
  db.query(`SELECT MONTH(tblorderhistory.historyDate)month, monthname(tblorderhistory.historyDate)monthname FROM tblproductlist
    INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
    INNER JOIN tblorderdetails ON tblproductinventory.intInventoryNo= tblorderdetails.intInventoryNo
    INNER JOIN tblorder ON tblorderdetails.intOrderNo= tblorder.intOrderNo
    INNER JOIN tblorderhistory ON tblorderhistory.intOrderNo= tblorder.intOrderNo
    WHERE tblproductinventory.intUserID= ? AND tblorderhistory.intStatus= 3 GROUP BY month`,
    [req.user.intUserID], (err, results, fields) => {
    if (err) console.log(err);
    req.monthsAvailable= results;
    return next();
  });
}
function yearsAvailable(req,res,next){
  db.query(`SELECT YEAR(tblorderhistory.historyDate)year FROM tblproductlist
    INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
    INNER JOIN tblorderdetails ON tblproductinventory.intInventoryNo= tblorderdetails.intInventoryNo
    INNER JOIN tblorder ON tblorderdetails.intOrderNo= tblorder.intOrderNo
    INNER JOIN tblorderhistory ON tblorderhistory.intOrderNo= tblorder.intOrderNo
    WHERE tblproductinventory.intUserID= ? AND tblorderhistory.intStatus= 3 GROUP BY year`,
    [req.user.intUserID], (err, results, fields) => {
    if (err) console.log(err);
    req.yearsAvailable= results;
    return next();
  });
}

router.get('/sales', checkUser, auth_cons, (req,res)=>{
  res.render('cons-sales/views/index',{
    thisUser: req.user
  });
});

router.post('/loadSales', monthsAvailable, yearsAvailable, (req,res)=>{
  let sCountCurrent, sCountPrevious, sProducts, sInv, sDate,
  config = {
    filterBy: req.body.filterBy,
    curSel: 'This Week',
    prevSel: 'Previous Week',
    months: req.monthsAvailable,
    years: req.yearsAvailable,
    page: 1
  }

  switch (config.filterBy) {
    case 'thisWeek':
      sDate = 'WEEK(tblorderhistory.historyDate)= WEEK(CURDATE())';
      break;
    case 'thisMonth':
      sDate = 'MONTH(tblorderhistory.historyDate)= MONTH(CURDATE())';
      config.curSel = 'This Month';
      config.prevSel = 'Previous Month';
      break;
    case 'thisYear':
      sDate = 'YEAR(tblorderhistory.historyDate)= YEAR(CURDATE())';
      config.curSel = 'This Year';
      config.prevSel = 'Previous Year';
      break;
    default:
      sDate = `MONTH(tblorderhistory.historyDate)= ${req.body.month} AND MONTH(tblorderhistory.historyDate)= ${req.body.year}`;
      break;
  }

  fsalesCountCurrent();
  function fsalesCountCurrent(){
    db.query(`SELECT SUM(tblorderdetails.intQuantity)QtySold, SUM(purchasePrice*tblorderdetails.intQuantity)TotalPrice FROM tblproductlist
      INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
      INNER JOIN tblorderdetails ON tblproductinventory.intInventoryNo= tblorderdetails.intInventoryNo
      INNER JOIN tblorder ON tblorderdetails.intOrderNo= tblorder.intOrderNo INNER JOIN tblorderhistory ON tblorderhistory.intOrderNo= tblorder.intOrderNo
      WHERE tblproductinventory.intUserID= ? AND tblorderhistory.intStatus= 3 AND ${sDate}`,
      [req.user.intUserID], (err, salesCountCurrent, fields) => {
      if (err) console.log(err);
      if (salesCountCurrent[0].TotalPrice){
        salesCountCurrent[0].TotalPrice = priceFormat(salesCountCurrent[0].TotalPrice.toFixed(2));
      }
      sCountCurrent = salesCountCurrent
      fsalesCountPrevious();
    });
  }
  function fsalesCountPrevious(){
    db.query(`SELECT SUM(tblorderdetails.intQuantity)QtySold, SUM(purchasePrice*tblorderdetails.intQuantity)TotalPrice FROM tblproductlist
      INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
      INNER JOIN tblorderdetails ON tblproductinventory.intInventoryNo= tblorderdetails.intInventoryNo
      INNER JOIN tblorder ON tblorderdetails.intOrderNo= tblorder.intOrderNo INNER JOIN tblorderhistory ON tblorderhistory.intOrderNo= tblorder.intOrderNo
      WHERE tblproductinventory.intUserID= ? AND tblorderhistory.intStatus= 3 AND ${sDate}-1`,
      [req.user.intUserID], (err, salesCountPrevious, fields) => {
      if (err) console.log(err);
      console.log(salesCountPrevious)
      if (salesCountPrevious[0].TotalPrice){
        salesCountPrevious[0].TotalPrice = priceFormat(salesCountPrevious[0].TotalPrice.toFixed(2));
      }
      sCountPrevious = salesCountPrevious
      fsalesProducts()
    });
  }
  function fsalesProducts(){
    db.query(`SELECT tblproductlist.intProductNo, tblproductbrand.strBrand, tblproductlist.strProductName, tblproductlist.strProductPicture, tblorderhistory.historyDate,
      SUM(tblorderdetails.intQuantity)QtySold, SUM(purchasePrice*tblorderdetails.intQuantity)TotalPrice FROM tblproductlist
      INNER JOIN tblproductbrand ON tblproductlist.intBrandNo= tblproductbrand.intBrandNo
      INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
      INNER JOIN tblorderdetails ON tblproductinventory.intInventoryNo= tblorderdetails.intInventoryNo
      INNER JOIN tblorder ON tblorderdetails.intOrderNo= tblorder.intOrderNo
      INNER JOIN tblorderhistory ON tblorderhistory.intOrderNo= tblorder.intOrderNo
      WHERE tblproductinventory.intUserID= ? AND tblorderhistory.intStatus= 3 AND ${sDate}
      GROUP BY tblproductlist.intProductNo ORDER BY tblproductlist.intProductNo`,
      [req.user.intUserID], (err, salesProducts, fields) => {
      if (err) console.log(err);
      salesProducts.forEach((obj)=>{
        obj.TotalPrice = priceFormat(obj.TotalPrice.toFixed(2));
      });
      sProducts = salesProducts
      fsalesInv();
    });
  }
  function fsalesInv(){
    db.query(`SELECT tblproductlist.intProductNo, tblproductinventory.strVariant, tblproductinventory.intSize, tbluom.strUnitName, tblorderdetails.purchasePrice,
      tblorderhistory.historyDate, SUM(tblorderdetails.intQuantity)QtySold, SUM(purchasePrice*tblorderdetails.intQuantity)TotalPrice FROM tblproductlist
      INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
      INNER JOIN tbluom ON tblproductinventory.intUOMno= tbluom.intUOMno
      INNER JOIN tblorderdetails ON tblproductinventory.intInventoryNo= tblorderdetails.intInventoryNo
      INNER JOIN tblorder ON tblorderdetails.intOrderNo= tblorder.intOrderNo
      INNER JOIN tblorderhistory ON tblorderhistory.intOrderNo= tblorder.intOrderNo
      WHERE tblproductinventory.intUserID= ? AND tblorderhistory.intStatus= 3 AND ${sDate}
      GROUP BY tblproductinventory.intInventoryNo ORDER BY tblproductlist.intProductNo`,
      [req.user.intUserID], (err, salesInv, fields) => {
      if (err) console.log(err);
      salesInv.forEach((obj)=>{
        obj.curSize = sizeString(obj);
        obj.TotalPrice = priceFormat(obj.TotalPrice.toFixed(2));
        obj.purchasePrice = priceFormat(obj.purchasePrice.toFixed(2));
      });
      sInv = salesInv
      res.send({
        salesCountCurrent: sCountCurrent,
        salesCountPrevious: sCountPrevious,
        salesProducts: sProducts,
        salesInv: sInv,
        config: config
      });
    });
  }
});


exports.consignor = router;
