const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const firstID = 1000;
const priceFormat = require('../cust-0extras/priceFormat');
const moment = require('moment');

function newReviewID(req,res,next) {
  db.query(`SELECT * FROM tblproductreview ORDER BY intProductReviewNo DESC LIMIT 1`, (err, results, fields) => {
    if (err) console.log(err);
    req.newReviewID = results[0] ? parseInt(results[0].intProductReviewNo)+1 : firstID;
    return next();
  });
};

function checkUser (req, res, next){
  if(!req.user){
    res.redirect('/login');
  }
  else{
    return next();
  }
}
function thisProduct(req,res,next){
  /*Currently Viewed Product, Match(params);
  *(tblproductlist)*(tblproductbrand)*(tblproductinventory)*(tblproductreview)*/
  db.query(`SELECT A.*, tblsubcategory.*, tblcategory.*, ROUND(AVG(Review.intStars),1)AS aveRating, COUNT(Review.intProductReviewNo)AS cntRating,
    COUNT(Review.strReview)AS cntReview,
    SUM(case when Review.intStars= 1 then 1 else 0 end) AS OneS,
    SUM(case when Review.intStars= 2 then 1 else 0 end) AS TwoS,
    SUM(case when Review.intStars= 3 then 1 else 0 end) AS ThreeS,
    SUM(case when Review.intStars= 4 then 1 else 0 end) AS FourS,
    SUM(case when Review.intStars= 5 then 1 else 0 end) AS FiveS FROM(
    SELECT tblproductlist.*, Inv.intInventoryNo, Inv.intStatus As InvStatus, Inv.productPrice, Inv.strVariant, Brand.strBrand FROM tblproductlist
    INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
    INNER JOIN (SELECT * FROM tblproductinventory)Inv ON tblproductlist.intProductNo= Inv.intProductNo
    WHERE Brand.intStatus= 1 AND tblproductlist.intProductNo= ? GROUP BY tblproductlist.intProductNo)A
    LEFT JOIN (SELECT * FROM tblproductreview)Review ON A.intProductNo = Review.intProductNo
    INNER JOIN tblsubcategory ON A.intSubCategoryNo= tblsubcategory.intSubCategoryNo
    INNER JOIN tblcategory ON tblsubcategory.intCategoryNo= tblcategory.intCategoryNo
    GROUP BY A.intProductNo`,[req.params.prodid], function (err,  results, fields) {
    if (err) console.log(err);
    if (results[0]){
      results[0].productPrice = priceFormat(results[0].productPrice.toFixed(2));
      req.thisProduct= results[0];
      return next();
    }
    else{
      res.redirect('/item')
    }
  });
}
function thisInventory(req,res,next){
  db.query(`SELECT *, SUM(tblproductinventory.intQuantity - tblproductinventory.intReservedItems)stock FROM tblproductlist
    INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
    INNER JOIN tbluom ON tblproductinventory.intUOMno= tbluom.intUOMno
    WHERE tblproductlist.intProductNo= ? GROUP BY tblproductinventory.intInventoryNo`
    ,[req.params.prodid], (err, results, fields)=> {
    if (err) console.log(err);
    if (results[0]){
      results.forEach((data)=>{
        data.productPrice = priceFormat(data.productPrice.toFixed(2))
      })
      let curSize = ``;
      results[0].strVariant ? curSize+= `${results[0].strVariant}`: 0
      results[0].strVariant && results[0].intSize ? curSize+= ` - `: 0
      results[0].intSize ? curSize+= `${results[0].intSize}`: 0
      results[0].strUnitName ? curSize+= `${results[0].strUnitName}`: 0
      results[0].curSize = curSize
    }
    req.thisInventory = results;
    return next();
  });
}
function relatedProducts(req,res,next){
  /*Related Products;
  *(tblproductlist)*(tblproductbrand)*(tblproductinventory)*(tblproductreview)*/
  db.query(`SELECT B.*, ROUND(AVG(Review.intStars),1)AS aveRating, COUNT(Review.intProductReviewNo)AS cntRating,
    COUNT(Review.strReview)AS cntReview FROM( SELECT A.*, Orders.intOrderDetailsNo, COUNT(Orders.intOrderDetailsNo)AS OrderCNT FROM(
		SELECT tblproductlist.*, Cat.intCategoryNo, Inv.intInventoryNo, Inv.intStatus As InvStatus, Inv.productPrice, Inv.intQuantity, Brand.strBrand FROM tblproductlist
		INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
    INNER JOIN (SELECT * FROM tblproductinventory)Inv ON tblproductlist.intProductNo= Inv.intProductNo
		INNER JOIN (SELECT * FROM tblsubcategory)Cat ON tblproductlist.intSubCategoryNo= Cat.intSubCategoryNo
		WHERE Brand.intStatus= 1)A LEFT JOIN (SELECT * FROM tblorderdetails)Orders ON A.intInventoryNo= Orders.intInventoryNo
  	GROUP BY A.intProductNo)B LEFT JOIN (SELECT * FROM tblproductreview)Review ON B.intProductNo = Review.intProductNo
    WHERE B.intCategoryNo= ? AND B.intProductNo != ? GROUP BY B.intProductNo ORDER BY intSubCategoryNo!= ?, OrderCNT DESC LIMIT 10`
    , [req.thisProduct.intCategoryNo, req.params.prodid, req.thisProduct.intSubCategoryNo], function (err,  results, fields) {
    if (err) console.log(err);
    results.map( obj => obj.productPrice = priceFormat(obj.productPrice.toFixed(2)) );
    if (!results[0]){
      db.query(`SELECT A.*, ROUND(AVG(Review.intStars),1)AS aveRating, COUNT(Review.intProductReviewNo)AS cntRating, COUNT(Review.strReview)AS cntReview FROM(
        SELECT tblproductlist.*, Inv.intInventoryNo, Inv.intStatus As InvStatus, Inv.productPrice, Inv.intQuantity, Brand.strBrand FROM tblproductlist
        INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
        INNER JOIN (SELECT * FROM tblproductinventory)Inv ON tblproductlist.intProductNo= Inv.intProductNo
    		WHERE Brand.intStatus= 1 GROUP BY tblproductlist.intProductNo)A
        LEFT JOIN (SELECT * FROM tblproductreview)Review ON A.intProductNo = Review.intProductNo
        WHERE A.intProductNo != ? GROUP BY A.intProductNo LIMIT 10`
        , [req.params.prodid], function (err,  results, fields) {
        if (err) console.log(err);
        results.map( obj => obj.productPrice = priceFormat(obj.productPrice.toFixed(2)) );

        req.catProducts= 0;
        req.relatedProducts= results;
        return next();
      });
    }
    else{
      req.catProducts= 1;
      req.relatedProducts= results;
      return next();
    }
  });
}
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
function productReviews(req,res,next){
  /*Review of Current Product, Match(params);
  *(tblproductlist)*(tblproductreview)*(tbluser)*/
  db.query(`SELECT * FROM tblproductlist
    INNER JOIN tblproductreview ON tblproductlist.intProductNo= tblproductreview.intProductNo
    INNER JOIN tbluser ON tblproductreview.intUserID= tbluser.intUserID
    WHERE tblproductlist.intProductNo= ? AND tblproductreview.strReview IS NOT NULL`,
    [req.params.prodid], function (err,  results, fields) {
    if (err) console.log(err);
    results.map( obj => obj.r_created_at = moment(obj.r_created_at).format('L - LT') );
    req.productReviews= results;
    return next();
  });
}
function thisUserReview(req,res,next){
  if (!req.user){
    req.thisUserReviewStatus= 0;
    return next();
  }
  else{
    db.beginTransaction(function(err) {
      if (err) console.log(err);
      db.query(`SELECT * FROM tblproductlist
      	INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
      	INNER JOIN tblorderdetails ON tblproductinventory.intInventoryNo= tblorderdetails.intInventoryNo
      	INNER JOIN tblorder ON tblorderdetails.intOrderNo= tblorder.intOrderNo
        INNER JOIN tblorderhistory ON tblorder.intOrderNo= tblorderhistory.intOrderNo
      	WHERE tblproductlist.intProductNo= ? AND tblorder.intUserID= ? AND tblorderhistory.intStatus= 3 LIMIT 1`,
        [req.params.prodid, req.user.intUserID], (err,results,fields)=> {
        if (err) console.log(err);
        req.thisUserReview= null;
        req.thisUserReviewStatus= 0;
        if (results[0]){
          db.query(`SELECT * FROM tblproductlist
            INNER JOIN tblproductreview ON tblproductlist.intProductNo= tblproductreview.intProductNo
            INNER JOIN tbluser ON tblproductreview.intUserID= tbluser.intUserID
            WHERE tblproductlist.intProductNo= ? AND tblproductreview.intUserID= ? LIMIT 1`,
            [req.params.prodid, req.user.intUserID], (err,results,fields)=>{
            if (err) console.log(err);
            req.thisUserReview = results[0];
            req.thisUserReviewStatus = results[0] ? 2 : 1;
            db.commit(function(err) {
              if (err) console.log(err);
              return next();
            });
          });
        }
        else {
          db.commit(function(err) {
            if (err) console.log(err);
            return next();
          });
        }
      });
    });
  }
}

router.get('/:prodid', thisProduct, thisInventory, relatedProducts, popularProducts, productReviews, thisUserReview, (req,res)=>{
  req.session.item_qty = 1;
  req.session.item_inv = req.thisInventory[0].intInventoryNo;
  res.render('cust-item/views/index', {
    thisUser: req.user,
    thisProduct: req.thisProduct,
    thisInventory: req.thisInventory,
    catProducts: req.catProducts,
    relatedProducts: req.relatedProducts,
    popularProducts: req.popularProducts,
    productReviews: req.productReviews,
    thisUserReviewStatus: req.thisUserReviewStatus,
    thisUserReview: req.thisUserReview
  });
});
router.post('/:prodid/add-review', checkUser, newReviewID, (req,res)=>{
  let stringquery1 = req.body.review ?
    `INSERT INTO tblproductreview (intProductReviewNo, intProductNo, intUserID, strReview, intStars) VALUES (?,?,?,?,?)` :
    `INSERT INTO tblproductreview (intProductReviewNo, intProductNo, intUserID, intStars) VALUES (?,?,?,?)`
  let bodyarray1 = req.body.review ?
    [req.newReviewID, req.params.prodid, req.user.intUserID, req.body.review, req.body.rating] :
    [req.newReviewID, req.params.prodid, req.user.intUserID, req.body.rating]

  db.query(stringquery1, bodyarray1, (err, results, fields) => {
    if (err) console.log(err);
    res.redirect(`/item/${req.params.prodid}`);
  });
});
router.post('/:prodid/edit-review', checkUser, newReviewID, (req,res)=>{
  req.body.review ? 0 : req.body.review = null

  db.query(`UPDATE tblproductreview SET strReview= ?, intStars= ? WHERE intProductReviewNo= ?`,
    [req.body.review, req.body.rating, req.body.reviewNo], (err, results, fields) => {
    if (err) console.log(err);
    res.redirect(`/item/${req.params.prodid}`);
  });
});

exports.item = router;
