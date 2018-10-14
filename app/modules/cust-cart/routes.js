const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const priceFormat = require('../cust-0extras/priceFormat');
const moment = require('moment');
const quantLimit = 50;

function sizeString(obj){
  let curSize = ``;
  obj.strVariant ? curSize+= `${obj.strVariant}`: 0
  obj.strVariant && obj.intSize ? curSize+= ` - `: 0
  obj.intSize ? curSize+= `${obj.intSize}`: 0
  obj.strUnitName ? curSize+= ` ${obj.strUnitName}`: 0
  return curSize;
}

function totalCheckUser (req, res, next){
  if(req.params.type == 'total'){
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
  else {
    req.session.pendRoute = 0;
    return next();
  }
}
function defaultFee (req, res, next){
  db.query(`SELECT shippingFee FROM tbladmin WHERE intUserID= 1000`, (err,results,fields)=>{
    if (err) console.log(err);
    req.defaultFee = results[0].shippingFee;
    return next();
  });
}

router.get('/limit', (req, res)=>{
  res.send({quantLimit: quantLimit})
});

router.get('/modal/:pid', (req, res)=>{
  db.query(`SELECT * FROM tblproductlist
    INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
    INNER JOIN (
    	SELECT tblproductinventory.intInventoryNo, intProductNo, intUOMno, intSize, (tblproductinventory.intStatus)InvStatus,
      IF(discount IS NOT NULL, productPrice-(productPrice*discount*.01), productPrice)productPrice, intQuantity,
      intReservedItems, strVariant, discount, discountDueDate FROM tblproductinventory
    	LEFT JOIN (SELECT * FROM tblproductdiscount WHERE curdate() <= discountDueDate AND intStatus= 1)Disc
    	ON tblproductinventory.intInventoryNo= Disc.intInventoryNo
    )Inv ON tblproductlist.intProductNo= Inv.intProductNo
    INNER JOIN tbluom ON Inv.intUOMno= tbluom.intUOMno
    WHERE tblproductlist.intProductNo= ?`
    , [req.params.pid], (err,results,fields)=>{
    if (err) console.log(err);
    results.map( obj => obj.productPrice = priceFormat(obj.productPrice.toFixed(2)) );
    let sizes = results.reduce((arr, obj)=>{
      arr.push([obj.intInventoryNo,sizeString(obj)]); return arr;
    },[]);
    let modal = {
      id: results[0].intProductNo,
      brand: results[0].strBrand,
      name: results[0].strProductName,
      img: `/assets/images/products/${results[0].strProductPicture}`,
      sizes: sizes,
      curInv: sizes[0][0],
      curSize: sizes[0][1],
      curPrice: results[0].productPrice,
      curQty: 1
    }
    res.send({product: modal, quantLimit: quantLimit});
  });
});
router.get('/modal-inv/:inv', (req, res)=>{
  db.query(`SELECT (intQuantity - intReservedItems)stock, (productPrice)oldPrice, discount,
    IF(discount IS NOT NULL, productPrice-(productPrice*discount*.01), productPrice)productPrice, tblproductinventory.intStatus
    FROM tblproductinventory LEFT JOIN (SELECT * FROM tblproductdiscount WHERE curdate() <= discountDueDate AND intStatus= 1)Disc
    ON tblproductinventory.intInventoryNo= Disc.intInventoryNo
    WHERE tblproductinventory.intInventoryNo = ?`
    , [req.params.inv], (err,results,fields)=>{
    if (err) console.log(err);
    if (results[0]){
      results[0].productPrice = priceFormat(results[0].productPrice.toFixed(2));
      results[0].oldPrice = priceFormat(results[0].oldPrice.toFixed(2));
    }
    res.send({inventory: results[0]});
  });
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
router.post('/modal', (req, res)=>{
  db.query(`SELECT * FROM tblproductlist
    INNER JOIN (SELECT * FROM tblproductbrand)Brand ON tblproductlist.intBrandNo= Brand.intBrandNo
    INNER JOIN (
    	SELECT tblproductinventory.intInventoryNo, intProductNo, intUOMno, intSize, (tblproductinventory.intStatus)InvStatus, (productPrice)oldPrice,
        IF(discount IS NOT NULL, productPrice-(productPrice*discount*.01), productPrice)productPrice, intQuantity, intReservedItems, strVariant,
        discount, discountDueDate, SUM(tblproductinventory.intQuantity - tblproductinventory.intReservedItems)stock FROM tblproductinventory
    	LEFT JOIN (SELECT * FROM tblproductdiscount WHERE curdate() <= discountDueDate AND intStatus= 1)Disc
    	ON tblproductinventory.intInventoryNo= Disc.intInventoryNo
    	GROUP BY tblproductinventory.intInventoryNo
    )Inv ON tblproductlist.intProductNo= Inv.intProductNo
    INNER JOIN tbluom ON Inv.intUOMno= tbluom.intUOMno WHERE intInventoryNo= ?`
    , [req.body.inv], (err,results,fields)=>{
    if (err) console.log(err);
    let curSize = sizeString(results[0])

    results[0].productPrice = priceFormat(results[0].productPrice.toFixed(2));
    results[0].oldPrice = priceFormat(results[0].oldPrice.toFixed(2));
    let this_item = {
      inv: req.body.inv,
      id: results[0].intProductNo,
      package: 'none',
      brand: results[0].strBrand,
      name: results[0].strProductName,
      img: `/assets/images/products/${results[0].strProductPicture}`,
      curSize: curSize,
      curPrice: results[0].productPrice,
      oldPrice: results[0].oldPrice,
      discount: results[0].discount,
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
        results[0].stock : this_item.curQty;

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

router.get('/list', (req, res)=>{
  req.session.cart ? 0 : req.session.cart = [];
  function cartLimitLoop(i){
    let cart = req.session.cart, stringquery1, bodyarray1;
    if (cart[i].type == 1){
      stringquery1 = `SELECT (tblproductinventory.intStatus)InvStatus, (0)expired, (productPrice)oldPrice,
      IF(discount IS NOT NULL, productPrice-(productPrice*discount*.01), productPrice)productPrice,
      discount, SUM(tblproductinventory.intQuantity - tblproductinventory.intReservedItems)stock FROM tblproductinventory
      LEFT JOIN (SELECT * FROM tblproductdiscount WHERE curdate() <= discountDueDate AND intStatus= 1)Disc ON tblproductinventory.intInventoryNo= Disc.intInventoryNo
      WHERE tblproductinventory.intInventoryNo= ? GROUP BY tblproductinventory.intInventoryNo LIMIT 1`;
      bodyarray1 = [req.session.cart[i].inv];
    }
    else{
      stringquery1 = `SELECT (intQuantity - intReservedItems)stock, (intStatus)InvStatus, IF(tblpackage.dateDue >= now(), 0, 1)expired
      FROM tblpackage WHERE intPackageNo= ?`;
      bodyarray1 = [req.session.cart[i].package]
    }
    db.query(stringquery1, bodyarray1, (err, results, fields) => {
      if (err) console.log(err);
      if (cart[i].type == 1){
        req.session.cart[i].discount= results[0].discount;
        req.session.cart[i].oldPrice= priceFormat(results[0].oldPrice.toFixed(2));
      }
      req.session.cart[i].limit = results[0].stock > quantLimit ?
        quantLimit : results[0].stock;
      req.session.cart[i].curQty > req.session.cart[i].limit ?
        req.session.cart[i].curQty = req.session.cart[i].limit : 0;

      if (results[0].stock < 1 || !results[0].InvStatus || results[0].expired){
        req.session.cart.splice(i,1)
        --i;
      }

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
  let inv = req.body.inv, type = req.body.type;
  let index =
    req.session.cart.reduce((temp, obj, i)=>{
      return type == 1 ?
        obj.inv == inv ? i : temp :
        obj.package == inv ? i : temp
    }, null);
  if (index != null){
    req.session.cart[index].limit > quantLimit ?
      req.session.cart[index].limit = quantLimit : 0

    let curQty = req.session.cart[index].curQty,
    blank = 0;
    // Limit

    req.body.action == 'change' ?
      req.body.value ?
        req.body.value < req.session.cart[index].limit ?
          curQty = req.body.value
          :
          req.body.value > 1 ?
            curQty = req.session.cart[index].limit
            : curQty = 1
        : blank = 1
      :
      req.body.action == 'plus' ?
        curQty < req.session.cart[index].limit ?
          ++curQty : 0
        : curQty > 1 ?
          --curQty : 0
    req.session.cart[index].curQty = curQty;
    res.send({cart: req.session.cart[index], blank: blank});

  }
  else{
    res.send({cart: null});
  }
});
router.delete('/list', (req, res)=>{
  req.session.cart ? 0 : req.session.cart = [];
  let inv = req.body.inv, type = req.body.type;
  req.session.cart.forEach((data, i)=>{
    type == 1 ?
      data.inv == inv ?
        req.session.cart.splice(i, 1) : 0
      :
      data.package == inv ?
        req.session.cart.splice(i, 1) : 0

  });
  res.send({cart: req.session.cart.length, inv: inv})
});
router.get('/list/total/:type', totalCheckUser, defaultFee, (req, res)=>{
  req.session.cart ? 0 : req.session.cart = [];
  let subtotal = req.session.cart ?
    req.session.cart.reduce((temp, obj)=>{
      return temp + (obj.curPrice * obj.curQty);
    },0) : 0
  let fee = parseFloat(req.defaultFee);
  if (req.params.type == 'total'){
    db.query(`SELECT strShippingAddress FROM tblcustomer WHERE intUserID = ?`,
      [req.user.intUserID], (err,addressResults,fields)=>{
      if (err) console.log(err);
      if (addressResults[0]){
        if (addressResults[0].strShippingAddress){
          db.query(`SELECT strLocation, amount FROM tblshippingfee WHERE intStatus= 1 AND strLocation= ?`,
            [addressResults[0].strShippingAddress.split(/\s-\s(.*)/g)[0]], (err,locationResults,fields)=>{
            if (err) console.log(err);
            if (locationResults[0]){
              fee = parseFloat(locationResults[0].amount)
            }
            renderTotal()
          });
        }
        else {
          fee = 0
          renderTotal()
        }
      }
      else {
        fee = 0
        renderTotal()
      }
    });
  }
  else{
    renderTotal()
  }
  function renderTotal(){
    console.log('xxxxxxx')
    length = req.session.cart.reduce((temp, obj)=>{
      return temp += obj.curQty
    },0);
    req.params.type == 'total' ?
      res.send({
        cartLength: length,
        subtotal: priceFormat(subtotal.toFixed(2)),
        fee: priceFormat(fee.toFixed(2)),
        total: priceFormat((subtotal+fee).toFixed(2)) }) :
      res.send({subtotal: priceFormat(subtotal.toFixed(2))})
  }
});

router.get('/item-inv/:inv', (req, res)=>{
  db.query(`SELECT (intQuantity - intReservedItems)stock, (productPrice)oldPrice, discount, IF(discount IS NOT NULL, productPrice-(productPrice*discount*.01), productPrice)productPrice
    FROM tblproductinventory LEFT JOIN (SELECT * FROM tblproductdiscount WHERE curdate() <= discountDueDate AND intStatus= 1)Disc
    ON tblproductinventory.intInventoryNo= Disc.intInventoryNo WHERE tblproductinventory.intInventoryNo = ?`,
    [req.params.inv], (err,results,fields)=>{
    if (err) console.log(err);
    results[0] ? results[0].productPrice = priceFormat(results[0].productPrice.toFixed(2)): 0;
    res.send({inventory: results[0]});
  });
});

router.get('/package/:pid', (req, res)=>{
  db.query(`SELECT *, (tblpackage.intQuantity - tblpackage.intReservedItems)stock, IF(tblpackage.dateDue >= now(), 0, 1)expired,
    (tblproductinventory.productPrice * tblpackagelist.intProductQuantity)originalSubTotal FROM tblpackage
    INNER JOIN tblpackagelist ON tblpackage.intPackageNo= tblpackagelist.intPackageNo
    INNER JOIN tblproductinventory ON tblpackagelist.intInventoryNo = tblproductinventory.intInventoryNo
    INNER JOIN tbluom ON tblproductinventory.intUOMno= tbluom.intUomNo
    INNER JOIN tblproductlist ON tblproductinventory.intProductNo = tblproductlist.intProductNo
    INNER JOIN tblproductbrand ON tblproductlist.intBrandNo= tblproductbrand.intBrandNo
    WHERE tblpackage.intPackageNo= ? ORDER BY intProductQuantity DESC`
    , [req.params.pid], (err,results,fields)=>{
    if (err) console.log(err);
    let originalTotal = results.reduce((sum, obj)=>{
      return sum += parseFloat(obj.originalSubTotal);
    },0),
    discount = Math.ceil((originalTotal - parseFloat(results[0].packagePrice)) / originalTotal * 100);
    results.map( obj => obj.packagePrice = priceFormat(obj.packagePrice.toFixed(2)) );
    results.map( obj => obj.dateDue = moment(obj.dateDue).format('LL') );
    results.map( obj => obj.intSize = sizeString(obj) );
    let options = {
      discount: discount,
      curQty: 1
    }
    res.send({
      package: results,
      options: options
    });
  });
});
router.post('/package', (req, res)=>{
  db.query(`SELECT * FROM tblpackage WHERE intPackageNo= ?`, [req.body.package], (err,results,fields)=>{
    if (err) console.log(err);

    results[0].packagePrice = priceFormat(results[0].packagePrice.toFixed(2));
    let this_package = {
      inv: 'none',
      package: req.body.package,
      name: results[0].strPackageName,
      img: `/customer-assets/images/static/package.jpg`,
      curQty: parseInt(req.body.qty),
      curPrice: results[0].packagePrice,
      type: 2
    }

    db.query(`SELECT (intQuantity - intReservedItems)stock FROM tblpackage WHERE intPackageNo= ?`
      , [this_package.package], (err,results,fields)=>{
      if (err) console.log(err);
      req.session.cart ? 0 : req.session.cart = [];
      let cart = req.session.cart;

      this_package.limit = results[0].stock < quantLimit ?
        results[0].stock : quantLimit;
      this_package.curQty = this_package.curQty > results[0].stock ?
        results[0].stock : this_package.curQty;

      let compare = cart.reduce((temp, obj)=>{
        return obj.package == this_package.package ? obj.package : temp;
      },0)
      compare ?
        cart.forEach((data)=>{
          data.package == compare ?
            // Limit
            data.curQty + this_package.curQty > this_package.limit ?
              data.curQty = this_package.limit : data.curQty += this_package.curQty
            : 0
        }) :
        req.session.cart.push(this_package)
      let latest = cart.reduce((temp, obj, i)=>{
        return obj.package == compare ? i : temp;
      },cart.length-1)

      console.log(latest)

      res.send({cart: req.session.cart, latest: latest, limit: this_package.limit})
    });
  });
});

router.post('/searchbar', (req, res)=>{
  db.query(`SELECT CONCAT(strBrand, ' ', strProductName)product FROM tblproductlist
    INNER JOIN tblproductbrand USING (intBrandNo) WHERE CONCAT(strBrand, ' ', strProductName) LIKE ? LIMIT 5`,
    [`%${req.body.term}%`], (err,results,fields)=>{
    if (err) console.log(err);
    let terms = results.reduce((temp, data)=>{
      temp.push(data.product)
      return temp
    }, [])
    console.log(terms)
    res.send({terms: terms})
  });
});

exports.cart = router;
