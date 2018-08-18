const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');
const moment = require('moment');
const firstID = 1000;
const quantLimit = 50;

function newOrderNo (req, res, next){
  db.query(`SELECT * FROM tblorder ORDER BY intOrderNo DESC LIMIT 1`, (err, results, fields) => {
    if (err) console.log(err);
    req.newOrderNo = results[0] ? parseInt(results[0].intOrderNo)+1 : firstID;
    return next();
  });
}
function newOrderDetailsNo (req, res, next){
  db.query(`SELECT * FROM tblorderdetails ORDER BY intOrderDetailsNo DESC LIMIT 1`, (err, results, fields) => {
    if (err) console.log(err);
    req.newOrderDetailsNo = results[0] ? parseInt(results[0].intOrderDetailsNo)+1 : firstID;
    return next();
  });
}

function checkUser (req, res, next){
  if(!req.user){
    req.session.pendRoute = 2;
    req.flash('regSuccess', 'Login to proceed to Checkout');
    res.redirect('/login');
  }
  else{
    req.session.pendRoute = 0;
    return next();
  }
}
function checkUserOrder (req, res, next){
  if(!req.user){
    req.session.pendRoute = 3;
    req.flash('regSuccess', 'Login to proceed to View Order');
    res.redirect('/login');
  }
  else{
    req.session.pendRoute = 0;
    return next();
  }
}
function contactDetails (req, res, next){
  db.query(`SELECT * FROM tbluser
    INNER JOIN tblcustomer ON tbluser.intUserID= tblcustomer.intUserID
    WHERE tbluser.intUserID= ?`,[req.user.intUserID], (err, results, fields) => {
    if (err) console.log(err);
    req.contactDetails = results[0];
    return next();
  });
}
function checkUpdateOrder (req, res, next){
  if (!req.user){
    res.redirect('/home');
  }
  else{
    db.beginTransaction(function(err) {
      if (err) console.log(err);
      db.query(`SELECT * FROM tblorder WHERE intOrderNo= ? AND intStatus IS NULL AND intUserID= ?`,[req.params.orderNo, req.user.intUserID], (err,results,fields)=> {
        if (err) console.log(err);
        if (results[0]){
          req.checkUpdateOrder = results[0].intPaymentMethod;
          db.query(`UPDATE tblorder SET intStatus= 0 WHERE intOrderNo= ?`,[req.params.orderNo], (err,results,fields)=>{
            if (err) console.log(err);
            db.commit(function(err) {
              if (err) console.log(err);
              return next();
            });
          });
        }
        else{
          db.commit(function(err) {
            if (err) console.log(err);
            res.redirect('/summary/success')
          });
        }
      });
    });
  }
}
function orderTotal (req, res, next){
  db.query(`SELECT SUM(purchasePrice*intQuantity)totalPrice FROM tblorder
  INNER JOIN tblorderdetails ON tblorder.intOrderNo= tblorderdetails.intOrderNo
  WHERE tblorder.intOrderNo= ?`,[req.params.orderNo], (err, results, fields) => {
    if (err) console.log(err);
    results[0].totalPrice ? results.map( obj => obj.totalPrice = priceFormat(obj.totalPrice.toFixed(2)) ) : 0
    req.orderTotal = results[0];
    return next();
  });
}
function orderProductQty (req, res, next){
  db.query(`SELECT (tblproductinventory.intInventoryNo)Inv, (tblorderdetails.intQuantity)Qty FROM tblproductinventory
    INNER JOIN tblorderdetails ON tblproductinventory.intInventoryNo= tblorderdetails.intInventoryNo
    INNER JOIN tblorder ON tblorderdetails.intOrderNo= tblorder.intOrderNo
    WHERE tblorder.intOrderNo= ?`,[req.body.orderNo], (err, results, fields) => {
    if (err) console.log(err);
    req.orderProductQty = results;
    return next();
  });
}
function cartCheck (req, res, next){
  function cartLimitLoop(i){
    let cart = req.session.cart;
    db.query(`SELECT (SUM(intQuantity) - SUM(intReservedItems))stock FROM tblbatch WHERE intInventoryNo= ?`
      , [req.session.cart[i].inv], (err, results, fields) => {
      if (err) console.log(err);
      req.session.cart[i].limit = results[0].stock > quantLimit ?
        quantLimit : results[0].stock;
      req.session.cart[i].curQty > req.session.cart[i].limit ?
        req.session.cart[i].curQty = req.session.cart[i].limit : 0;
      results[0].stock < 1 ? req.session.cart.splice(i,1) : 0
      ++i;
      if (cart.length > i){
        cartLimitLoop(i);
      }
      else{
        if (req.session.cart.length){
          return next();
        }
        else{
          res.redirect('/summary/checkout');
        }
      }
    });
  }
  req.session.cart.length ? cartLimitLoop(0) : res.redirect('/summary/checkout');

}

router.get('/checkout', checkUser, contactDetails, (req,res)=>{
  res.render('cust-summary/views/checkout', {thisUser: req.user, thisUserContact: req.contactDetails});
});
router.get('/order/:orderNo', orderTotal, (req,res)=>{
  db.query(`SELECT *, (tblorder.intStatus)orderStatus, (tblorderdetails.intQuantity)orderQty FROM tblorder
    INNER JOIN tblorderdetails ON tblorder.intOrderNo= tblorderdetails.intOrderNo
    INNER JOIN tblproductinventory ON tblorderdetails.intInventoryNo= tblproductinventory.intInventoryNo
    INNER JOIN tblproductlist ON tblproductinventory.intProductNo= tblproductlist.intProductNo
    INNER JOIN tblproductbrand ON tblproductlist.intBrandNo= tblproductbrand.intBrandNo
    INNER JOIN tbluom ON tblproductinventory.intUOMno= tbluom.intUomNo
    WHERE tblorder.intOrderNo= ? AND tblorder.intUserID= ?`,[req.params.orderNo, req.user.intUserID], (err, results, fields) => {
    if (err) console.log(err);
    if (results[0]){
      results.map( obj => obj.dateOrdered = moment(obj.dateOrdered).format('ll') );
      results.map( obj => obj.productPrice = priceFormat(obj.productPrice.toFixed(2)) );
      res.render('cust-summary/views/order', {
        thisUser: req.user,
        order: results,
        orderOne: results[0],
        orderNumber: req.params.orderNo,
        orderTotal: req.orderTotal.totalPrice
      });
    }
    else{
      res.redirect('/summary')
    }
  });
});
router.get('/success/:orderNo', checkUpdateOrder, (req,res)=>{
  res.render('cust-summary/views/orderSuccess', {
    thisUser: req.user,
    orderNumber: req.params.orderNo,
    checkUpdateOrder: req.checkUpdateOrder
  });
});
router.get('/voucher/:orderNo', orderTotal, (req,res)=>{
  if (!req.user){
    res.send('none')
  }
  else{
    db.query(`SELECT * FROM tblorder
      INNER JOIN tbluser ON tblorder.intUserID= tbluser.intUserID
      WHERE intOrderNo= ? AND tbluser.intUserID= ? AND (intStatus= 0 OR intStatus= 1 OR intStatus= 2)`,[req.params.orderNo, req.user.intUserID],(err,results,fields)=>{
      if (err) console.log(err);
      if (results[0]){
        results.map( obj => obj.dateOrdered = moment(obj.dateOrdered).format('LL') );
        results.map( obj => obj.paymentDue = moment(obj.paymentDue).format('LL') );
        res.send({order: results[0], orderTotal: req.orderTotal.totalPrice})
      }
      else{
        res.send('none')
      }
    });
  }
})
router.get('/receipt/:orderNo', (req,res)=>{
  if (!req.user){
    res.send('none')
  }
  else{
    db.query(`SELECT (customer.strFname)customerF, (customer.strMname)customerM, (customer.strLname)customerL, orders.*, tblorder.*
    FROM tblorder
    INNER JOIN (SELECT * FROM tbluser)customer ON tblorder.intUserID= customer.intUserID
    INNER JOIN (SELECT tblorderdetails.*, strBrand, strProductName, intSize, strUnitName, (purchasePrice*tblorderdetails.intQuantity)amount, (purchasePrice-(purchasePrice*0.12))priceNonVAT, ((purchasePrice-(purchasePrice*0.12))*tblorderdetails.intQuantity)amountNonVAT
    FROM tblorderdetails INNER JOIN tblproductinventory ON tblorderdetails.intInventoryNo= tblproductinventory.intInventoryNo
    INNER JOIN tblproductlist ON tblproductinventory.intProductNo= tblproductlist.intProductNo
    INNER JOIN tblproductbrand ON tblproductlist.intBrandNo= tblproductbrand.intBrandNo
    INNER JOIN tbluom ON tblproductinventory.intUOMno= tbluom.intUOMno)orders ON orders.intOrderNo= tblorder.intOrderNo
    WHERE tblorder.intOrderNo= ? AND customer.intUserID= ? ORDER BY orders.intOrderDetailsNo`
    ,[req.params.orderNo, req.user.intUserID], (err, results, fields) => {
      if (err) console.log(err);
      if (results[0]){
        let totalNonVAT = results.reduce((data, obj)=>{
          return data + obj.amountNonVAT
          console.log(data)
        }, 0);
        let totalPrice = results.reduce((data, obj)=>{
          return data + obj.amount
        }, 0);
        let vat = totalPrice - totalNonVAT;
        results.map( obj => obj.dateOrdered = moment(obj.dateOrdered).format('MM/DD/YY') );
        results.map( obj => obj.priceNonVAT = priceFormat(obj.priceNonVAT.toFixed(2)) );
        results.map( obj => obj.amountNonVAT = priceFormat(obj.amountNonVAT.toFixed(2)) );
        totalNonVAT = priceFormat(totalNonVAT.toFixed(2));
        totalPrice = priceFormat(totalPrice.toFixed(2));
        vat = priceFormat(vat.toFixed(2));

        res.send({
          receipt: results,
          receiptNonVAT: totalNonVAT,
          vat: vat,
          receiptTotal: totalPrice,
        })
        // console.log(results)
      }
      else{
        res.send('none')
      }
    });
  }
})

router.post('/checkout', checkUser, contactDetails, newOrderNo, newOrderDetailsNo, cartCheck, (req,res)=>{
  db.beginTransaction(function(err) {
    if (err) console.log(err);
    let thisOrderNo = req.newOrderNo;
    db.query(`INSERT INTO tblorder (intOrderNo, intUserID, intPaymentMethod, strShippingAddress, strBillingAddress, paymentDue)
      VALUES (?,?,?,?,?,CURDATE() + INTERVAL 1 DAY)`,[thisOrderNo, req.user.intUserID, req.body.paymentMethod, req.contactDetails.strShippingAddress, req.contactDetails.strBillingAddress ], (err, results, fields) => {
      if (err) console.log(err);
      function multiInsert(i){
        let cart = req.session.cart;
        db.query(`INSERT INTO tblorderdetails (intOrderDetailsNo, intOrderNo, intInventoryNo, intStatus, purchasePrice, intQuantity)
          VALUES (?,?,?,?,?,?)`,[req.newOrderDetailsNo + i, thisOrderNo, cart[i].inv, 1, cart[i].curPrice, cart[i].curQty], (err, results, fields) => {
          if (err) console.log(err);
          stockControl(cart,i,0)

        });
      }
      function stockControl(cart,i,j){
        db.query(`SELECT * FROM(SELECT intBatchNo, (intQuantity - intReservedItems)stock, intQuantity, intReservedItems, created_at FROM tblbatch
          WHERE intInventoryNo= ? ORDER BY created_at LIMIT ?)A ORDER BY A.created_at DESC LIMIT 1 `,[cart[i].inv, j+1], (err, results, fields) => {
          if (err) console.log(err);
          ++j;
          let thisBatchNo = results[0].intBatchNo;
          if (results[0].stock == 0){
            stockControl(cart,i,j);
          }
          else{
            let newQty = cart[i].curQty >= results[0].stock ?
              results[0].intQuantity : cart[i].curQty + results[0].intReservedItems;
            cart[i].curQty -= results[0].stock;

            db.query(`UPDATE tblbatch SET intReservedItems= ? WHERE intBatchNo= ?`,[newQty, thisBatchNo], (err, results1, fields) => {
              if (err) console.log(err);
              if (cart[i].curQty > 0){
                stockControl(cart,i,j);
              }
              else{
                ++i;
                if (cart.length > i){
                  multiInsert(i);
                }
                else{
                  db.commit(function(err) {
                    if (err) console.log(err);
                    req.session.cart = null;
                    res.redirect(`/summary/success/${thisOrderNo}`);
                  });
                }
              }
            });
          }

        });
      }

      req.session.cart ? multiInsert(0) : res.redirect(`/summary/success`);
    });
  });
});
router.post('/checkout/address', checkUser, (req,res)=>{
  db.query(`UPDATE tblcustomer SET strShippingAddress= ?, strBillingAddress= ? WHERE intUserID= ?`,
    [req.body.sa, req.body.ba, req.user.intUserID], (err, results, fields) => {
    if (err) console.log(err);
    res.redirect('/summary/checkout');
  });
})
router.post('/order/cancel', checkUserOrder, orderProductQty, (req,res)=>{
  let reason = req.body.cancelreason == 'other' ? req.body.canceldesc : req.body.cancelreason
  db.beginTransaction(function(err) {
    if (err) console.log(err);
    db.query(`UPDATE tblorder SET intStatus= 6, strCancellationReason= ? WHERE intOrderNo= ?`,
      [reason, req.body.orderNo], (err, results, fields) => {
      if (err) console.log(err);
      function stockReturn(i,j){
        db.query(`SELECT * FROM(SELECT intBatchNo, intQuantity, intReservedItems, created_at FROM tblbatch
          WHERE intInventoryNo= ? ORDER BY created_at DESC LIMIT ?)A ORDER BY A.created_at ASC LIMIT 1`,
          [req.orderProductQty[i].Inv, j+1], (err, results, fields) => {
          if (err) console.log(err);
          ++j;
          let thisBatchNo = results[0].intBatchNo;
          if (results[0].intReservedItems == 0){
            stockReturn(i,j);
          }
          else {
            let newQty = req.orderProductQty[i].Qty >= results[0].intReservedItems ?
              0 : results[0].intReservedItems - req.orderProductQty[i].Qty;
            req.orderProductQty[i].Qty -= results[0].intReservedItems;

            db.query(`UPDATE tblbatch SET intReservedItems= ? WHERE intBatchNo= ?`,[newQty, thisBatchNo], (err, results1, fields) => {
              if (err) console.log(err);
              if (req.orderProductQty[i].Qty > 0){
                stockReturn(i,0);
              }
              else {
                ++i;
                if (req.orderProductQty.length > i){
                  stockReturn(i,0);
                }
                else{
                  db.commit(function(err) {
                    if (err) console.log(err);
                    res.redirect('/account/orders');
                  });
                }
              }
            });
          }
        });
      }

      req.session.cart ? stockReturn(0,0) : res.redirect(`/summary/success`);
    });
  });
})

exports.summary = router;
