const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const passport = require('passport');

function render(req,res){
  req.logout();
  console.log('??????????? Session Values');
  console.log(req.user);
  res.render('login/views/index', {message: req.flash('error'), success: req.flash('regSuccess')});
}

router.get('/', render);
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));
router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/home');
});
router.get('/google', passport.authenticate('google', {
  scope: ['profile','email']
}));
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/home');
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true })
);

exports.login = router;
