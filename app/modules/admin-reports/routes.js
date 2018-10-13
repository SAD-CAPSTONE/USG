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
  db.query(`SELECT YEAR(tblsales.transactionDate)year FROM tblsales GROUP BY year`, (err, results, fields) => {
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

router.get('/', (req,res)=>{
  res.render('admin-reports/views/reports');
});
router.get('/sales',(req,res)=>{
  res.render('admin-reports/views/sales');
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
      res.attachment(`Annual Sales Report - ${year} .csv`);
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
        res.attachment(`Monthly Sales Report - ${month} ${year}.csv`);
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
        res.attachment(`Daily Sales Report - ${moment(dailyDate).format('MM-DD-YYYY')} .csv`);
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
        res.attachment(`Not Moving Inventory Report - ${moment(notMoveDate[0]).format('MM-DD-YYYY')} - ${moment(notMoveDate[1]).format('MM-DD-YYYY')}.csv`);
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
      res.attachment(`Total Value Inventory Report.csv`);
      return res.send(report);
    }
  });
});

exports.reports = router;
