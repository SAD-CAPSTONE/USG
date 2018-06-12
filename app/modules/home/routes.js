const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../0extras/priceFormat');

function popular(req,res,next){
  /*Most Popular Products;
  *(tblproductlist)*(tblproductbrand)*(tblproductinventory)*(tblproductreview)*/
  db.query(`SELECT A.*, ROUND(AVG(Review.intStars),2)AS aveRating, COUNT(Review.intProductReviewNo)AS cntRating, COUNT(Review.strReview)AS cntReview FROM(
    SELECT tblproductlist.*, Inv.intInventoryNo, Inv.intStatus As InvStatus, Inv.productPrice, Brand.strBrand FROM tblproductlist
    INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
    INNER JOIN (SELECT * FROM tblproductinventory)Inv ON tblproductlist.intProductNo= Inv.intProductNo
    WHERE Brand.intStatus= 1 GROUP BY tblproductlist.intProductNo)A
    LEFT JOIN (SELECT * FROM tblproductreview)Review ON A.intProductNo = Review.intProductNo
    GROUP BY A.intProductNo`, function (err,  results, fields) {
    if (err) console.log(err);
    results.map( obj => obj.productPrice = priceFormat(obj.productPrice.toFixed(2)) );
    req.popular= results;
    return next();
  });
}

router.get('/', popular, (req,res)=>{
  console.log(`??????????? Session Values: ${JSON.stringify(req.user, null, 2)}`);
  console.log(req.session.modal_cart);
  console.log(req.session.cart);
  // console.log(JSON.stringify(req.session.cart, null, 2));
  res.render('home/views/index', {thisUser: req.user, popular: req.popular});
});
router.get('/faq', (req,res)=>{
  res.render('home/views/faq', {thisUser: req.user});
});

exports.home = router;
