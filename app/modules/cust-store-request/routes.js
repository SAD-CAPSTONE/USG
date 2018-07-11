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

function subcategories(req,res,next){
  /*Subcategories of current category, Match(params);
  *(tblcategory)*(tblsubcategory)*/
  db.query(`SELECT tblsubcategory.intSubCategoryNo FROM tblcategory
    INNER JOIN tblsubcategory ON tblcategory.intCategoryNo= tblsubcategory.intCategoryNo
    WHERE strCategory= ? AND tblsubcategory.intStatus= 1`, [req.session.category], function (err,  results, fields) {
    if (err) console.log(err);
    req.subcategories= results.reduce((arr, data)=>{
      arr.push(data.intSubCategoryNo);
      return arr;
    }, []);
    return next();
  });
}


router.get('/load', subcategories, (req,res)=>{
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
  if (req.session.store){
    if (req.session.store.category == req.session.category){
      req.session.store.page = 1;
    }
    else{
      req.session.store.page = 1;
      req.session.store.category = req.session.category;
      req.session.store.all_subcategories = req.subcategories;
      req.session.store.subcategories = req.subcategories;
    }
  }
  else{
    req.session.store = {
      page: 1,
      category: req.session.category,
      all_subcategories: req.subcategories,
      subcategories: req.subcategories,
      price: { min: 0, max: 0 },
      rating: 0,
      sort: 1,
      search: ''
    };
  }
  console.log(req.session.store)

  let filterQuery = productQuery, store = req.session.store;
  // category
  store.category != 'All Products' ?
    filterQuery = filterQuery.concat(`WHERE strCategory= '${store.category}' `) : 0

  // subcategory
  store.subcategories.length ?
    store.subcategories.forEach((sub, i)=>{
      i == 0 ?
        filterQuery = filterQuery.concat(`AND (intSubCategoryNo= ${sub} `) :
        i != store.subcategories.length-1 ?
          filterQuery = filterQuery.concat(`OR intSubCategoryNo= ${sub} `) :
          filterQuery = filterQuery.concat(`) `)
    }) :
    store.category != 'All Products' ?
      filterQuery = filterQuery.concat(`AND intSubCategoryNo= 0 `) : 0

  // price
  let price = store.price;
  price.min ?
    price.max ?
      filterQuery = filterQuery.concat(`AND productPrice BETWEEN ${price.min} AND ${price.max} `) :
      filterQuery = filterQuery.concat(`AND productPrice >= ${price.min} `)
    :
    price.max ?
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
      db.query(`SELECT COUNT(C.intProductNo)cnt FROM(${filterQuery})C`, (err,results1,fields)=>{
        if (err) console.log(err);
        db.commit(function(err) {
          if (err) console.log(err);
          results.map( obj => obj.productPrice = priceFormat(obj.productPrice.toFixed(2)) );
          res.send({store: req.session.store, products: results, count: results1[0].cnt})
        });
      });
    });
  });
});

router.get('/load/sort/:sortVal', subcategories, (req,res)=>{
  req.session.store ? 0 :
    req.session.store = {
      page: 1,
      category: req.session.category,
      all_subcategories: req.subcategories,
      subcategories: req.subcategories,
      price: { min: 0, max: 0 },
      rating: 0,
      sort: 1,
      search: ''
    };

  req.session.store.sort = parseInt(req.params.sortVal);
  res.send('Store Sort Updated');
});

router.post('/load/price', subcategories, (req,res)=>{
  req.session.store ? 0 :
    req.session.store = {
      page: 1,
      category: req.session.category,
      all_subcategories: req.subcategories,
      subcategories: req.subcategories,
      price: { min: 0, max: 0 },
      rating: 0,
      sort: 1,
      search: ''
    };

  req.session.store.price.min = parseInt(req.body.min);
  req.session.store.price.max = parseInt(req.body.max);
  res.send('Store Price Range Updated');
});



exports.storeRequest = router;
