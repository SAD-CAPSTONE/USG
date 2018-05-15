var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

router.get('/', (req, res) => {
  res.render('0extras/views/sample');
});
router.get('/new', (req, res) => {
  console.log(req.session);
  res.render('0extras/views/newSample');
});
router.get('/response', (req, res) => {
  res.send({
    data: req.session.data
  });
});
router.get('/clear', (req, res) => {
  req.session.data = null;
  res.send({
    data: req.session.data
  });
});

router.post('/response', (req, res) => {
  var addName = req.body.name;
  var thisID = req.session.data ? req.session.data[req.session.data.length - 1].id + 1 : 1;

  if (req.session.data) {
    req.session.data.push({
      id: thisID,
      name: addName
    });
  } else {
    req.session.data = [{
      id: thisID,
      name: addName
    }];
  }

  res.send('Successfully added data!');
});

router.put('/response/:id', (req, res) => {
  var id = req.params.id;
  var newName = req.body.newName;

  req.session.data.forEach((data, index) => {
    if (data.id === Number(id)) {
      data.name = newName;
    }
  });

  res.send('Succesfully updated product!');
});

router.delete('/response/:id', (req, res) => {
  var id = req.params.id;

  req.session.data.forEach(function(product, index) {
    if (product.id === Number(id)) {
      req.session.data.splice(index, 1);
    }
  });

  res.send('Successfully deleted product!');
});

exports.extras = router;
