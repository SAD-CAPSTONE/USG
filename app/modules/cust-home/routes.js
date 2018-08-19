const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');

function popularProducts(req,res,next){
  /*Most Popular Products;
  *(tblproductlist)*(tblproductbrand)*(tblproductinventory)*(tblorderdetails)*(tblproductreview)*/
  db.query(`SELECT B.*, ROUND(AVG(Review.intStars),1)AS aveRating, COUNT(Review.intProductReviewNo)AS cntRating,
  COUNT(Review.strReview)AS cntReview FROM(SELECT A.*, Orders.intOrderDetailsNo, COUNT(Orders.intOrderDetailsNo)AS OrderCNT FROM(
  SELECT tblproductlist.*, Inv.intInventoryNo, Inv.intStatus As InvStatus, Inv.productPrice, Inv.intQuantity, Brand.strBrand, stock FROM tblproductlist
  INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
  INNER JOIN (SELECT *, (intQuantity - intReservedItems)stock FROM tblproductinventory)Inv ON tblproductlist.intProductNo= Inv.intProductNo
  WHERE Brand.intStatus= 1)A LEFT JOIN (SELECT * FROM tblorderdetails)Orders ON A.intInventoryNo= Orders.intInventoryNo GROUP BY A.intProductNo)B
  LEFT JOIN (SELECT * FROM tblproductreview)Review ON B.intProductNo = Review.intProductNo
  GROUP BY B.intProductNo ORDER BY OrderCNT DESC LIMIT 10`, function (err,  results, fields) {
    if (err) console.log(err);
    results[0] ? results.map( obj => obj.productPrice = priceFormat(obj.productPrice.toFixed(2)) ) : 0
    req.popularProducts= results;
    return next();
  });
}
function newProducts(req,res,next){
  /*New Popular Products;
  *(tblproductlist)*(tblproductbrand)*(tblproductinventory)*(tblproductreview)*/
  db.query(`SELECT A.*, ROUND(AVG(Review.intStars),1)AS aveRating, COUNT(Review.intProductReviewNo)AS cntRating, COUNT(Review.strReview)AS cntReview FROM(
  SELECT tblproductlist.*, Inv.intInventoryNo, Inv.intStatus As InvStatus, Inv.productPrice, Inv.intQuantity, Brand.strBrand, stock FROM tblproductlist
  INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
  INNER JOIN (SELECT *, (intQuantity - intReservedItems)stock FROM tblproductinventory)Inv ON tblproductlist.intProductNo= Inv.intProductNo
  WHERE Brand.intStatus= 1 GROUP BY tblproductlist.intProductNo)A
  LEFT JOIN (SELECT * FROM tblproductreview)Review ON A.intProductNo = Review.intProductNo
  GROUP BY A.intProductNo ORDER BY intProductNo DESC LIMIT 10`, function (err,  results, fields) {
    if (err) console.log(err);
    results[0] ? results.map( obj => obj.productPrice = priceFormat(obj.productPrice.toFixed(2)) ) : 0
    req.newProducts= results;
    return next();
  });
}

router.get('/', popularProducts, newProducts, (req,res)=>{
  console.log(`??????????? Session Values: ${JSON.stringify(req.user, null, 2)}`);
  // console.log(`??????????? Modal Cart Values: ${JSON.stringify(req.session.modal_cart, null, 2)}`);
  // console.log(`??????????? Cart List Values: ${JSON.stringify(req.session.cart, null, 2)}`);
  // req.session.modal_cart = null;
  // req.session.cart = null;
  // console.log(JSON.stringify(req.session.cart, null, 2));
  res.render('cust-home/views/index', {thisUser: req.user, popularProducts: req.popularProducts, newProducts: req.newProducts});
});
router.get('/faq', (req,res)=>{
  res.render('cust-home/views/faq', {thisUser: req.user});
});

exports.home = router;
