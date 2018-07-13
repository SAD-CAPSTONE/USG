const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');
const pageLimit = 16;
const productQuery = `
  SELECT B.*, ROUND(AVG(Review.intStars),1)AS aveRating, COUNT(Review.intProductReviewNo)AS cntRating,
  COUNT(Review.strReview)AS cntReview FROM(SELECT A.*, Orders.intOrderDetailsNo, COUNT(Orders.intOrderDetailsNo)AS OrderCNT FROM(
  SELECT tblproductlist.*, tblcategory.strCategory, Inv.intInventoryNo, Inv.intStatus As InvStatus, Inv.productPrice, Brand.strBrand FROM tblproductlist
  INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
  INNER JOIN (SELECT * FROM tblproductinventory)Inv ON tblproductlist.intProductNo= Inv.intProductNo
  INNER JOIN tblsubcategory ON tblproductlist.intSubCategoryNo= tblsubcategory.intSubCategoryNo
  INNER JOIN tblcategory ON tblsubcategory.intCategoryNo= tblcategory.intCategoryNo
  WHERE Brand.intStatus= 1)A LEFT JOIN (SELECT * FROM tblorderdetails)Orders ON A.intInventoryNo= Orders.intInventoryNo
  GROUP BY A.intProductNo)B LEFT JOIN (SELECT * FROM tblproductreview)Review ON B.intProductNo = Review.intProductNo `

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
  /*Subcategories of current category, Match(session);
  *(tblcategory)*(tblsubcategory)*/
  db.query(`SELECT * FROM tblcategory
    INNER JOIN tblsubcategory ON tblcategory.intCategoryNo= tblsubcategory.intCategoryNo
    WHERE strCategory= ? AND tblsubcategory.intStatus= 1`, [req.session.category], function (err,  results, fields) {
    if (err) console.log(err);
    req.subcategories= results.reduce((arr, data)=>{
      arr.push([data.intSubCategoryNo,`${data.strSubCategory}`]);
      return arr;
    }, []);
    return next();
  });
}
function categories(req,res,next){
  /*Other Categories, Match(session);
  *(tblcategory)*/
  db.query(`SELECT * FROM tblcategory WHERE strCategory!= ? AND intStatus= 1`, [req.session.category], function (err,  results, fields) {
    if (err) console.log(err);
    req.categories= results;
    return next();
  });
}
function storeCheck(req,res,next){
  req.session.store ? 0 :
    req.session.store = {
      page: 1,
      category: req.session.category,
      all_subcategories: req.subcategories,
      subcategories: req.subcategories.reduce((arr, data)=>{
        arr.push(data[0]); return arr;
      }, []),
      price: { min: null, max: null },
      rating: 0,
      sort: 1,
      search: ''
    };
  return next();
}


router.get('/load', thisCategory, subcategories, categories, storeCheck, (req,res)=>{
  // req.session.store = {
  //   page: 1,
  //   category: req.session.category,
  //   all_subcategories: req.subcategories,
  //   subcategories: req.subcategories,
  //   price: { min: 100, max: 300 },
  //   rating: 0,
  //   sort: 5,
  //   search: ''
  // }
  if (req.session.store.category == req.session.category){
    req.session.store.page = 1;
  }
  else{
    req.session.store.page = 1;
    req.session.store.category = req.session.category;
    req.session.store.all_subcategories = req.subcategories;
    req.session.store.subcategories = req.subcategories.reduce((arr, data)=>{
      arr.push(data[0]); return arr;
    }, []);
  }
  // console.log(req.session.store)

  let filterQuery = productQuery, store = req.session.store;
  // category
  store.category != 'All Products' ?
    filterQuery = filterQuery.concat(`WHERE strCategory= '${store.category}' `) :
    filterQuery = filterQuery.concat(`WHERE B.intProductNo> 0 `)

  // subcategory
  store.subcategories.length ?
    store.subcategories.forEach((sub, i)=>{
      i == 0 ?
        i != store.subcategories.length-1 ?
          filterQuery = filterQuery.concat(`AND (intSubCategoryNo= ${sub} `) :
          filterQuery = filterQuery.concat(`AND intSubCategoryNo= ${sub} `)
        :
        i != store.subcategories.length-1 ?
          filterQuery = filterQuery.concat(`OR intSubCategoryNo= ${sub} `) :
          filterQuery = filterQuery.concat(`OR intSubCategoryNo= ${sub} ) `)
    }) :
    store.category != 'All Products' ?
      filterQuery = filterQuery.concat(`AND intSubCategoryNo= 0 `) : 0

  // price
  let price = store.price;

  price.min || price.min == 0 ?
    price.max || price.max == 0 ?
      filterQuery = filterQuery.concat(`AND productPrice BETWEEN ${price.min} AND ${price.max} `) :
      filterQuery = filterQuery.concat(`AND productPrice >= ${price.min} `)
    :
    price.max || price.max == 0 ?
      filterQuery = filterQuery.concat(`AND productPrice <= ${price.max} `) : 0

  // products group by
  filterQuery = filterQuery.concat(`GROUP BY B.intProductNo `);

  // rating
  store.rating ?
    filterQuery = filterQuery.concat(`HAVING aveRating >= ${store.rating} `) : 0

  // sort
  switch(store.sort){
    case 1 : filterQuery = filterQuery.concat(`ORDER BY OrderCNT DESC `); break; // popularity
    case 2 : filterQuery = filterQuery.concat(`ORDER BY aveRating DESC `); break; // highest rating
    case 3 : filterQuery = filterQuery.concat(`ORDER BY productPrice `); break; // lowest to highest price
    case 4 : filterQuery = filterQuery.concat(`ORDER BY productPrice DESC `); break; // highest to lowest price
    case 5 : filterQuery = filterQuery.concat(`ORDER BY strBrand, strProductName `); break; // a-z
  }

  // limit
  let start = 0;
  for(let i=0; i<store.page-1; i++){
    start += pageLimit;
  }
  limitQuery = filterQuery.concat(`LIMIT ${start},${pageLimit} `);
  // console.log(limitQuery)

  db.beginTransaction(function(err) {
    if (err) console.log(err);
    db.query(limitQuery, function (err,  results, fields) {
      if (err) console.log(err);
      results[0] ? results.map( obj => obj.productPrice = priceFormat(obj.productPrice.toFixed(2)) ) : 0
      db.query(`SELECT COUNT(C.intProductNo)cnt FROM(${filterQuery})C`, (err,results1,fields)=>{
        if (err) console.log(err);
        db.commit(function(err) {
          if (err) console.log(err);
          res.send({store: req.session.store, products: results, count: results1[0].cnt, categories: req.categories})
        });
      });
    });
  });
});

router.post('/category', (req,res)=>{
  req.session.category = req.body.cat;
  res.send('Store Category Updated');
});

router.post('/subcategory', subcategories, storeCheck, (req,res)=>{
  if(req.body.id == 'allSub'){
    req.body.val == 'unchecked' ?
      req.session.store.subcategories = req.subcategories.reduce((arr, data)=>{
        arr.push(data[0]); return arr;
      }, []) :
      req.session.store.subcategories = [];
  }
  else{
    let index = req.session.store.subcategories.indexOf(req.body.id);
    req.body.val == 'unchecked' ?
      req.session.store.subcategories.push(req.body.id) :
      index !== -1 ?
        req.session.store.subcategories.splice(index, 1) : 0
  }
  res.send('Store Subcategory Updated');

});

router.post('/sort', subcategories, storeCheck, (req,res)=>{
  req.session.store.sort = parseInt(req.body.sort);
  res.send('Store Sort Updated');
});

router.post('/price', subcategories, storeCheck, (req,res)=>{
  req.session.store.price.min = parseInt(req.body.min);
  req.session.store.price.max = parseInt(req.body.max);
  res.send('Store Price Range Updated');
});

router.post('/rating', subcategories, storeCheck, (req,res)=>{
  req.session.store.rating = parseInt(req.body.rating);
  res.send('Store Rating Updated');
});


exports.storeRequest = router;
