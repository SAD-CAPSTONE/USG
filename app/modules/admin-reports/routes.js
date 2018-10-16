const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const moment = require('moment');
const priceFormat = require('../cust-0extras/priceFormat');
const excel = require('node-excel-export');
const csv = require('csvtojson');
const userTypeAuth = require('../cust-0extras/userTypeAuth');
const auth_admin = userTypeAuth.admin;
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const styles = {
  headerBG: {
    fill: {
      fgColor: {
        rgb: 'FFD2D6DE'
      }
    },
    font: {
      color: {
        rgb: 'FF000000'
      },
      sz: 12,
      bold: false,
      underline: false
    }
  }
};

function checkUser(req, res, next){
  if(!req.user){
    res.redirect('/login');
  }
  else{
    return next();
  }
}
function sizeString(obj){
  let curSize = ``;
  obj.strVariant ? curSize+= `${obj.strVariant}`: 0
  obj.strVariant && obj.intSize ? curSize+= ` - `: 0
  obj.intSize ? curSize+= `${obj.intSize}`: 0
  obj.strUnitName ? curSize+= ` ${obj.strUnitName}`: 0
  return curSize;
}
function now(req,res,next){
  db.query(`SELECT curdate()currentDate, YEAR(curdate())currentYear`, (err, results, fields) => {
    if (err) console.log(err);
    results.map( obj => obj.currentDate = moment(obj.currentDate).format('YYYY-MM-DD') );
    req.now= results[0];
    return next();
  });
}
function yearsAvailable(req,res,next){
  db.query(`SELECT YEAR(transactionDate)year FROM tblsales GROUP BY year`, (err, results, fields) => {
    if (err) console.log(err);
    req.yearsAvailable= results;
    return next();
  });
}
function datesAvailable(req,res,next){
  db.query(`SELECT (transactionDate)date FROM tblsales GROUP BY date`, (err, results, fields) => {
    if (err) console.log(err);
    if (results[0]){
      results.map( obj => obj.date = moment(obj.date).format('YYYY-MM-DD') );
    }
    req.datesAvailable= results;
    return next();
  });
}
function yearsAvailableDamaged(req,res,next){
  db.query(`SELECT YEAR(pullOutDate)year FROM tblstockpullout GROUP BY year`, (err, results, fields) => {
    if (err) console.log(err);
    req.yearsAvailableDamaged= results;
    return next();
  });
}
function datesAvailableDamaged(req,res,next){
  db.query(`SELECT (pullOutDate)date FROM tblstockpullout GROUP BY date`, (err, results, fields) => {
    if (err) console.log(err);
    if (results[0]){
      results.map( obj => obj.date = moment(obj.date).format('YYYY-MM-DD') );
    }
    req.datesAvailableDamaged= results;
    return next();
  });
}

router.get('/', (req,res)=>{
  res.render('admin-reports/views/reports');
});

var resultset = "", completeset = "", ranges = "";

router.get('/loadTransactions',(req,res)=>{
  console.log(resultset)
  res.render('admin-reports/views/transactionLoader',{re: resultset, moment: moment})
})

router.get('/viewTransactions',(req,res)=>{
  res.render('admin-reports/views/viewTransactions',{re: completeset, moment: moment, ranges: ranges})

})

router.post('/loadTransactions',(req,res)=>{
  var dates = (req.body.range).split('-');
  var newDate = moment(dates[0]).format("YYYY/MM/DD");
  var newDate1 = moment(dates[1]).format("YYYY/MM/DD");

  db.query(`Select * from tblInventoryTransactions
    join tblProductInventory on tblInventoryTransactions.intInventoryno = tblProductinventory.intInventoryno
    join tblProductlist on tblProductlist.intProductNo = tblProductInventory.intProductNo
    join tblUom on tblUom.intUOMno = tblProductInventory.intUomNo
    where transactionDate between '${newDate}' and '${newDate1}' limit 7`,(err1,res1,fie1)=>{
      if(err1) console.log(err1);
      else{
        db.query(`Select * from tblInventoryTransactions
          join tblProductInventory on tblInventoryTransactions.intInventoryno = tblProductinventory.intInventoryno
          join tblProductlist on tblProductlist.intProductNo = tblProductInventory.intProductNo
          join tblUom on tblUom.intUOMno = tblProductInventory.intUomNo
          where transactionDate between '${newDate}' and '${newDate1}'`,(err2,res2,fie2)=>{
            if(err2) console.log(err2);
            else{
              resultset = res1;
              completeset = res2;
              ranges = dates;
              res.send("data")
            }
          })


      }
    })
})

router.get('/sales',(req,res)=>{
  db.query(`Select
            count(*) as total_quantity,
            sum((details.purchasePrice - (details.purchasePrice * (details.discount / 100) ))) as sum_discounted, details.intOrderDetailsNo,
            details.purchasePrice, details.discount, tblOrder.*, details.*, tblProductInventory.*,
            tblProductlist.*, tblUom.*
            from tblOrder join tblOrderdetails as details on tblOrder.intOrderNo = details.intOrderNo
            join tblProductInventory on details.intInventoryNo = tblProductInventory.intInventoryno
            join tblUom on tblProductInventory.intUomNo = tblUom.intUomNo

            join tblProductList on tblProductInventory.intProductNo = tblProductList.intProductNo

            where tblOrder.intPaymentStatus = 1 and details.intProductType = 1
            group by details.intInventoryNo
            order by total_quantity desc limit 4`,(err1,res1,fie1)=>{
              if(err1) console.log(err1);
              else{
                res.render('admin-reports/views/sales', {best: res1});
              }
            })

});
router.get('/reviewMonthlySales', yearsAvailable, (req,res)=>{
  db.query(`SELECT DATE(transactionDate)date, SUM(amount)total, SUM(intQuantity)qty
    FROM tblsales INNER JOIN tblorderdetails USING(intOrderNo)
    WHERE tblsales.intStatus= 1 AND monthname(transactionDate) = ? AND YEAR(transactionDate) = ?
    GROUP BY date`, [req.query.month, req.query.year], (err, results, fields) => {
    if (err) console.log(err);
    headerMonth = monthNames.reduce((temp,data)=>{
      return data == req.query.month ? data : temp;
    },null);
    headerYear = req.yearsAvailable.reduce((temp,data)=>{
      return data.year == req.query.year ? data.year : temp;
    },null);
    if (results[0]){
      results.forEach((obj)=>{
        obj.total = priceFormat(obj.total.toFixed(2));
        obj.date = moment(obj.date).format('MM/DD/YYYY');
      })
    }
    if (headerMonth && headerYear){
      res.render('admin-reports/views/reviewMonthlySales',{
        sales: results,
        headerMonth: headerMonth,
        headerYear: headerYear
      });
    }
    else {
      res.redirect('/reports/sales')
    }
  });
})
router.get('/reviewDailySales', datesAvailable, (req,res)=>{
  db.query(`SELECT intProductNo, strBrand, strProductName, SUM(tblorderdetails.intQuantity)qty,
    SUM(tblorderdetails.purchasePrice*tblorderdetails.intQuantity)total FROM tblsales
    INNER JOIN tblorderdetails USING(intOrderNo)
    INNER JOIN tblproductinventory USING(intInventoryNo)
    INNER JOIN tblproductlist USING(intProductNo)
    INNER JOIN tblproductbrand USING(intBrandNo)
    WHERE tblsales.intStatus = 1 AND date(transactionDate) = ?
    GROUP BY intProductNo`, [req.query.date], (err, results, fields) => {
    if (err) console.log(err);
    headerDate = req.datesAvailable.reduce((temp,data)=>{
      return data.date == req.query.date ? data.date : temp;
    },null);
    headerDate = moment(headerDate).format('LL')
    if (results[0]){
      results.forEach((obj)=>{
        obj.total = priceFormat(obj.total.toFixed(2));
        obj.date = moment(obj.date).format('MM/DD/YYYY');
      })
    }
    if (headerDate){
      res.render('admin-reports/views/reviewDailySales',{
        sales: results,
        date: headerDate,
        queryDate: req.query.date
      });
    }
    else {
      res.redirect('/reports/sales')
    }

  });
})
router.get('/inventory',(req,res)=>{
  db.query(`SELECT tblproductinventory.intInventoryNo, strBrand, strProductName,
    strVariant, intSize, strUnitName, (tblproductinventory.intQuantity)stock, (tblproductinventory.intQuantity*productPrice)totalValue
    FROM tblproductlist INNER JOIN tblproductbrand USING(intBrandNo) INNER JOIN tblproductinventory USING(intProductNo)
    INNER JOIN tbluom USING(intUomNo) LEFT JOIN tblorderdetails USING(intInventoryNo)
    GROUP BY tblproductinventory.intInventoryNo ORDER BY totalValue DESC LIMIT 7`, (err, results, fields) => {
    if (err) console.log(err);
    if (results[0]){
      results.map( obj => obj.intSize = sizeString(obj) );
      results.map( obj => obj.totalValue = priceFormat(obj.totalValue.toFixed(2)) );
    }
    // console.log(results)
    res.render('admin-reports/views/inventory',{
      totalValueProducts: results
    });
  });
});
router.get('/inventory/totalValues',(req,res)=>{
  db.query(`SELECT tblproductinventory.intInventoryNo, strBrand, strProductName,
    strVariant, intSize, strUnitName, (tblproductinventory.intQuantity)stock, (tblproductinventory.intQuantity*productPrice)totalValue
    FROM tblproductlist INNER JOIN tblproductbrand USING(intBrandNo) INNER JOIN tblproductinventory USING(intProductNo)
    INNER JOIN tbluom USING(intUomNo) LEFT JOIN tblorderdetails USING(intInventoryNo)
    GROUP BY tblproductinventory.intInventoryNo ORDER BY totalValue DESC`, (err, results, fields) => {
    if (err) console.log(err);
    if (results[0]){
      results.map( obj => obj.intSize = sizeString(obj) );
      results.map( obj => obj.totalValue = priceFormat(obj.totalValue.toFixed(2)) );
    }
    res.render('admin-reports/views/totalValues',{
      totalValueProducts: results
    });
  });
});
router.get('/inventory/notMoving', now, (req,res)=>{
  let notMoveDate = [];
  if (req.query.date == 'now'){
    notMoveDate[0] = req.now.currentDate
    notMoveDate[1] = req.now.currentDate
  }
  else {
    notMoveDate = req.query.date.split(" - ");
    notMoveDate[0] = moment(notMoveDate[0]).format('YYYY-MM-DD')
    notMoveDate[1] = moment(notMoveDate[1]).format('YYYY-MM-DD')
  }
  if (notMoveDate[0] != 'Invalid date' && notMoveDate[1] != 'Invalid date'){
    db.query(`SELECT * FROM(SELECT tblproductinventory.intInventoryNo, strBrand, strProductName,
    	strVariant, intSize, strUnitName, (tblproductinventory.intQuantity - intReservedItems)stock, A.intSalesNo
    	FROM tblproductlist INNER JOIN tblproductbrand USING(intBrandNo) INNER JOIN tblproductinventory USING(intProductNo)
    	INNER JOIN tbluom USING(intUomNo) LEFT JOIN tblorderdetails USING(intInventoryNo) LEFT JOIN (
  		SELECT * FROM tblsales WHERE intStatus = 1 AND transactionDate >= ? AND transactionDate <= ? )A USING(intOrderNo)
    	GROUP BY tblproductinventory.intInventoryNo)B WHERE B.intSalesNo IS NULL`, [notMoveDate[0], notMoveDate[1]], (err, results, fields) => {
      if (err) console.log(err);
      if (results[0]){
        results.map( obj => obj.intSize = sizeString(obj) );
      }
      notMoveDate[0] = moment(notMoveDate[0]).format('LL')
      notMoveDate[1] = moment(notMoveDate[1]).format('LL')
      res.render('admin-reports/views/notMoving',{
        notMoving: results,
        date: notMoveDate,
        queryDate: req.query.date
      });
    });
  }
  else{
    res.redirect('/reports/inventory')
  }

});
router.get('/damage',(req,res)=>{
  res.render('admin-reports/views/damage');
});
router.get('/reviewMonthlyDamaged', yearsAvailableDamaged, (req,res)=>{
  db.query(`SELECT DATE(pullOutDate)date, SUM(intQuantity)qty FROM tblstockpullout
    WHERE monthname(pullOutDate) = ? AND YEAR(pullOutDate) = ?
    GROUP BY date`, [req.query.month, req.query.year], (err, results, fields) => {
    if (err) console.log(err);
    headerMonth = monthNames.reduce((temp,data)=>{
      return data == req.query.month ? data : temp;
    },null);
    headerYear = req.yearsAvailableDamaged.reduce((temp,data)=>{
      return data.year == req.query.year ? data.year : temp;
    },null);
    if (results[0]){
      results.forEach((obj)=>{
        obj.date = moment(obj.date).format('MM/DD/YYYY');
      })
    }
    if (headerMonth && headerYear){
      res.render('admin-reports/views/reviewMonthlyDamaged',{
        damaged: results,
        headerMonth: headerMonth,
        headerYear: headerYear
      });
    }
    else {
      res.redirect('/reports/damage')
    }
  });
})
router.get('/reviewDailyDamaged', datesAvailableDamaged, (req,res)=>{
  db.query(`SELECT tblproductinventory.intInventoryNo, strBrand, strProductName, strVariant, intSize, strUnitName, SUM(tblstockpullout.intQuantity)qty FROM tblstockpullout
    INNER JOIN tblproductinventory USING(intInventoryNo) INNER JOIN tbluom USING(intUomNo)
    INNER JOIN tblproductlist USING(intProductNo) INNER JOIN tblproductbrand USING(intBrandNo) WHERE date(pullOutDate) = ?
    GROUP BY tblproductinventory.intInventoryNo`, [req.query.date], (err, results, fields) => {
    if (err) console.log(err);
    headerDate = req.datesAvailableDamaged.reduce((temp,data)=>{
      return data.date == req.query.date ? data.date : temp;
    },null);
    headerDate = moment(headerDate).format('LL')
    if (results[0]){
      results.forEach((obj)=>{
        obj.date = moment(obj.date).format('MM/DD/YYYY');
        obj.intSize = sizeString(obj);
      })
    }
    if (headerDate){
      res.render('admin-reports/views/reviewDailyDamaged',{
        damaged: results,
        date: headerDate,
        queryDate: req.query.date
      });
    }
    else {
      res.redirect('/reports/damage')
    }

  });
})

router.get('/customer',(req,res)=>{
  res.render('admin-reports/views/customer');
});

// ajax
router.post('/sales/load', now, yearsAvailable, (req,res)=>{
  let yearDate, dailyDate,
  config = {
    annual: req.now.currentYear,
    daily: req.now.currentDate,
    years: req.yearsAvailable
  }
  parseInt(req.body.annual) ?
    config.annual = req.body.annual : 0
  parseInt(req.body.daily) ?
    config.daily = req.body.daily : 0

  db.query(`SELECT MONTH(transactionDate)month, MONTHNAME(transactionDate)monthname, SUM(amount)total, SUM(intQuantity)qty
    FROM tblsales INNER JOIN tblorderdetails USING(intOrderNo)
    WHERE tblsales.intStatus= 1 AND YEAR(transactionDate) = ? GROUP BY monthname`,
    [config.annual], (err, annualResults, fields) => {
    if (err) console.log(err);
    if (annualResults[0]){
      annualResults.forEach((obj)=>{
        obj.total = priceFormat(obj.total.toFixed(2));
      })
    }
    db.query(`SELECT intProductNo, strBrand, strProductName, SUM(tblorderdetails.intQuantity)qty,
      SUM(tblorderdetails.purchasePrice*tblorderdetails.intQuantity)total FROM tblsales
      INNER JOIN tblorderdetails USING(intOrderNo) INNER JOIN tblproductinventory USING(intInventoryNo)
      INNER JOIN tblproductlist USING(intProductNo) INNER JOIN tblproductbrand USING(intBrandNo)
      WHERE tblsales.intStatus = 1 AND date(transactionDate) = ? GROUP BY intProductNo ORDER BY total DESC LIMIT 7`,
      [config.daily], (err, dailyResults, fields) => {
      if (err) console.log(err);
      if (dailyResults[0]){
        dailyResults.forEach((obj)=>{
          obj.total = priceFormat(obj.total.toFixed(2));
        })
      }
      res.send({
        config: config,
        annual: annualResults,
        daily: dailyResults
      })
    });
  });

})
router.post('/inventory/notMoveDate', now, (req,res)=>{
  let notMoveDate = [];
  if (req.body.notMoveDate == 'now'){
    notMoveDate[0] = req.now.currentDate
    notMoveDate[1] = req.now.currentDate
  }
  else {
    notMoveDate = req.body.notMoveDate.split(" - ");
    notMoveDate[0] = moment(notMoveDate[0]).format('YYYY-MM-DD')
    notMoveDate[1] = moment(notMoveDate[1]).format('YYYY-MM-DD')
  }
  if (notMoveDate[0] == 'Invalid date' || notMoveDate[1] == 'Invalid date'){
    notMoveDate[0] = req.now.currentDate
    notMoveDate[1] = req.now.currentDate
  }

  db.query(`SELECT * FROM(SELECT tblproductinventory.intInventoryNo, strBrand, strProductName,
  	strVariant, intSize, strUnitName, (tblproductinventory.intQuantity - intReservedItems)stock, A.intSalesNo
  	FROM tblproductlist INNER JOIN tblproductbrand USING(intBrandNo) INNER JOIN tblproductinventory USING(intProductNo)
  	INNER JOIN tbluom USING(intUomNo) LEFT JOIN tblorderdetails USING(intInventoryNo) LEFT JOIN (
		SELECT * FROM tblsales WHERE intStatus = 1 AND transactionDate >= ? AND transactionDate <= ? )A USING(intOrderNo)
  	GROUP BY tblproductinventory.intInventoryNo)B WHERE B.intSalesNo IS NULL LIMIT 7`, [notMoveDate[0], notMoveDate[1]], (err, results, fields) => {
    if (err) console.log(err);
    if (results[0]){
      results.map( obj => obj.intSize = sizeString(obj) );
    }
    notMoveDate[0] = moment(notMoveDate[0]).format('MM/DD/YYYY')
    notMoveDate[1] = moment(notMoveDate[1]).format('MM/DD/YYYY')

    res.send({
      products: results,
      notMoveDate: notMoveDate
    });
  });
});
router.post('/damaged/load', now, yearsAvailableDamaged, (req,res)=>{
  let yearDate, dailyDate,
  config = {
    annual: req.now.currentYear,
    daily: req.now.currentDate,
    years: req.yearsAvailableDamaged
  }
  parseInt(req.body.annual) ?
    config.annual = req.body.annual : 0
  parseInt(req.body.daily) ?
    config.daily = req.body.daily : 0

  db.query(`SELECT MONTHNAME(pullOutDate)monthname, SUM(intQuantity)total
    FROM tblstockpullout WHERE YEAR(pullOutDate) = ? GROUP BY monthname`,
    [config.annual], (err, annualResults, fields) => {
    if (err) console.log(err);
    db.query(`SELECT tblproductinventory.intInventoryNo, strBrand, strProductName, strVariant, intSize, strUnitName, SUM(tblstockpullout.intQuantity)qty FROM tblstockpullout
      INNER JOIN tblproductinventory USING(intInventoryNo) INNER JOIN tbluom USING(intUomNo)
      INNER JOIN tblproductlist USING(intProductNo) INNER JOIN tblproductbrand USING(intBrandNo) WHERE date(pullOutDate) = ?
      GROUP BY tblproductinventory.intInventoryNo ORDER BY qty DESC LIMIT 7`, [config.daily], (err, dailyResults, fields) => {
      if (err) console.log(err);
      if (dailyResults[0]){
        dailyResults.map( obj => obj.intSize = sizeString(obj) );
      }
      res.send({
        config: config,
        annual: annualResults,
        daily: dailyResults
      })
    });
  });

})

router.get('/sales/loadChart', checkUser, auth_admin, now, (req,res)=>{
  db.query(`SELECT A.monthname, IF(B.total IS NULL, 0, B.total )total, IF(B.qty IS NULL, 0, B.qty )qty FROM (
	  SELECT MONTHNAME(STR_TO_DATE(1, '%m'))monthname, (1)month
    UNION SELECT MONTHNAME(STR_TO_DATE(2, '%m'))monthname, (2)month
    UNION SELECT MONTHNAME(STR_TO_DATE(3, '%m'))monthname, (3)month
    UNION SELECT MONTHNAME(STR_TO_DATE(4, '%m'))monthname, (4)month
    UNION SELECT MONTHNAME(STR_TO_DATE(5, '%m'))monthname, (5)month
    UNION SELECT MONTHNAME(STR_TO_DATE(6, '%m'))monthname, (6)month
    UNION SELECT MONTHNAME(STR_TO_DATE(7, '%m'))monthname, (7)month
    UNION SELECT MONTHNAME(STR_TO_DATE(8, '%m'))monthname, (8)month
    UNION SELECT MONTHNAME(STR_TO_DATE(9, '%m'))monthname, (9)month
    UNION SELECT MONTHNAME(STR_TO_DATE(10, '%m'))monthname, (10)month
    UNION SELECT MONTHNAME(STR_TO_DATE(11, '%m'))monthname, (11)month
    UNION SELECT MONTHNAME(STR_TO_DATE(12, '%m'))monthname, (12)month
    )A LEFT JOIN (SELECT MONTHNAME(transactionDate)monthname, SUM(amount)total, SUM(qty)qty FROM tblsales
    INNER JOIN (SELECT intOrderNo, SUM(intQuantity)qty FROM tblorderdetails GROUP BY intOrderNo)A USING(intOrderNo)
	  WHERE intStatus= 1 AND YEAR(transactionDate) = YEAR(now()) GROUP BY monthname
    )B ON A.monthname= B.monthname ORDER BY A.month ASC`, (err, salesResults, fields) => {
    let tr = salesResults.reduce((temp, data)=>{
      return temp += data.total
    }, 0)
    let tqs = salesResults.reduce((temp, data)=>{
      return temp += data.qty
    }, 0)
    tr = priceFormat(tr.toFixed(2))
    if (err) console.log(err);
    res.send({sales: salesResults, tr: tr, tqs: tqs, chartYear: req.now.currentYear})
  });
});
router.get('/customer/loadChart', checkUser, auth_admin, now, (req,res)=>{
  db.query(`SELECT A.monthname, IF(B.qty IS NULL, 0, B.qty )qty FROM (
	  SELECT MONTHNAME(STR_TO_DATE(1, '%m'))monthname, (1)month
    UNION SELECT MONTHNAME(STR_TO_DATE(2, '%m'))monthname, (2)month
    UNION SELECT MONTHNAME(STR_TO_DATE(3, '%m'))monthname, (3)month
    UNION SELECT MONTHNAME(STR_TO_DATE(4, '%m'))monthname, (4)month
    UNION SELECT MONTHNAME(STR_TO_DATE(5, '%m'))monthname, (5)month
    UNION SELECT MONTHNAME(STR_TO_DATE(6, '%m'))monthname, (6)month
    UNION SELECT MONTHNAME(STR_TO_DATE(7, '%m'))monthname, (7)month
    UNION SELECT MONTHNAME(STR_TO_DATE(8, '%m'))monthname, (8)month
    UNION SELECT MONTHNAME(STR_TO_DATE(9, '%m'))monthname, (9)month
    UNION SELECT MONTHNAME(STR_TO_DATE(10, '%m'))monthname, (10)month
    UNION SELECT MONTHNAME(STR_TO_DATE(11, '%m'))monthname, (11)month
    UNION SELECT MONTHNAME(STR_TO_DATE(12, '%m'))monthname, (12)month
    )A LEFT JOIN (SELECT MONTHNAME(created_at)monthname, COUNT(intUserID)qty FROM tbluser
		WHERE intUserTypeNo= 3 GROUP BY MONTH(created_at) )B ON A.monthname= B.monthname
    ORDER BY A.month ASC`, (err, customerResults, fields) => {
    if (err) console.log(err);
    res.send({customer: customerResults, chartYear: req.now.currentYear})
  });
});


// excel
router.get('/salesAnnualExport', checkUser, auth_admin, now, yearsAvailable, (req,res)=>{
  let specification = {
    col_date: {
      displayName: 'Date',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 120
    },
    col_total: {
      displayName: 'Total Revenue',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 100
    },
    col_sold: {
      displayName: 'Products Sold',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 100
    }
  }
  let dataset = [
    {col_date: '-', col_total: '-', col_sold: '-'}
  ]

  let year = req.yearsAvailable.reduce((temp,data)=>{
    return data.year == req.query.year ? data.year : temp;
  },null);

  if(year){
    db.query(`SELECT MONTH(transactionDate)month, MONTHNAME(transactionDate)monthname, SUM(amount)total, SUM(intQuantity)qty
      FROM tblsales INNER JOIN tblorderdetails USING(intOrderNo)
      WHERE tblsales.intStatus= 1 AND YEAR(transactionDate) = ? GROUP BY monthname`,
      [year], (err, results, fields) => {
      if (err) console.log(err);

      if (results[0]){
        dataset = results.reduce((arr, data)=>{
          arr.push({col_date: data.monthname, col_total: priceFormat(data.total.toFixed(2)), col_sold: data.qty})
          return arr
        },[])
      }

      let report = excel.buildExport(
        [
          {
            name: 'Report',
            specification: specification,
            data: dataset
          }
        ]
      );
      res.attachment(`Annual Sales Report - ${year}.xlsx`);
      return res.send(report);

    });
  }
  else{
    res.redirect(`/reports/sales`)
  }
});
router.get('/salesMonthExport', checkUser, auth_admin, now, yearsAvailable, (req,res)=>{
  let specification = {
    col_date: {
      displayName: 'Date',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 120
    },
    col_total: {
      displayName: 'Total Revenue',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 100
    },
    col_sold: {
      displayName: 'Products Sold',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 100
    }
  }
  let dataset = [
    {col_date: '-', col_total: '-', col_sold: '-'}
  ]

  headerMonth
  let month = monthNames.reduce((temp,data)=>{
    return data == req.query.month ? data : temp;
  },null);
  let year = req.yearsAvailable.reduce((temp,data)=>{
    return data.year == req.query.year ? data.year : temp;
  },null);

  if(month && year){
    db.query(`SELECT DATE(transactionDate)date, SUM(amount)total, SUM(intQuantity)qty
      FROM tblsales INNER JOIN tblorderdetails USING(intOrderNo)
      WHERE tblsales.intStatus= 1 AND monthname(transactionDate) = ? AND YEAR(transactionDate) = ?
      GROUP BY date`, [req.query.month, req.query.year], (err, results, fields) => {
      if (err) console.log(err);

      if (results[0]){
        dataset = results.reduce((arr, data)=>{
          arr.push({col_date: moment(data.date).format('MM/DD/YYYY'), col_total: priceFormat(data.total.toFixed(2)), col_sold: data.qty})
          return arr
        },[])

        let report = excel.buildExport(
          [
            {
              name: 'Report',
              specification: specification,
              data: dataset
            }
          ]
        );
        res.attachment(`Monthly Sales Report - ${month} ${year}.xlsx`);
        return res.send(report);
      }
      else{
        res.redirect(`/reports/sales`)
      }

    });
  }
  else{
    res.redirect(`/reports/sales`)
  }
});
router.get('/salesDailyExport', checkUser, auth_admin, now, datesAvailable, (req,res)=>{
  let specification = {
    col_no: {
      displayName: 'No',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 100
    },
    col_name: {
      displayName: 'Product Name',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 300
    },
    col_qty: {
      displayName: 'Quantity Bought',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 100
    },
    col_sales: {
      displayName: 'Sales',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 100
    }
  }
  let dataset = [
    {col_no: '-', col_name: '-', col_qty: '-', col_sales: '-'}
  ]

  let dailyDate = req.datesAvailable.reduce((temp,data)=>{
    return data.date == req.query.date ? data.date : temp;
  },null);

  if(dailyDate){
    db.query(`SELECT intProductNo, strBrand, strProductName, SUM(tblorderdetails.intQuantity)qty,
      SUM(tblorderdetails.purchasePrice*tblorderdetails.intQuantity)total FROM tblsales
      INNER JOIN tblorderdetails USING(intOrderNo)
      INNER JOIN tblproductinventory USING(intInventoryNo)
      INNER JOIN tblproductlist USING(intProductNo)
      INNER JOIN tblproductbrand USING(intBrandNo)
      WHERE tblsales.intStatus = 1 AND date(transactionDate) = ?
      GROUP BY intProductNo`,
      [dailyDate], (err, results, fields) => {
      if (err) console.log(err);

      if (results[0]){
        dataset = results.reduce((arr, data)=>{
          arr.push({col_no: data.intProductNo, col_name: `${data.strBrand} ${data.strProductName}`, col_qty: data.qty, col_sales: priceFormat(data.total.toFixed(2))})
          return arr
        },[])
        let report = excel.buildExport(
          [
            {
              name: 'Report',
              specification: specification,
              data: dataset
            }
          ]
        );
        res.attachment(`Daily Sales Report - ${moment(dailyDate).format('MM-DD-YYYY')}.xlsx`);
        return res.send(report);

      }
      else{
        res.redirect(`/reports/sales`)
      }

    });
  }
  else{
    res.redirect(`/reports/sales`)
  }
});
router.get('/notMovingExport', checkUser, auth_admin, now, (req,res)=>{
  let specification = {
    col_name: {
      displayName: 'Product Name',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 500
    },
    col_stock: {
      displayName: 'Remaining Stock',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 100
    }
  }
  let dataset = [
    {col_name: '-', col_stock: '-'}
  ]

  let notMoveDate = [];
  if (req.query.notMoveDate == 'now'){
    notMoveDate[0] = req.now.currentDate
    notMoveDate[1] = req.now.currentDate
  }
  else {
    notMoveDate = req.query.notMoveDate.split(" - ");
    notMoveDate[0] = moment(notMoveDate[0]).format('YYYY-MM-DD')
    notMoveDate[1] = moment(notMoveDate[1]).format('YYYY-MM-DD')
  }

  if(notMoveDate[0] != 'Invalid date' && notMoveDate[1] != 'Invalid date'){
    db.query(`SELECT * FROM(SELECT tblproductinventory.intInventoryNo, strBrand, strProductName,
    	strVariant, intSize, strUnitName, (tblproductinventory.intQuantity - intReservedItems)stock, A.intSalesNo
    	FROM tblproductlist INNER JOIN tblproductbrand USING(intBrandNo) INNER JOIN tblproductinventory USING(intProductNo)
    	INNER JOIN tbluom USING(intUomNo) LEFT JOIN tblorderdetails USING(intInventoryNo) LEFT JOIN (
  		SELECT * FROM tblsales WHERE intStatus = 1 AND transactionDate >= ? AND transactionDate <= ? )A USING(intOrderNo)
    	GROUP BY tblproductinventory.intInventoryNo)B WHERE B.intSalesNo IS NULL`,
      [notMoveDate[0], notMoveDate[1]], (err, results, fields) => {
      if (err) console.log(err);
      if (results[0]){
        dataset = results.reduce((arr, data)=>{
          arr.push({col_name: `${data.strBrand} ${data.strProductName} ${sizeString(data)}`, col_stock: data.stock})
          return arr
        },[])

        let report = excel.buildExport(
          [
            {
              name: 'Report',
              specification: specification,
              data: dataset
            }
          ]
        );
        res.attachment(`Not Moving Inventory Report - ${moment(notMoveDate[0]).format('MM-DD-YYYY')} - ${moment(notMoveDate[1]).format('MM-DD-YYYY')}.xlsx`);
        return res.send(report);

      }
      else{
        res.redirect(`/reports/inventory`)
      }


    });
  }
  else{
    res.redirect(`/reports/inventory`)
  }
});
router.get('/totalValueExport', checkUser, auth_admin, (req,res)=>{
  let specification = {
    col_name: {
      displayName: 'Product Name',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 500
    },
    col_stock: {
      displayName: 'Stock Quantity',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 100
    },
    col_total: {
      displayName: 'Total Value',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 100
    }
  }
  let dataset = [
    {col_name: '-', col_stock: '-', col_total: '-'}
  ]

  db.query(`SELECT tblproductinventory.intInventoryNo, strBrand, strProductName,
    strVariant, intSize, strUnitName, (tblproductinventory.intQuantity)stock, (tblproductinventory.intQuantity*productPrice)totalValue
    FROM tblproductlist INNER JOIN tblproductbrand USING(intBrandNo) INNER JOIN tblproductinventory USING(intProductNo)
    INNER JOIN tbluom USING(intUomNo) LEFT JOIN tblorderdetails USING(intInventoryNo)
    GROUP BY tblproductinventory.intInventoryNo ORDER BY totalValue DESC` , (err, results, fields) => {
    if (err) console.log(err);
    if (results[0]){
      dataset = results.reduce((arr, data)=>{
        arr.push({col_name: `${data.strBrand} ${data.strProductName} ${sizeString(data)}`, col_stock: data.stock, col_total: priceFormat(data.totalValue.toFixed(2))})
        return arr
      },[])

      let report = excel.buildExport(
        [
          {
            name: 'Report',
            specification: specification,
            data: dataset
          }
        ]
      );
      res.attachment(`Total Value Inventory Report.xlsx`);
      return res.send(report);
    }
  });
});
router.get('/damagedAnnualExport', checkUser, auth_admin, now, yearsAvailableDamaged, (req,res)=>{
  let specification = {
    col_date: {
      displayName: 'Date',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 120
    },
    col_total: {
      displayName: 'Total Product Disposal',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 150
    }
  }
  let dataset = [
    {col_date: '-', col_total: '-'}
  ]

  let year = req.yearsAvailableDamaged.reduce((temp,data)=>{
    return data.year == req.query.year ? data.year : temp;
  },null);

  if(year){
    db.query(`SELECT MONTHNAME(pullOutDate)monthname, SUM(intQuantity)total
      FROM tblstockpullout WHERE YEAR(pullOutDate) = ? GROUP BY monthname`,
      [year], (err, results, fields) => {
      if (err) console.log(err);

      if (results[0]){
        dataset = results.reduce((arr, data)=>{
          arr.push({col_date: data.monthname, col_total: data.total})
          return arr
        },[])
      }

      let report = excel.buildExport(
        [
          {
            name: 'Report',
            specification: specification,
            data: dataset
          }
        ]
      );
      res.attachment(`Annual Damage Report - ${year}.xlsx`);
      return res.send(report);

    });
  }
  else{
    res.redirect(`/reports/damage`)
  }
});
router.get('/damagedMonthExport', checkUser, auth_admin, now, yearsAvailableDamaged, (req,res)=>{
  let specification = {
    col_date: {
      displayName: 'Date',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 120
    },
    col_total: {
      displayName: 'Total Product Disposal',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 150
    }
  }
  let dataset = [
    {col_date: '-', col_total: '-'}
  ]

  headerMonth
  let month = monthNames.reduce((temp,data)=>{
    return data == req.query.month ? data : temp;
  },null);
  let year = req.yearsAvailableDamaged.reduce((temp,data)=>{
    return data.year == req.query.year ? data.year : temp;
  },null);

  if(month && year){
    db.query(`SELECT DATE(pullOutDate)date, SUM(intQuantity)qty FROM tblstockpullout
      WHERE monthname(pullOutDate) = ? AND YEAR(pullOutDate) = ?
      GROUP BY date`, [req.query.month, req.query.year], (err, results, fields) => {
      if (err) console.log(err);

      if (results[0]){
        dataset = results.reduce((arr, data)=>{
          arr.push({col_date: moment(data.date).format('MM/DD/YYYY'), col_total: data.qty})
          return arr
        },[])

        let report = excel.buildExport(
          [
            {
              name: 'Report',
              specification: specification,
              data: dataset
            }
          ]
        );
        res.attachment(`Monthly Damage Report - ${month} ${year}.xlsx`);
        return res.send(report);
      }
      else{
        res.redirect(`/reports/damage`)
      }

    });
  }
  else{
    res.redirect(`/reports/damage`)
  }
});
router.get('/damagedDailyExport', checkUser, auth_admin, now, datesAvailableDamaged, (req,res)=>{
  let specification = {
    col_no: {
      displayName: 'No',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 100
    },
    col_name: {
      displayName: 'Product Name',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 500
    },
    col_qty: {
      displayName: 'Total Pull-outs',
      headerStyle: styles.headerBG,
      cellStyle: 'none',
      width: 120
    },
  }
  let dataset = [
    {col_no: '-', col_name: '-', col_qty: '-'}
  ]

  let dailyDate = req.datesAvailableDamaged.reduce((temp,data)=>{
    return data.date == req.query.date ? data.date : temp;
  },null);

  if(dailyDate){
    db.query(`SELECT tblproductinventory.intInventoryNo, strBrand, strProductName, strVariant, intSize, strUnitName, SUM(tblstockpullout.intQuantity)qty FROM tblstockpullout
      INNER JOIN tblproductinventory USING(intInventoryNo) INNER JOIN tbluom USING(intUomNo)
      INNER JOIN tblproductlist USING(intProductNo) INNER JOIN tblproductbrand USING(intBrandNo) WHERE date(pullOutDate) = ?
      GROUP BY tblproductinventory.intInventoryNo`, [dailyDate], (err, results, fields) => {
      if (err) console.log(err);

      if (results[0]){
        dataset = results.reduce((arr, data)=>{
          arr.push({col_no: data.intInventoryNo, col_name: `${data.strBrand} ${data.strProductName} ${sizeString(data)}`, col_qty: data.qty})
          return arr
        },[])
        let report = excel.buildExport(
          [
            {
              name: 'Report',
              specification: specification,
              data: dataset
            }
          ]
        );
        res.attachment(`Daily Damage Report - ${moment(dailyDate).format('MM-DD-YYYY')}.xlsx`);
        return res.send(report);

      }
      else{
        res.redirect(`/reports/damage`)
      }

    });
  }
  else{
    res.redirect(`/reports/damage`)
  }
});

exports.reports = router;
