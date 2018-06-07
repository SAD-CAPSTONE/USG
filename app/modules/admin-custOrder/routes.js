var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');


router.get('/', (req,res)=>{
  res.render('admin-custOrder/views/allOrders');
});

router.get('/allOrders', (req,res)=>{
  db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.* from tblOrder join tblUser on tblOrder.intUserID = tblUser.intUserID
join tblCustomer on tblUser.intUserID = tblCustomer.intUSerID`, (err1,results1,fields1)=>{
  if (err1) console.log(err1);
  res.render('admin-custOrder/views/allOrders', {re: results1, moment: moment});

});
});

router.get('/recentOrders', (req,res)=>{
  res.render('admin-custOrder/views/recentOrders');
});

router.get('/cancelledOrders', (req,res)=>{
  res.render('admin-custOrder/views/cancelledOrders');
});

router.get('/invoice', (req,res)=>{
  res.render('admin-custOrder/views/invoice');
});

router.get('/assessOrder',(req,res)=>{
  var orderno = req.query.order;

  // Order list
  db.query(`Select * from tblOrder
    join tblorderdetails on tblorder.intorderno = tblorderdetails.intorderno
    join tblproductlist on tblorderdetails.intproductno = tblproductlist.intproductno
    where tblOrder.intOrderno = ${orderno}`,(err1,results1,fields1)=>{
      if (err1) console.log(err1);

    // customer details
    db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.*
      from tblOrder join tblUser on tblOrder.intUSerID = tblUser.intUserID
      join tblCustomer on tblUser.intUserID = tblCustomer.intUserID
      where tblOrder.intOrderno = ${orderno}`,(err2,results2,fields2)=>{
        if (err2) console.log(err2);

      // total
      db.query(`Select SUM(tblorderdetails.intquantity * tblorderdetails.purchaseprice) as
        totalAll from tblOrder
        join tblorderdetails on tblorder.intorderno = tblorderdetails.intorderno
        join tblproductlist on tblorderdetails.intproductno = tblproductlist.intproductno
        where tblOrder.intOrderno = ${orderno}`, (err3,results3,fields3)=>{
          if (err3) console.log(err3);

        res.render('admin-custOrder/views/assessOrder', {orderlist: results1, customer: results2, moment: moment, total: results3[0].totalAll});

      });


    });

  });
});

router.post('/assessOrder',(req,res)=>{
  // change to transaction

  db.query(`Update tblOrder set intStatus = ${req.body.orderStatus}, strShippingMethod =
    "${req.body.shippingMethod}", strCourier = "${req.body.courier}" where intOrderNo = "${req.body.orderNo}" `, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    var historynum = 1000;
    var messagenum = 1000;
    db.query(`Select * from tblOrderHistory order by intOrderHistoryNo desc limit 1`,
      (err2,results2,fields2)=>{
      if (err2) console.log(err2);

      if (results2 == null || results2 == undefined || results2.length == 0){

      }else{
        historynum = parseInt(results2[0].intOrderHistoryNo) + 1;
      }

      db.query(`Select * from tblMessages order by intMessageNo desc limit 1`,
        (err3,results3, fields3)=>{
        if (err3) console.log(err3);

        if (results3 == null || results3 == undefined || results3.length == 0){

        }else{
          messagenum = parseInt(results3[0].intMessageNo) + 1;
        }

        if (req.body.notify == 1){
          // insert to message
          db.query(`Insert into tblMessages (intMessageNo, intOrderHistoryNo, strMessage,
            intAdminID) values ("${messagenum}", "${historynum}","${req.body.message}", "1000" )`,(err4,results4,fields4)=>{
            if (err4) console.log(err4);
          });
        }

        db.query(`Insert into tblOrderHistory (intOrderHistoryNo, intOrderNo,
          strShippingMethod, strCourier, intStatus, intAdminID, intMessageNo) values ("${historynum}", "${req.body.orderNo}", "${req.body.shippingMethod}","${req.body.courier}", ${req.body.orderStatus}, "1000", "${messagenum}")`, (err5,results5,fields5)=>{
          if (err5) console.log(err5);
          res.send("yes");

        });
      });

    });


  });
});

router.get('/orderHistory',(req,res)=>{
  var orderno = req.query.order;

  db.query(`Select * from tblOrderHistory where intOrderNo = ${orderno}`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    res.render('admin-custOrder/views/orderHistory', {re: results1, moment: moment, order: orderno});
  });
});

router.get('/invoice', (req,res)=>{
  var orderno = req.query.order;

  // Order list
  db.query(`Select * from tblOrder
    join tblorderdetails on tblorder.intorderno = tblorderdetails.intorderno
    join tblproductlist on tblorderdetails.intproductno = tblproductlist.intproductno
    where tblOrder.intOrderno = ${orderno}`, (err1,results1,fields1)=>{
      if (err1) console.log(err1);

      // customer
      db.query(`Select tblOrder.intStatus as Stat, tblOrder.*, tblUser.*, tblCustomer.*
        from tblOrder join tblUser on tblOrder.intUSerID = tblUser.intUserID
        join tblCustomer on tblUser.intUserID = tblCustomer.intUserID
        where tblOrder.intOrderno = ${orderno}`, (err2,results2,fields2)=>{
          if (err2) console.log(err2);

          // total
          db.query(`Select SUM(tblorderdetails.intquantity * tblorderdetails.purchaseprice) as
            totalAll from tblOrder
            join tblorderdetails on tblorder.intorderno = tblorderdetails.intorderno
            join tblproductlist on tblorderdetails.intproductno = tblproductlist.intproductno
            where tblOrder.intOrderno = ${orderno}`, (err3,results3,fields3)=>{
              if (err3) console.log(err3);

              res.render('admin-custOrder/views/invoice', {orderlist: results1, customer: results2, total: results3[0].totalAll, moment: moment});
            });
        });
    });

});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.customerOrder = router;
