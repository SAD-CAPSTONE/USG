const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');
const copy = require('../cust-0extras/copy');
const quantLimit = 50;

function thisSizes(req, res, next){
  db.query(`SELECT * FROM tblproductlist
    INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
    INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
    INNER JOIN tbluom ON tblproductinventory.intUOMno= tbluom.intUOMno
    WHERE tblproductinventory.intInventoryNo= ?`
    , [req.session.item_inv], (err,results,fields)=>{
    if (err) console.log(err);
    req.session.item_qty ? 0 : req.session.item_qty = 1;
    req.session.item = {
      id: results[0].intProductNo,
      brand: results[0].strBrand,
      name: results[0].strProductName,
      img: `/assets/images/products/${results[0].strProductPicture}`,
      curSize: `${results[0].intSize.toString()} ${results[0].strUnitName}`,
      curPrice: priceFormat(results[0].productPrice.toFixed(2)),
      curQty: req.session.item_qty
    }
    return next();
  });
}

router.get('/modal/:pid', (req, res)=>{
  req.session.modal_cart ? 0 :
    req.session.modal_cart = {
      id: ''
    }
  if (req.params.pid == req.session.modal_cart.id){
    res.send({product: req.session.modal_cart});
  }
  else{
    db.query(`SELECT * FROM tblproductlist
      INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
  	  INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
      INNER JOIN tbluom ON tblproductinventory.intUOMno= tbluom.intUOMno
      WHERE tblproductlist.intProductNo= ?`
      , [req.params.pid], (err,results,fields)=>{
      if (err) console.log(err);
      results.map( obj => obj.productPrice = priceFormat(obj.productPrice.toFixed(2)) );
      let sizes = results.reduce((arr, obj)=>{
        arr.push([`${obj.intSize.toString()} ${obj.strUnitName}`,obj.productPrice]); return arr;
      },[]);
      req.session.modal_cart = {
        id: results[0].intProductNo,
        brand: results[0].strBrand,
        name: results[0].strProductName,
        img: `/assets/images/products/${results[0].strProductPicture}`,
        sizes: sizes,
        curSize: sizes[0][0],
        curPrice: sizes[0][1],
        curQty: 1
      }
      res.send({product: req.session.modal_cart});
    });
  }
});
router.get('/modal-price/:size', (req, res)=>{
  let size = req.params.size, price = 0, session = req.session.modal_cart;
  session.sizes.forEach((arr, i)=>{
    price = size == arr[0] ? arr[1] : price ;
  })
  req.session.modal_cart.curSize = size;
  req.session.modal_cart.curPrice = price;

  res.send({price: price});
});
router.get('/modal-qty/:action', (req, res)=>{
  let curQty = req.session.modal_cart.curQty;
  // Limit
  req.params.action == 'plus' ?
    curQty < quantLimit ? ++curQty : 0
    : curQty > 1 ? --curQty : 0
  req.session.modal_cart.curQty = curQty;

  res.send({qty: curQty});
});
router.post('/modal/:type', (req, res)=>{
  req.session.cart ? 0 : req.session.cart = [];
  let cart = req.session.cart,
  modal = req.params.type == 'modal' ?
    req.session.modal_cart : req.session.item;
  db.query(`SELECT * FROM tblproductinventory WHERE intProductNo= ? AND intSize= ?`
    , [modal.id, modal.curSize], (err,results,fields)=>{
    if (err) console.log(err);
    modal.inv = results[0].intInventoryNo;

    db.query(`SELECT (SUM(intQuantity) - SUM(intReservedItems))stock FROM tblbatch WHERE intInventoryNo= ?`
      , [modal.inv], (err,results,fields)=>{
      if (err) console.log(err);
      modal.limit = results[0].stock < quantLimit ?
        results[0].stock : quantLimit;
      modal.curQty = modal.curQty > results[0].stock ?
        results[0].stock : modal.curQty ;

      let compare = cart.reduce((temp, obj)=>{
        return obj.inv == modal.inv ? obj.inv : temp;
      },0)
      compare ?
        cart.forEach((data)=>{
          data.inv == compare ?
            // Limit
            data.curQty + modal.curQty > modal.limit ?
              data.curQty = modal.limit : data.curQty += modal.curQty
            : 0
        }) :
        req.session.cart.push(modal)
      let latest = cart.reduce((temp, obj, i)=>{
        return obj.inv == compare ? i : temp;
      },cart.length-1)

      res.send({cart: req.session.cart, latest: latest, limit: modal.limit})
    });

  });

});

router.get('/list', (req, res)=>{
  // req.session.cart = null;
  req.session.cart ? 0 : req.session.cart = [];
  modal = req.session.modal_cart;
  if (modal){
    req.session.modal_cart.curSize = modal.sizes[0][0];
    req.session.modal_cart.curPrice = modal.sizes[0][1];
    req.session.modal_cart.curQty = 1;
    req.session.item_qty = 1;
  }
  function cartLimitLoop(i){
    let cart = req.session.cart;
    db.query(`SELECT (SUM(intQuantity) - SUM(intReservedItems))stock FROM tblbatch WHERE intInventoryNo= ?`
      , [req.session.cart[i].inv], (err, results, fields) => {
      if (err) console.log(err);
      req.session.cart[i].limit = results[0].stock;
      req.session.cart[i].curQty > req.session.cart[i].limit ?
        req.session.cart[i].curQty = req.session.cart[i].limit : 0;
      ++i;
      if (cart.length > i){
        cartLimitLoop(i);
      }
      else{
        db.commit(function(err) {
          if (err) console.log(err);
          res.send({cart: req.session.cart});
        });
      }
    });
  }
  req.session.cart.length ? cartLimitLoop(0) : res.send({cart: req.session.cart});
});
router.put('/list', (req, res)=>{
  req.session.cart ? 0 : req.session.cart = [];
  let index =
    req.session.cart.reduce((temp, obj, i)=>{
      return obj.inv == req.body.inv ? i : temp
    }, null);
  if (index != null){
    let curQty = req.session.cart[index].curQty;
    // Limit
    req.body.action == 'plus' ?
      curQty < req.session.cart[index].limit ?
        ++curQty : 0
      : curQty > 1 ?
        --curQty : 0
    req.session.cart[index].curQty = curQty;
    res.send({cart: req.session.cart[index]});
  }
  else{
    res.send({cart: null});
  }
});
router.delete('/list', (req, res)=>{
  req.session.cart ? 0 : req.session.cart = [];
  let inv = req.body.inv;
  req.session.cart.forEach((data, i)=>{
    if (data.inv == inv){
      req.session.cart.splice(i, 1);
    }
  });
  res.send({cart: req.session.cart.length, inv: inv})
});
router.get('/list/total/:type', (req, res)=>{
  req.session.cart ? 0 : req.session.cart = [];
  let subtotal = req.session.cart ?
    req.session.cart.reduce((temp, obj)=>{
      return temp + (obj.curPrice * obj.curQty);
    },0) : 0
  let fee = 0.00;
  length = req.session.cart.length;
  req.params.type == 'total' ?
    res.send({
      cartLength: length,
      subtotal: priceFormat(subtotal.toFixed(2)),
      fee: priceFormat(fee.toFixed(2)),
      total: priceFormat((subtotal+fee).toFixed(2)) }) :
    res.send({subtotal: priceFormat(subtotal.toFixed(2))})
});

router.get('/item-inv/:inv', thisSizes, (req, res)=>{
  req.session.item_inv = req.params.inv;
  res.send('');
});
router.get('/item-qty/:action', (req, res)=>{
  req.session.item_qty ? 0 : req.session.item_qty = 1;
  // Limit
  req.params.action == 'plus' ?
    req.session.item_qty < quantLimit ? ++req.session.item_qty : 0
    : req.session.item_qty > 1 ? --req.session.item_qty : 0

  res.send({qty: req.session.item_qty});
});
router.get('/item-post/:pid', thisSizes, (req, res)=>{
  db.query(`SELECT * FROM tblproductlist
    INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
    INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
    INNER JOIN tbluom ON tblproductinventory.intUOMno= tbluom.intUOMno
    WHERE tblproductlist.intProductNo= ?`
    , [req.params.pid], (err,results,fields)=>{
    if (err) console.log(err);
    results.map( obj => obj.productPrice = priceFormat(obj.productPrice.toFixed(2)) );
    let sizes = results.reduce((arr, obj)=>{
      arr.push([`${obj.intSize.toString()} ${obj.strUnitName}`,obj.productPrice]); return arr;
    },[]);
    req.session.item.sizes = sizes;
    res.send('');
  });
});

exports.cart = router;
