var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var passport = require('passport');

function render(req,res){
  req.logout();
  console.log('??????????? Session Values');
  console.log(req.user);
  res.render('login/views/index');
}

router.get('/', render);

// auth with google+
router.get('/google', passport.authenticate('google', {
  scope: ['profile','email']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/home');
});

exports.login = router;
