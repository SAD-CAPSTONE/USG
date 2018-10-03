var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');

router.get('/', (req,res)=>{
  res.render('admin-queries/views/queries');
});

router.get('/allProducts',(req,res)=>{
  db.query(`Select * from tblProductList`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      res.render('admin-queries/views/allProducts',{productss: res1})
    }
  })
});

var result ="";

router.get('/loader',(req,res)=>{
  res.render('admin-queries/views/inventoryTransactions',{re: result, moment: moment})

})

router.post('/search',(req,res)=>{

  var dates = (req.body.date).split('-');
  var newDate = moment(dates[0]).format("YYYY/MM/DD");
  var newDate1 = moment(dates[1]).format("YYYY/MM/DD");

  // inventory transactions
  if(req.body.string == 2){

    db.query(`Select * from tblInventoryTransactions
      join tblProductInventory on tblInventoryTransactions.intInventoryno = tblProductinventory.intInventoryno
      join tblProductlist on tblProductlist.intProductNo = tblProductInventory.intProductNo
      join tblUom on tblUom.intUOMno = tblProductInventory.intUomNo
       where transactionDate between '${newDate}' and '${newDate1}'`,(e,r,f)=>{
      if(e) console.log(e);
      else{
        result = r;
        res.send("yes");
      }
    })
  }
})

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.queries = router;
