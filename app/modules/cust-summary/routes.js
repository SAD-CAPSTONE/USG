const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');
const moment = require('moment');
const userTypeAuth = require('../cust-0extras/userTypeAuth');
const auth_cust = userTypeAuth.cust;
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
function newOrderHistoryNo (req, res, next){
  db.query(`SELECT * FROM tblorderhistory ORDER BY intOrderHistoryNo DESC LIMIT 1`, (err, results, fields) => {
    if (err) console.log(err);
    req.newOrderHistoryNo = results[0] ? parseInt(results[0].intOrderHistoryNo)+1 : firstID;
    return next();
  });
}
function newMessageNo (req, res, next){
  db.query(`SELECT * FROM tblmessages ORDER BY intMessageNo DESC LIMIT 1`, (err, results, fields) => {
    if (err) console.log(err);
    req.newMessageNo = results[0] ? parseInt(results[0].intMessageNo)+1 : firstID;
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
function checkUserAccount(req, res, next){
  if(!req.user){
    req.session.pendRoute = 1;
    req.flash('regSuccess', 'Login to view Account Information');
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
    let cart = req.session.cart, stringquery1, bodyarray1;
    if (cart[i].type == 1){
      stringquery1 = `SELECT (intQuantity - intReservedItems)stock FROM tblproductinventory WHERE intInventoryNo= ?`
      bodyarray1 = [cart[i].inv]
    }
    else{
      stringquery1 = `SELECT (intQuantity - intReservedItems)stock FROM tblpackage WHERE intPackageNo= ?`
      bodyarray1 = [cart[i].package]
    }
    db.query(stringquery1, bodyarray1, (err, results, fields) => {
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
function admin (req, res, next){
  db.query(`SELECT * FROM tbladmin WHERE intUserID= 1000`, (err, results, fields) => {
    if (err) console.log(err);
    results[0].totalPrice ? results.map( obj => obj.totalPrice = priceFormat(obj.totalPrice.toFixed(2)) ) : 0

    results[0] ? results[0].bankServiceFee = priceFormat(results[0].bankServiceFee.toFixed(2)) : 0
    req.admin = results[0];
    return next();
  });
}
function thisOrder (req, res, next){
  db.query(`SELECT * FROM tblorder WHERE intOrderNo= ?`, [req.body.orderNo], (err, results, fields) => {
    if (err) console.log(err);
    req.thisOrder = results[0];
    return next();
  });
}
function orderPackages (req, res, next){
  db.query(`SELECT *, (tblorder.intStatus)orderStatus, (tblorderdetails.intQuantity)orderQty FROM tblorder
    INNER JOIN tblorderdetails ON tblorder.intOrderNo= tblorderdetails.intOrderNo
    INNER JOIN tblpackage ON tblorderdetails.intInventoryNo= tblpackage.intPackageNo
    WHERE tblorder.intOrderNo= ? AND tblorder.intUserID= ? AND tblorderdetails.intProductType= 2`,
    [req.params.orderNo, req.user.intUserID], (err, results, fields) => {
    if (err) console.log(err);
    let packageOrderLength = 0
    if (results[0]){
      results.map( obj => obj.packagePrice = priceFormat(obj.packagePrice.toFixed(2)) );
      packageOrderLength = results.reduce((temp, obj)=>{
        return temp += obj.orderQty
      },0)
    }
    req.orderPackages = results;
    req.packageOrderLength = packageOrderLength
    return next();
  });
}

router.get('/checkout', checkUser, auth_cust, contactDetails, admin, (req,res)=>{
  res.render('cust-summary/views/checkout', {
    thisUser: req.user,
    thisUserContact: req.contactDetails,
    admin: req.admin
  });
});
router.get('/order/:orderNo', checkUserAccount, auth_cust, orderTotal, orderPackages, admin, (req,res)=>{
  db.query(`SELECT *, (tblorder.intStatus)orderStatus, (tblorderdetails.intQuantity)orderQty FROM tblorder
    INNER JOIN tblorderdetails ON tblorder.intOrderNo= tblorderdetails.intOrderNo
    INNER JOIN tblproductinventory ON tblorderdetails.intInventoryNo= tblproductinventory.intInventoryNo
    INNER JOIN tblproductlist ON tblproductinventory.intProductNo= tblproductlist.intProductNo
    INNER JOIN tblproductbrand ON tblproductlist.intBrandNo= tblproductbrand.intBrandNo
    INNER JOIN tbluom ON tblproductinventory.intUOMno= tbluom.intUomNo
    WHERE tblorder.intOrderNo= ? AND tblorder.intUserID= ? AND tblorderdetails.intProductType= 1`,
    [req.params.orderNo, req.user.intUserID], (err, results, fields) => {
    if (err) console.log(err);
    if (results[0]){
      results.map( obj => obj.dateOrdered = moment(obj.dateOrdered).format('ll') );
      results.map( obj => obj.purchasePrice = priceFormat(obj.purchasePrice.toFixed(2)) );
      let orderLength = results.reduce((temp, obj)=>{
        return temp += obj.orderQty
      },0) + req.packageOrderLength;
      res.render('cust-summary/views/order', {
        thisUser: req.user,
        order: results,
        packages: req.orderPackages,
        orderLength: orderLength,
        orderOne: results[0],
        orderNumber: req.params.orderNo,
        orderTotal: req.orderTotal.totalPrice,
        admin: req.admin
      });
    }
    else{
      res.redirect('/summary')
    }
  });
});
router.get('/voucher/:orderNo', checkUserAccount, auth_cust, orderTotal, (req,res)=>{
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
router.get('/receipt/:orderNo', checkUserAccount, auth_cust, (req,res)=>{
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

router.post('/checkout', checkUser, auth_cust, contactDetails, newOrderNo, newOrderDetailsNo, newOrderHistoryNo, newMessageNo, cartCheck, admin, (req,res)=>{
  req.session.cart.forEach((data,i)=>{
    data.curQty == 0 ? req.session.cart.splice(i,1) : 0
  })
  db.beginTransaction(function(err) {
    if (err) console.log(err);
    let thisOrderNo = req.newOrderNo, thisOrderHistoryNo = req.newOrderHistoryNo, thisMessageNo = req.newMessageNo;
    db.query(`INSERT INTO tblorder (intOrderNo, intUserID, intPaymentMethod, strShippingAddress, strBillingAddress, paymentDue)
      VALUES (?,?,?,?,?,CURDATE() + INTERVAL 1 DAY)`,[thisOrderNo, req.user.intUserID, req.body.paymentMethod, req.contactDetails.strShippingAddress, req.contactDetails.strBillingAddress ], (err, results, fields) => {
      if (err) console.log(err);
      db.query(`INSERT INTO tblorderhistory (intOrderHistoryNo, intOrderNo, intAdminID, intMessageNo, strShippingAddress, strBillingAddress)
        VALUES (?,?,?,0,?,?)`,[thisOrderHistoryNo, thisOrderNo, 1000, req.contactDetails.strShippingAddress, req.contactDetails.strBillingAddress ], (err, results, fields) => {
        if (err) console.log(err);
        db.query(`INSERT INTO tblmessages (intMessageNo, intOrderHistoryNo, strMessage, intAdminID)
          VALUES (?,?,?,?)`,[thisMessageNo, thisOrderHistoryNo, `Order #${thisOrderNo} has been placed`, 1000], (err, results, fields) => {
          if (err) console.log(err);
          function multiInsert(i){
            let cart = req.session.cart;

            if (cart[i].type == 1){
              inv = cart[i].inv
              stringquery1 = `SELECT (intQuantity - intReservedItems)stock, intReservedItems FROM tblproductinventory WHERE intInventoryNo= ?`
              stringquery2 = `UPDATE tblproductinventory SET intReservedItems= ? WHERE intInventoryNo= ?`
            }
            else{
              inv = cart[i].package
              stringquery1 = `SELECT (intQuantity - intReservedItems)stock, intReservedItems FROM tblpackage WHERE intPackageNo= ?`
              stringquery2 = `UPDATE tblpackage SET intReservedItems= ? WHERE intPackageNo= ?`
            }

            db.query(`INSERT INTO tblorderdetails (intOrderDetailsNo, intOrderNo, intInventoryNo, intProductType, intStatus, purchasePrice, intQuantity)
              VALUES (?,?,?,?,?,?,?)`,[req.newOrderDetailsNo + i, thisOrderNo, inv, cart[i].type, 1, cart[i].curPrice, cart[i].curQty], (err, results, fields) => {
              if (err) console.log(err);
              db.query(stringquery1, [inv], (err, results, fields) => {
                if (results[0].stock){
                  newQty = parseInt(results[0].intReservedItems) + parseInt(cart[i].curQty);
                  db.query(stringquery2, [newQty, inv], (err, results1, fields) => {
                    if (err) console.log(err);
                    ++i;
                    if (cart.length > i){
                      multiInsert(i);
                    }
                    else{
                      db.commit(function(err) {
                        if (err) console.log(err);
                        req.session.cart = null;
                        res.render('cust-summary/views/orderSuccess', {
                          thisUser: req.user,
                          orderNumber: thisOrderNo,
                          checkUpdateOrder: req.body.paymentMethod,
                          admin: req.admin
                        });
                      });
                    }
                  });
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
                      res.redirect(`/summary/sample`,{message: 'Something went wrong'});
                    });
                  }
                }
              });
            });
          }
          // function stockControl(cart,i,j){
          //   db.query(`SELECT (intQuantity - intReservedItems)stock, intReservedItems FROM tblproductinventory
          //     WHERE intInventoryNo = ?`,[cart[i].inv, j+1], (err, results, fields) => {
          //     if (err) console.log(err);
          //     ++j;
          //     let thisBatchNo = results[0].intBatchNo;
          //     if (results[0].stock == 0){
          //       stockControl(cart,i,j);
          //     }
          //     else{
          //       let newQty = cart[i].curQty >= results[0].stock ?
          //         results[0].intQuantity : cart[i].curQty + results[0].intReservedItems;
          //       cart[i].curQty -= results[0].stock;
          //
          //       db.query(`UPDATE tblbatch SET intReservedItems= ? WHERE intBatchNo= ?`,[newQty, thisBatchNo], (err, results1, fields) => {
          //         if (err) console.log(err);
          //         if (cart[i].curQty > 0){
          //           stockControl(cart,i,j);
          //         }
          //         else{
          //           ++i;
          //           if (cart.length > i){
          //             multiInsert(i);
          //           }
          //           else{
          //             db.commit(function(err) {
          //               if (err) console.log(err);
          //               req.session.cart = null;
          //               res.redirect(`/summary/success/${thisOrderNo}`);
          //             });
          //           }
          //         }
          //       });
          //     }
          //
          //   });
          // }

          req.session.cart ? multiInsert(0) : res.redirect(`/summary/success`);
        });
      });
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
router.post('/order/cancel', checkUserOrder, orderProductQty, newOrderHistoryNo, newMessageNo, thisOrder, (req,res)=>{
  let reason = req.body.cancelreason == 'other' ? req.body.canceldesc : req.body.cancelreason,
  thisOrderHistoryNo = req.newOrderHistoryNo, thisMessageNo = req.newMessageNo, thisOrder = req.thisOrder;
  db.beginTransaction(function(err) {
    if (err) console.log(err);
    db.query(`UPDATE tblorder SET intStatus= 6, strCancellationReason= ? WHERE intOrderNo= ?`,
      [reason, req.body.orderNo], (err, results, fields) => {
      if (err) console.log(err);
      db.query(`INSERT INTO tblorderhistory (intOrderHistoryNo, intOrderNo, intStatus, intAdminID, intMessageNo, strShippingAddress, strBillingAddress)
        VALUES (?,?,6,?,0,?,?)`,[thisOrderHistoryNo, req.body.orderNo, 1000, thisOrder.strShippingAddress, thisOrder.strBillingAddress ], (err, results, fields) => {
        if (err) console.log(err);
        db.query(`INSERT INTO tblmessages (intMessageNo, intOrderHistoryNo, strMessage, intAdminID)
          VALUES (?,?,?,?)`,[thisMessageNo, thisOrderHistoryNo, `Order #${req.body.orderNo} has been cancelled`, 1000], (err, results, fields) => {
          if (err) console.log(err);
          function stockReturn(i){
            db.query(`SELECT intReservedItems FROM tblproductinventory WHERE intInventoryNo = ?`,
              [req.orderProductQty[i].Inv], (err, results, fields) => {
              if (err) console.log(err);
              let newQty = results[0].intReservedItems - req.orderProductQty[i].Qty;

              db.query(`UPDATE tblproductinventory SET intReservedItems= ? WHERE intInventoryNo= ?`,[newQty, req.orderProductQty[i].Inv], (err, results1, fields) => {
                if (err) console.log(err);
                ++i;
                if (req.orderProductQty.length > i){
                  stockReturn(i);
                }
                else{
                  db.commit(function(err) {
                    if (err) console.log(err);
                    res.redirect('/account/orders');
                  });
                }
              });
            });
          }

          stockReturn(0);
        });
      });
    });
  });
})

exports.summary = router;
