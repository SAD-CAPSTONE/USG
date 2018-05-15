var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var priceFormat = require('./priceFormat');

router.get('/', (req, res) => {
  res.render('0extras/views/sample');
});
router.get('/cart', (req, res) => {
  console.log(req.session);
  res.render('0extras/views/cartSample');
});
router.get('/res-cart', (req, res) => {
  res.send({
    cart: req.session.cart
  });
});
router.get('/clear-cart', (req, res) => {
  req.session.cart = null;
  res.send({
    cart: req.session.cart
  });
});

router.post('/res-cart', (req, res) => {
  var thisID = req.session.cart ? req.session.cart[req.session.cart.length - 1].id + 1 : 1;
  var thisName = req.body.name;
  var thisPrice = priceFormat(parseFloat(req.body.price).toFixed(2));
  var thisStock= parseInt(req.body.stock);
  var thisQuantity = parseInt(req.body.quantity);
  var thisTotal = priceFormat((parseFloat(thisPrice)*thisQuantity).toFixed(2));

  if(thisQuantity > thisStock){
    thisQuantity = thisStock;
  }

  if (req.session.cart) {
    req.session.cart.push({
      id: thisID,
      name: thisName,
      price: thisPrice,
      stock: thisStock,
      quantity: thisQuantity,
      total: thisTotal
    });
  }
  else {
    req.session.cart = [{
      id: thisID,
      name: thisName,
      price: thisPrice,
      stock: thisStock,
      quantity: thisQuantity,
      total: thisTotal
    }];
  }

  res.send('Successfully added item!');
});
router.put('/res-cart/:id', (req, res) => {
  var id = req.params.id;
  var newQuantity = parseInt(req.body.newQuantity);

  req.session.cart.forEach((data, index) => {
    if (data.id === Number(id)) {
      var newTotal = priceFormat((parseFloat(data.price)*newQuantity).toFixed(2));
      data.quantity = newQuantity;
      data.total = newTotal;
    }
  });

  res.send('Succesfully updated product!');
});
router.delete('/res-cart/:id', (req, res) => {
  var id = req.params.id;

  req.session.cart.forEach(function(data, index) {
    if (data.id === Number(id)) {
      req.session.cart.splice(index, 1);
    }
  });

  res.send('Successfully removed item!');
});

exports.extras = router;
