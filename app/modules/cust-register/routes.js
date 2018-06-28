const express = require('express');
const router = express.Router();
const db = require('../../lib/database')();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const newUserID = require('../cust-0extras/newUserID');
const passport = require('passport');

function checkUser(req,res,next){
  /*Match form's email and username to DB, Match(body);
  *(tbluser)*/
  db.query(`SELECT * FROM tbluser WHERE strEmail= ? OR strUsername= ?`,[req.body.email, req.body.username], (err, results, fields) => {
    if (err) console.log(err);
    if (!results[0])
      req.checkUser = 0;
    else{
      let email, username;
      req.checkUser = 1;

      for(count=0;count<results.length;count++){
        if (results[count].strEmail == req.body.email)
          email = 1;
        if (results[count].strUsername == req.body.username)
          username = 1;
      }

      if (email && username)
        req.flash('regMessage1', 'Email & Username taken');
      else if (email)
        req.flash('regMessage1', 'Email taken');
      else if (username)
        req.flash('regMessage1', 'Username taken');
    }
    return next();
  });
}

router.get('/', (req,res)=>{
  req.logout();
  res.render('cust-register/views/index', {message1: req.flash('regMessage1'), message2: req.flash('regMessage2')});
});

router.post('/', newUserID, checkUser, (req, res) => {
  if (req.body.password != req.body.confirm){
    req.flash('regMessage2', 'Password must match');
  }

  if(req.body.password == req.body.confirm && req.checkUser == 0){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      let stringquery = req.body.middlename ?
      `INSERT INTO tbluser (intUserID, intUserTypeNo, strFname, strMname, strLname, strEmail, strUsername, strPassword) VALUES (?,3,?,?,?,?,?,?)`:
      `INSERT INTO tbluser (intUserID, intUserTypeNo, strFname, strLname, strEmail, strUsername, strPassword) VALUES (?,3,?,?,?,?,?)`;
      let bodyarray = [req.newUserID, req.body.firstname];
      req.body.middlename ? bodyarray.push(req.body.middlename) : bodyarray;
      bodyarray.push(req.body.lastname, req.body.email, req.body.username, hash);

      db.beginTransaction(function(err) {
        if (err) console.log(err);
        db.query(stringquery, bodyarray, (err, results, fields) => {
          if (err) console.log(err);
          db.query(`INSERT INTO tblcustomer (intUserID) VALUES (?)`,[req.newUserID], (err, results, fields) => {
            if (err) console.log(err);
            db.commit(function(err) {
              if (err) console.log(err);
              req.flash('regSuccess', 'Sign up Success!');
              req.session.pendRoute || req.session.pendRoute != 0 ?
                passport.authenticate('local')(req, res, ()=> {
                  req.session.pendRoute == 1 ?
                    res.redirect('/account/dashboard'):
                    res.redirect('/summary/checkout');
                }) :
                res.redirect('/login');
            });
          });
        });
      });
    });
  }
  else{
    res.redirect('/register');
  }
});

exports.register = router;
