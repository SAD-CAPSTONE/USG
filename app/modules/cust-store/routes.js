const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');

function thisCategory(req,res,next){
  /*Check current category, Match(params);
  *(tblcategory)*/
  req.session.category ?
    0 : req.session.category = 'All Products';
  db.query(`SELECT * FROM tblcategory WHERE strCategory= ? AND intStatus= 1`, [req.session.category], function (err,  results, fields) {
    if (err) console.log(err);
    results[0] || req.params.category == 'All Products' ?
      0 : req.params.category == 'All Products'
    return next();
  });
}
function subcategories(req,res,next){
  /*Subcategories of current category, Match(params);
  *(tblcategory)*(tblsubcategory)*/
  db.query(`SELECT * FROM tblcategory
    INNER JOIN tblsubcategory ON tblcategory.intCategoryNo= tblsubcategory.intCategoryNo
    WHERE strCategory= ? AND tblsubcategory.intStatus= 1`, [req.params.category], function (err,  results, fields) {
    if (err) console.log(err);
    req.subcategories= results;
    return next();
  });
}
function categories(req,res,next){
  /*Other Categories, Match(params);
  *(tblcategory)*/
  db.query(`SELECT * FROM tblcategory WHERE strCategory!= ? AND intStatus= 1`, [req.session.category], function (err,  results, fields) {
    if (err) console.log(err);
    req.categories= results;
    return next();
  });
}

router.get('/', thisCategory, categories, (req,res)=>{
  res.render('cust-store/views/index', {
    thisUser: req.user,
    categories: req.categories
  });
});

exports.store = router;
