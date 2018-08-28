const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const passport = require('passport');
// 
router.get('/', (req,res)=>{
  req.logout();
  console.log('??????????? Session Values');
  console.log(req.user);
  res.render('cust-login/views/index', {message: req.flash('error'), success: req.flash('regSuccess')});
});
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));
router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/login/auth');
});
router.get('/google', passport.authenticate('google', {
  scope: ['profile','email']
}));
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/login/auth');
});
router.get('/auth', (req,res)=>{
  req.user ? 0 : res.redirect('login');
  switch(req.user.intUserTypeNo){
    case 1: res.redirect('/dashboard'); break;
    case 2: res.redirect('/consignor/consignor-dash'); break;
    case 3:
      switch(req.session.pendRoute){
        case 1 : res.redirect('/account/dashboard'); break;
        case 2 : res.redirect('/summary/checkout'); break;
        case 3 : res.redirect('/summary/order'); break;
        default : res.redirect('/home'); break;
      }
      break;
  }
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/login/auth',
  failureRedirect: '/login',
  failureFlash: true })
);

exports.login = router;
