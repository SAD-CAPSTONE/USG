const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../0extras/priceFormat');
const copy = require('../0extras/copy');

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
  console.log('??????????? Session Values')
  console.log(req.user);
  res.render('home/views/index', {thisUser: req.user, popular: req.popular});
});
router.get('/faq', (req,res)=>{
  res.render('home/views/faq', {thisUser: req.user});
});

// AJAX Modal & Cart
router.get('/modal-cart/:pid', (req, res)=>{
  if (!req.session.modal_cart){
    req.session.modal_cart = {
      id: ''
    }
  }
  if (req.params.pid == req.session.modal_cart.id){
    res.send({product: req.session.modal_cart});
  }
  else{
    db.query(`SELECT * FROM tblproductlist
      INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
  	  INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
      INNER JOIN tbluom ON tblproductinventory.intUOMno= tbluom.intUOMno
      WHERE tblproductlist.intProductNo= ?`
      , [req.params.pid], (err,results,fields)=>{
      if (err) console.log(err);
      results.map( obj => obj.productPrice = priceFormat(obj.productPrice.toFixed(2)) );
      let sizes = results.reduce((arr, obj)=>{
        arr.push(`${obj.intSize.toString()} ${obj.strUnitName}`); return arr;
      },[]),
      prices = results.reduce((arr, obj)=>{
        arr.push(obj.productPrice); return arr;
      },[]);
      req.session.modal_cart = {
        id: results[0].intProductNo,
        name: `${results[0].strBrand} ${results[0].strProductName}`,
        img: `/assets/images/static/${results[0].strProductPicture}`,
        sizes: sizes,
        curSize: sizes[0],
        prices: prices,
        curPrice: prices[0],
        curQty: 1
      }
      res.send({product: req.session.modal_cart});
    });
  }
});
router.get('/modal-cart-price/:size', (req, res)=>{
  let size = req.params.size, price = 0, session = req.session.modal_cart;
  for(let i=0; i<session.sizes.length; i++){
    price = size == session.sizes[i] ? session.prices[i] : price ;
  }
  req.session.modal_cart.curSize = size;
  req.session.modal_cart.curPrice = price;

  res.send({price: price});
});
router.get('/modal-cart-qty/:action', (req, res)=>{
  let curQty = req.session.modal_cart.curQty;
  req.params.action == 'plus' ?
    curQty < 10 ? ++curQty : curQty
    : curQty > 1 ? --curQty : curQty
  req.session.modal_cart.curQty = curQty;

  res.send({qty: curQty});
});
router.post('/modal-cart', (req, res)=>{
  req.session.cart ?
    req.session.cart.push(req.session.modal_cart)
    : req.session.cart = [req.session.modal_cart]
  console.log(req.session.cart)
  res.send({cart: req.session.cart})
});

exports.home = router;
