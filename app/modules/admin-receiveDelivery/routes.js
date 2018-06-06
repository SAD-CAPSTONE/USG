var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
var async = require('async');

router.get('/', (req,res)=>{
  res.render('admin-receiveDelivery/views/receiveDelivery');
});

router.get('/form', (req,res)=>{

  // select last record of deliveries
  db.query(`Select * from tblreceiveOrder order by intreceiveorderno desc limit 1`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    // select from purchase order lists
    db.query(`Select * from tblPurchaseOrder join tblSupplier on tblPurchaseOrder.intSupplierID = tblSupplier.intUserID where tblPurchaseOrder.intStatus = 0`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);
      res.render('admin-receiveDelivery/views/receiveDeliveryForm', {re:results1,pu:results2, moment: moment});
    });
  });
});

router.post('/findNo', (req,res)=>{

  var number = "";
  if (req.body.o == null || req.body.o == " " || req.body.o == undefined || req.body.o == ""){
    number = 0;
  }else{
    number = req.body.o;
  }

  db.query(`Select * from tblPurchaseOrder where intPurchaseOrderNo = ${number}`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    if (results1 == undefined || results1 == null || results1.length == 0){
      res.send("no");
    }else{
      res.send("yes");
    }
  });
});

router.post('/newDeliveryRecord', (req,res)=>{

  var counter = 0;
  var startNo = "";
  var loop = req.body.product;


  // insert to receiveDelivery table
  db.query(`Insert into tblreceiveOrder (intReceiveOrderNo, intPurchaseOrderNo, intAdminID,   specialNotes) values ("${req.body.rno}", "${req.body.POno}", "1000", "${req.body.note}")`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
  });

    // query the last received delivery note
  db.query(`Select * from tblReceiveOrderlist order by intOrderReceivedNo desc limit 1`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);

      if (results2 == null || results2 == undefined || results2.length == 0){
        startNo = "1000";
      }else{
        startNo = parseInt(results2[0].intOrderReceivedNo)+1;
      }



      async.eachSeries(loop,function(data,callback){

        var exdate = moment(req.body.expiration[counter]).format("YYYY-MM-DD");
        console.log(exdate);
        var d = "2001-02-31";
        db.query(`INSERT INTO tblreceiveorderlist (intOrderReceivedNo, intReceiveOrderNo, strProduct, strSize, strConsignmentPrice, intQuantity, SRP, dateExpiration, intOrderStatus, strVariant) VALUES ("${startNo}", "${req.body.rno}", "${req.body.product[counter]}", "${req.body.size[counter]}", "", "${req.body.quantity[counter]}", "${req.body.srp[counter]}", "${exdate}", "${req.body.status[counter]}", "${req.body.variant[counter]}")`, (err3,results3,fields3)=>{
          if (err3) console.log(err3);
          counter++;
          startNo++;
          callback();
        });
    }, function(err,results){
      if (err) console.log(err);
      console.log("Receive Delivery Done!");
    });

  });


});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.receiveDelivery = router;
