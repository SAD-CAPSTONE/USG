const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');
const copy = require('../cust-0extras/copy');
const quantLimit = 50;

function sizeString(obj){
  let curSize = ``;
  obj.strVariant ? curSize+= `${obj.strVariant}`: 0
  obj.strVariant && obj.intSize ? curSize+= ` - `: 0
  obj.intSize ? curSize+= `${obj.intSize}`: 0
  obj.strUnitName ? curSize+= `${obj.strUnitName}`: 0
  return curSize;
}

router.get('/modal/:pid', (req, res)=>{
  db.query(`SELECT * FROM tblproductlist
    INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
	  INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
    INNER JOIN tbluom ON tblproductinventory.intUOMno= tbluom.intUOMno
    WHERE tblproductlist.intProductNo= ?`
    , [req.params.pid], (err,results,fields)=>{
    if (err) console.log(err);
    results.map( obj => obj.productPrice = priceFormat(obj.productPrice.toFixed(2)) );
    let sizes = results.reduce((arr, obj)=>{
      let curSize = sizeString(obj);
      arr.push([`${curSize}`,obj.productPrice]);
      return arr;
    },[]);
    // req.session.modal_cart = {
    //   id: results[0].intProductNo,
    //   brand: results[0].strBrand,
    //   name: results[0].strProductName,
    //   img: `/assets/images/products/${results[0].strProductPicture}`,
    //   sizes: sizes,
    //   curSize: sizes[0][0],
    //   curPrice: sizes[0][1],
    //   curQty: 1
    // }
    let modal = {
      inv: null,
      id: results[0].intProductNo,
      brand: results[0].strBrand,
      name: results[0].strProductName,
      img: `/assets/images/products/${results[0].strProductPicture}`,
      sizes: sizes,
      curSize: sizes[0][0],
      curPrice: sizes[0][1],
      curQty: 1,
      type: 1
    }
    console.log(results)
    console.log(modal)
    // let this_item = {
    //   inv: req.body.inv,
    //   id: results[0].intProductNo,
    //   brand: results[0].strBrand,
    //   name: results[0].strProductName,
    //   img: `/assets/images/products/${results[0].strProductPicture}`,
    //   sizes: null,
    //   curSize: curSize,
    //   curPrice: results[0].productPrice,
    //   curQty: parseInt(req.body.qty),
    //   type: 1
    // }
    res.send({product: modal});
  });
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

    db.query(`SELECT (intQuantity - intReservedItems)stock FROM tblproductinventory WHERE intInventoryNo= ?`
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
    db.query(`SELECT (intQuantity - intReservedItems)stock FROM tblproductinventory WHERE intInventoryNo= ?`
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
        db.commit(function(err) {
          if (err) console.log(err);
          res.send({cart: req.session.cart, thisUser: req.user});
        });
      }
    });
  }
  req.session.cart.length ? cartLimitLoop(0) : res.send({cart: req.session.cart, thisUser: req.user});
});
router.put('/list', (req, res)=>{
  req.session.cart ? 0 : req.session.cart = [];
  let index =
    req.session.cart.reduce((temp, obj, i)=>{
      return obj.inv == req.body.inv ? i : temp
    }, null);
  req.session.cart[index].limit > quantLimit ?
    req.session.cart[index].limit = quantLimit : 0
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

router.get('/item-inv/:inv', (req, res)=>{
  db.query(`SELECT productPrice, (intQuantity - intReservedItems)stock FROM tblproductinventory
    WHERE intInventoryNo = ?`
    , [req.params.inv], (err,results,fields)=>{
    if (err) console.log(err);
    results[0] ? results[0].productPrice = priceFormat(results[0].productPrice.toFixed(2)): 0;
    res.send({inventory: results[0]});
  });
});
router.post('/item-post', (req, res)=>{
  db.query(`SELECT * FROM tblproductlist
    INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
    INNER JOIN tblproductinventory ON tblproductlist.intProductNo= tblproductinventory.intProductNo
    INNER JOIN tbluom ON tblproductinventory.intUOMno= tbluom.intUOMno WHERE intInventoryNo= ?`
    , [req.body.inv], (err,results,fields)=>{
    if (err) console.log(err);
    let curSize = sizeString(results[0])

    results[0].productPrice = priceFormat(results[0].productPrice.toFixed(2));
    let this_item = {
      inv: req.body.inv,
      id: results[0].intProductNo,
      brand: results[0].strBrand,
      name: results[0].strProductName,
      img: `/assets/images/products/${results[0].strProductPicture}`,
      sizes: null,
      curSize: curSize,
      curPrice: results[0].productPrice,
      curQty: parseInt(req.body.qty),
      type: 1
    }

    db.query(`SELECT (intQuantity - intReservedItems)stock FROM tblproductinventory WHERE intInventoryNo= ?`
      , [this_item.inv], (err,results,fields)=>{
      if (err) console.log(err);
      req.session.cart ? 0 : req.session.cart = [];
      let cart = req.session.cart;

      this_item.limit = results[0].stock < quantLimit ?
        results[0].stock : quantLimit;
      this_item.curQty = this_item.curQty > results[0].stock ?
        results[0].stock : this_item.curQty ;

      let compare = cart.reduce((temp, obj)=>{
        return obj.inv == this_item.inv ? obj.inv : temp;
      },0)
      compare ?
        cart.forEach((data)=>{
          data.inv == compare ?
            // Limit
            data.curQty + this_item.curQty > this_item.limit ?
              data.curQty = this_item.limit : data.curQty += this_item.curQty
            : 0
        }) :
        req.session.cart.push(this_item)
      let latest = cart.reduce((temp, obj, i)=>{
        return obj.inv == compare ? i : temp;
      },cart.length-1)

      res.send({cart: req.session.cart, latest: latest, limit: this_item.limit})
    });
  });
});

exports.cart = router;
