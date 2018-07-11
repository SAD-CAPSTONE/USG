const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');

function thisCategory(req,res,next){
  /*Check current category, Match(params);
  *(tblcategory)*(tblsubcategory)*/
  db.query(`SELECT * FROM tblcategory WHERE strCategory= ? AND intStatus= 1`, [req.params.category], function (err,  results, fields) {
    if (err) console.log(err);
    if(results[0] || req.params.category == 'All Products')
      return next();
    else
      res.redirect('/store/All Products')
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
  db.query(`SELECT * FROM tblcategory WHERE strCategory!= ? AND intStatus= 1`, [req.params.category], function (err,  results, fields) {
    if (err) console.log(err);
    req.categories= results;
    return next();
  });
}

router.get('/', (req,res)=>{
  req.session.category ?
    res.redirect(`/store/${req.session.category}`):
    res.redirect(`/store/All Products`)
});
router.get('/:category', thisCategory, subcategories, categories, (req,res)=>{
  req.session.category = req.params.category;
  res.render('cust-store/views/index', {
    thisUser: req.user,
    thisCategory: req.params.category,
    subcategories: req.subcategories,
    categories: req.categories
  });
});

exports.store = router;
