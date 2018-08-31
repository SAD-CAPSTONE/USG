const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');
const pageLimit = 16;
const productQuery = `
  SELECT B.*, ROUND(AVG(Review.intStars),1)AS aveRating, COUNT(Review.intProductReviewNo)AS cntRating,
  COUNT(Review.strReview)AS cntReview FROM(SELECT A.*, Orders.intOrderDetailsNo, COUNT(Orders.intOrderDetailsNo)AS OrderCNT FROM(
  SELECT tblproductlist.*, tblcategory.strCategory, Inv.intInventoryNo, Inv.intStatus As InvStatus, Inv.minPrice, Inv.maxPrice, Brand.strBrand FROM tblproductlist
  INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
  INNER JOIN (SELECT intInventoryNo,intProductNo,intStatus,min(productPrice)minPrice,max(productPrice)maxPrice FROM tblproductinventory GROUP BY intProductNo)Inv ON tblproductlist.intProductNo= Inv.intProductNo
  INNER JOIN tblsubcategory ON tblproductlist.intSubCategoryNo= tblsubcategory.intSubCategoryNo
  INNER JOIN tblcategory ON tblsubcategory.intCategoryNo= tblcategory.intCategoryNo
  WHERE Brand.intStatus= 1)A LEFT JOIN (SELECT * FROM tblorderdetails)Orders ON A.intInventoryNo= Orders.intInventoryNo
  GROUP BY A.intProductNo)B LEFT JOIN (SELECT * FROM tblproductreview)Review ON B.intProductNo = Review.intProductNo `

function thisCategory(req,res,next){
  /*Check current category, Match(body);
  *(tblcategory)*/
  db.query(`SELECT * FROM tblcategory WHERE intCategoryNo= ? AND intStatus= 1`, [req.body.cat], function (err,  results, fields) {
    if (err) console.log(err);
    if(results[0]){
      req.thisCategoryNo = results[0].intCategoryNo
      req.thisCategory = results[0].strCategory
    }
    else{
      req.thisCategoryNo = 0
      req.thisCategory = 'All Products'
    }
    return next();
  });
}
function subcategories(req,res,next){
  /*Subcategories of current category, Match(body);
  *(tblcategory)*(tblsubcategory)*/
  db.query(`SELECT * FROM tblcategory
    INNER JOIN tblsubcategory ON tblcategory.intCategoryNo= tblsubcategory.intCategoryNo
    WHERE tblcategory.intCategoryNo= ? AND tblsubcategory.intStatus= 1`, [req.body.cat], function (err,  results, fields) {
    if (err) console.log(err);
    req.subcategories= results.reduce((arr, data)=>{
      arr.push([data.intSubCategoryNo,`${data.strSubCategory}`]);
      return arr;
    }, []);
    return next();
  });
}
function categories(req,res,next){
  /*Other Categories, Match(body);
  *(tblcategory)*/
  db.query(`SELECT * FROM tblcategory WHERE intCategoryNo!= ? AND intStatus= 1`, [req.body.cat], function (err,  results, fields) {
    if (err) console.log(err);
    req.categories= results;
    return next();
  });
}

router.post('/load', thisCategory, subcategories, categories, (req,res)=>{
  let filterQuery = productQuery,
  store = {
    page: 1,
    total_pages: 1,
    catNo: req.thisCategoryNo,
    category: req.thisCategory,
    all_subcategories: req.subcategories,
    subcategories: [],
    price: { min: null, max: null },
    rating: 0,
    sort: '1',
    search: ''
  };
  req.body.sub ?
    store.subcategories = req.body.sub.split(',').reduce((arr, data1)=>{
      store.all_subcategories.reduce((result, data2)=>{
        return data2[0] == data1 ? 1 : result
      }, 0) == 1 ? arr.push(data1) : 0
      return arr
    }, [])
    : 0
  req.body.sub.split(',')[0] == 'all' ?
    store.subcategories = req.subcategories.reduce((arr, data)=>{
      arr.push(data[0]); return arr;
    }, []) : 0
  req.body.sort ? store.sort = req.body.sort : 0;
  store.price.min =
    Number(req.body.min) ?
      req.body.min :
      req.body.min == 'zero' ?
        0 : store.price.min
  store.price.max =
    Number(req.body.max) ?
      req.body.max :
      req.body.max == 'zero' ?
        0 : store.price.max
  req.body.rating ?
    Number(req.body.rating) && Number(req.body.rating) <= 5 ?
      store.rating = Number(req.body.rating) : 0
    : 0
  store.page = req.body.page ?
    Number(req.body.page) ?
      parseInt(req.body.page)
      : 1
    : 1

  // category
  store.category != 'All Products' ?
    filterQuery = filterQuery.concat(`WHERE strCategory= '${store.category}' `) :
    filterQuery = filterQuery.concat(`WHERE B.intProductNo> 0 `)

  // subcategory
  store.category != 'All Products' ?
    store.subcategories.length ?
      store.subcategories.forEach((sub, i)=>{
        i == 0 ?
          i != store.subcategories.length-1 ?
            filterQuery = filterQuery.concat(`AND (intSubCategoryNo= '${sub}' `) :
            filterQuery = filterQuery.concat(`AND intSubCategoryNo= '${sub}' `)
          :
          i != store.subcategories.length-1 ?
            filterQuery = filterQuery.concat(`OR intSubCategoryNo= '${sub}' `) :
            filterQuery = filterQuery.concat(`OR intSubCategoryNo= '${sub}' ) `)
      })
      : filterQuery = filterQuery.concat(`AND intSubCategoryNo= 0 `)
    : 0

  // price
  let price = store.price;
  price.min != null ?
    price.max != null ?
      filterQuery = filterQuery.concat(`AND ((minPrice BETWEEN ${price.min} AND ${price.max}) OR (maxPrice BETWEEN ${price.min} AND ${price.max})) `) :
      filterQuery = filterQuery.concat(`AND (minPrice >= ${price.min} OR maxPrice >= ${price.min}) `)
    :
    price.max != null ?
      filterQuery = filterQuery.concat(`AND (minPrice <= ${price.max} OR maxPrice <= ${price.max}) `) : 0

  // products group by
  filterQuery = filterQuery.concat(`GROUP BY B.intProductNo `);

  // rating
  store.rating ?
    filterQuery = filterQuery.concat(`HAVING aveRating >= '${store.rating}' `) : 0

  // sort
  switch(store.sort){
    case '1' : filterQuery = filterQuery.concat(`ORDER BY OrderCNT DESC `); break; // popularity
    case '2' : filterQuery = filterQuery.concat(`ORDER BY aveRating DESC `); break; // highest rating
    case '3' : filterQuery = filterQuery.concat(`ORDER BY minPrice `); break; // lowest to highest price
    case '4' : filterQuery = filterQuery.concat(`ORDER BY minPrice DESC `); break; // highest to lowest price
    case '5' : filterQuery = filterQuery.concat(`ORDER BY strBrand, strProductName `); break; // a-z
    default : filterQuery = filterQuery.concat(`ORDER BY OrderCNT DESC `); store.sort = 1 ; break;
  }

  db.beginTransaction(function(err) {
    if (err) console.log(err);
    db.query(`SELECT COUNT(C.intProductNo)cnt FROM(${filterQuery})C`, function (err,  results, fields) {
      if (err) console.log(err);
      if(results[0]){
        store.total_pages =
          results[0].cnt >= pageLimit ?
            results[0].cnt % pageLimit ?
              Math.floor(results[0].cnt / pageLimit) + 1 :
            Math.floor(results[0].cnt / pageLimit)
          : 1
        store.page =
          store.page > store.total_pages ?
            store.total_pages :
            store.page < 1 ? 1 : store.page
        store.page =
          store.page > store.total_pages ?
            store.total_pages :
            store.page < 1 ?
              1 : store.page
      }
      // limit
      let start = 0;
      for(let i=0; i<store.page-1; i++){
        start += pageLimit;
      }
      limitQuery = filterQuery.concat(`LIMIT ${start},${pageLimit} `);
      // console.log(limitQuery)
      db.query(limitQuery, (err,results1,fields)=>{
        if (err) console.log(err);
        results1[0] ? results1.forEach((obj)=>{
          obj.minPrice = priceFormat(obj.minPrice.toFixed(2)) ;
          obj.maxPrice = priceFormat(obj.maxPrice.toFixed(2)) ;
        }) : 0
        db.commit(function(err) {
          if (err) console.log(err);
          console.log(store)
          res.send({store: store, products: results1, count: results[0].cnt, categories: req.categories})
        });
      });
    });
  });
});

exports.storeRequest = router;
