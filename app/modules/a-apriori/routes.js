var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
var path = require('path');
var fs = require('fs');

const excel = require('node-excel-export');
const csv = require('csvtojson');
const csvFilePath= path.join(__dirname,'report.csv');

//Here you specify the export structure
const specification = {
  transaction: { // <- the key should match the actual data key
    displayName: 'transaction'
  },
  date: {
    displayName: 'date'
  },
  shipping: {
    displayName: 'shipping'
  },
  inventory: {
    displayName: 'inventory'
  },
  details: {
    displayName: 'details'
  },
  quantity: {
    displayName: 'quantity'
  }
}

//Array of objects representing heading rows (very top)
const heading = [
  [{value: 'transaction'}, {value: 'date'}, {value: 'shipping'}, {value: 'inventory'}, {value: 'details'}, {value: 'quantity'}],
  ['transaction', 'date', 'shipping', 'inventory','details','quantity'] // <-- It can be only values
];

const dataset = [
  {transaction: 'IBM', date: 1, shipping: 'some note', inventory: 'not shown', details: 's', quantity: '9'}
];


var report =  excel.buildExport(
    [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
      {
        name: 'report', // <- Specify sheet name (optional)
         heading: heading, // <- Raw heading array (optional)
        // merges: merges, // <- Merge cell ranges
         specification: specification, // <- Report specification
        data: dataset // <-- Report data
      }
    ]
  );



router.get('/',(req,res)=>{

  db.query(`Select tblOrder.intOrderNo as order_no, tblOrder.dateOrdered as date_ordered,
  tblOrder.strshippingAddress as address, tblOrderDetails.intInventoryNo as inventory_no,
  tblProductList.strProductname as product, tblOrderdetails.intQuantity as quantity,
  tblproductInventory.*, tbluom.*, tblProductList.*

  from tblOrder join tblOrderDetails on tblOrder.intOrderno = tblOrderDetails.intOrderno
  join tblProductInventory on tblOrderDetails.intInventoryNo = tblProductInventory.intInventoryno
  join tblProductlist on tblProductList.intProductNo = tblProductInventory.intProductNo
  join tblUom on tbluom.intuomno = tblProductInventory.intUomno`,(err,resu,fie)=>{
    if(err) console.log(err);
    else{
      if(resu==null||resu==undefined){

      }else if(resu.length==0){

      }else{
        resu.forEach(function(i){
          // var product = i.product + " " + i.strVariant + " " + i.intSize + " " + i.strUnitName;
          // dataset.push({transaction: i.order_no, date: i.date_ordered, shipping: i.address,
          // inventory: i.inventory_no, details: product, quantity: i.quantity})
        })



          //console.log(report);
          res.attachment(csvFilePath); // This is sails.js specific (in general you need to set headers)
          return res.send(report);
      }
    }
  });

  // fs.writeFile(csvFilePath,report,function(err){
  //   if(err) throw err;
  //   console.log('saved');
  // })


})

exports.apriori = router;
