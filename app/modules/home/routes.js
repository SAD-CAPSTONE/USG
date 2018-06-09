const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../0extras/priceFormat');
const copy = require('../0extras/copy');

function popular(req,res,next){
  /*Most Popular Products;
  *(tblproductlist)*(tblproductbrand)*(tblproductinventory)*(tblproductreview) >>
  *(tblproductinventory)*(tbluom)*/
  db.beginTransaction(function(err) {
    if (err) console.log(err);
    db.query(`SELECT A.*, ROUND(AVG(Review.intStars),2)AS aveRating, COUNT(Review.intProductReviewNo)AS cntRating, COUNT(Review.strReview)AS cntReview FROM(
      SELECT tblproductlist.*, Inv.intInventoryNo, Inv.intStatus As InvStatus, Inv.productPrice, Brand.strBrand FROM tblproductlist
	    INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
	    INNER JOIN (SELECT * FROM tblproductinventory)Inv ON tblproductlist.intProductNo= Inv.intProductNo
	    WHERE Brand.intStatus= 1 GROUP BY tblproductlist.intProductNo)A
      LEFT JOIN (SELECT * FROM tblproductreview)Review ON A.intProductNo = Review.intProductNo
      GROUP BY A.intProductNo`, function (err,  results, fields) {
      if (err) console.log(err);
      for(let i=0; i<results.length; i++){
        results[i].productPrice = priceFormat(results[i].productPrice.toFixed(2));
      }
      req.popular= results;

      db.query(`SELECT * FROM tblproductinventory INNER JOIN tbluom ON
       tblproductinventory.intUOMno= tbluom.intUOMno`, (err,results,fields)=>{
        if (err) console.log(err);
        for(let i=0; i<req.popular.length; i++){
          req.popular[i].sizes = [];
          for(let j=0; j<results.length; j++){
            if (req.popular[i].intProductNo == results[j].intProductNo){
              req.popular[i].sizes
                .push(results[j].intSize.toString()+" "+results[j].strUnitName);
            }
          }
        }

        db.commit(function(err) {
          if (err) console.log(err);
          return next();
        });
      });
    });
  });
}

function render(req,res){
  console.log('??????????? Session Values')
  console.log(req.user);
  res.render('home/views/index', {thisUser: req.user, popular: req.popular});
}
function faqRender(req,res){
  res.render('home/views/faq', {thisUser: req.user});
}

router.get('/', popular, render);
router.get('/faq', faqRender);

router.get('/modal-cart/:pid/:size', (req, res)=>{
    let size = req.params.size.split(" ")
    db.query(`SELECT * FROM tblproductlist
      INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
      INNER JOIN tbluom ON tblproductinventory.intUOMno= tbluom.intUOMno
      WHERE tblproductlist.intProductNo= ? AND intSize= ? AND strUnitName= ?`
      , [req.params.pid, size[0], size[1]], (err,results,fields)=>{
      if (err) console.log(err);
      console.log(results[0].productPrice);
      res.send({newPrice: results[0].productPrice});
    });
});

exports.home = router;
