const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');
const moment = require('moment');

function popularProducts(req,res,next){
  /*Most Popular Products;
  *(tblproductlist)*(tblproductbrand)*(tblproductinventory)*(tblorderdetails)*(tblproductreview)*/
  db.query(`SELECT B.*, ROUND(AVG(Review.intStars),1)AS aveRating, COUNT(Review.intProductReviewNo)AS cntRating,
    COUNT(Review.strReview)AS cntReview, IF(B.productRecorded > DATE_SUB(curdate(), INTERVAL 2 WEEK), 1, 0)newProduct FROM
    (
    	SELECT A.*, OrderCNT FROM
    	(
    		SELECT tblproductlist.*, Inv.intInventoryNo, min(Inv.productPrice)minPrice,max(Inv.productPrice)maxPrice,
        Brand.strBrand, max(Inv.discount)maxDisc, min(Inv.dateRecorded)productRecorded FROM tblproductlist
        INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
    		INNER JOIN
    		(
    			SELECT tblproductinventory.intInventoryNo,intProductNo, discount, dateRecorded,
    			IF(discount IS NOT NULL, productPrice-(productPrice*discount*.01), productPrice)productPrice, discountDueDate
    			FROM tblproductinventory LEFT JOIN
    			(
    				SELECT * FROM tblproductdiscount WHERE curdate() <= discountDueDate AND intStatus= 1
    			)Discount ON tblproductinventory.intInventoryNo= Discount.intInventoryNo
    		)Inv ON tblproductlist.intProductNo= Inv.intProductNo
    		WHERE Brand.intStatus= 1 GROUP BY tblproductlist.intProductNo
    	)A
    	LEFT JOIN
    	(
    		SELECT tblproductlist.intProductNo, COUNT(intOrderDetailsNo)OrderCNT FROM tblorderdetails
    		INNER JOIN tblproductinventory ON tblorderdetails.intInventoryNo= tblproductinventory.intInventoryNo
    		INNER JOIN tblproductlist ON tblproductinventory.intProductNo= tblproductlist.intProductNo
    		GROUP BY tblproductlist.intProductNo
    	)Orders ON A.intProductNo= Orders.intProductNo
    )B
    LEFT JOIN (SELECT * FROM tblproductreview)Review ON B.intProductNo = Review.intProductNo
    GROUP BY B.intProductNo ORDER BY OrderCNT DESC,B.intProductNo LIMIT 10`, function (err,  results, fields) {
    if (err) console.log(err);
    results[0] ? results.forEach((obj)=>{
      obj.minPrice = priceFormat(obj.minPrice.toFixed(2)) ;
      obj.maxPrice = priceFormat(obj.maxPrice.toFixed(2)) ;
    }) : 0
    req.popularProducts= results;
    return next();
  });
}
function newProducts(req,res,next){
  /*New Popular Products;
  *(tblproductlist)*(tblproductbrand)*(tblproductinventory)*(tblproductreview)*/
  db.query(`SELECT A.*, ROUND(AVG(Review.intStars),1)AS aveRating, COUNT(Review.intProductReviewNo)AS cntRating,
    COUNT(Review.strReview)AS cntReview, IF(A.productRecorded > DATE_SUB(curdate(), INTERVAL 2 WEEK), 1, 0)newProduct FROM
    (
    	SELECT tblproductlist.*, Inv.intInventoryNo, min(Inv.productPrice)minPrice,max(Inv.productPrice)maxPrice,
    	Brand.strBrand, max(Inv.discount)maxDisc, min(Inv.dateRecorded)productRecorded FROM tblproductlist
    	INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
    	INNER JOIN
    	(
    		SELECT tblproductinventory.intInventoryNo,intProductNo, discount, dateRecorded,
    		IF(discount IS NOT NULL, productPrice-(productPrice*discount*.01), productPrice)productPrice, discountDueDate
    		FROM tblproductinventory LEFT JOIN
    		(
    			SELECT * FROM tblproductdiscount WHERE curdate() <= discountDueDate AND intStatus= 1
    		)Discount ON tblproductinventory.intInventoryNo= Discount.intInventoryNo
    	)Inv ON tblproductlist.intProductNo= Inv.intProductNo
    	WHERE Brand.intStatus= 1 GROUP BY tblproductlist.intProductNo
    )A
    LEFT JOIN (SELECT * FROM tblproductreview)Review ON A.intProductNo = Review.intProductNo
    GROUP BY A.intProductNo ORDER BY A.intProductNo DESC LIMIT 10`, function (err,  results, fields) {
    if (err) console.log(err);
    results[0] ? results.forEach((obj)=>{
      obj.minPrice = priceFormat(obj.minPrice.toFixed(2)) ;
      obj.maxPrice = priceFormat(obj.maxPrice.toFixed(2)) ;
    }) : 0
    req.newProducts= results;
    return next();
  });
}
function packages(req,res,next){
  db.query(`SELECT *, SUM(intProductQuantity)Qty FROM tblpackage
    INNER JOIN tblpackagelist ON tblpackage.intPackageNo= tblpackagelist.intPackageNo
    WHERE tblpackage.intStatus= 1 AND (tblpackage.intQuantity - tblpackage.intReservedItems) > 0 GROUP BY tblpackage.intPackageNo ORDER BY tblpackage.intPackageNo DESC`,
    function (err,  results, fields) {
    if (err) console.log(err);
    results.forEach((obj)=>{ obj.packagePrice = priceFormat(obj.packagePrice.toFixed(2)) })
    req.packages= results;
    return next();
  });
}

router.get('/', popularProducts, newProducts, packages, (req,res)=>{
  // console.log(`??????????? Session Values: ${JSON.stringify(req.user, null, 2)}`);
  // console.log(`??????????? Modal Cart Values: ${JSON.stringify(req.session.modal_cart, null, 2)}`);
  console.log(`??????????? Cart List Values: ${JSON.stringify(req.session.cart, null, 2)}`);
  // req.session.modal_cart = null;
  // req.session.cart = null;
  // console.log(JSON.stringify(req.session.cart, null, 2));
  res.render('cust-home/views/index', {
    thisUser: req.user,
    popularProducts: req.popularProducts,
    newProducts: req.newProducts,
    packages: req.packages
  });
});
router.get('/faq', (req,res)=>{
  db.query(`SELECT * FROM tblfaq WHERE intStatus= 1`, function (err,  results, fields) {
    if (err) console.log(err);
    res.render('cust-home/views/faq', {
      thisUser: req.user,
      faqs: results
    });
  });
});

exports.home = router;
