var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var newUserID = require('../0extras/newUserID');

function checkUser(req,res,next){
  /*Match form's email and username to DB, Match(body);
  *(tbluser)*/
  db.query(`SELECT * FROM tbluser WHERE strEmail= ? OR strUsername= ?`,[req.body.email, req.body.username], (err, results, fields) => {
    if (err) console.log(err);
    if (!results[0])
      req.checkUser = 0;
    else{
      var email, username;
      for(count=0;count<results.length;count++){
        if (results[count].strEmail == req.body.email)
          email = 1;
        if (results[count].strUsername == req.body.username)
          username = 1;
      }
      if (email && username){
        req.checkUser = 3;
      }
      else if (email){
        req.checkUser = 2;
      }
      else if (username){
        req.checkUser = 1;
      }
    }
    return next();
  });
}

function render(req,res){
  req.logout();
  res.render('register/views/index', {message1: req.flash('regMessage1'), message2: req.flash('regMessage2')});
}

router.get('/', render);

router.post('/', newUserID, checkUser, (req, res) => {
  if (req.body.password != req.body.confirm){
    req.flash('regMessage2', 'Password must match');
  }

  if (req.checkUser == 3){
    req.flash('regMessage1', 'Email & Username taken');
    res.redirect('/register');
  }
  else if (req.checkUser == 2){
    req.flash('regMessage1', 'Email taken');
    res.redirect('/register');
  }
  else if (req.checkUser == 1){
    req.flash('regMessage1', 'Username taken');
    res.redirect('/register');
  }
  else if(req.body.password == req.body.confirm){
    var stringquery = req.body.middlename ?
    `INSERT INTO tbluser (intUserID, intUserTypeNo, strFname, strMname, strLname, strEmail, strUsername, strPassword) VALUES (?,2,?,?,?,?,?,?)`:
    `INSERT INTO tbluser (intUserID, intUserTypeNo, strFname, strLname, strEmail, strUsername, strPassword) VALUES (?,2,?,?,?,?,?)`;
    var bodyarray = [req.newUserID, req.body.firstname]
    req.body.middlename ? bodyarray.push(req.body.middlename) : bodyarray;
    bodyarray.push(req.body.lastname, req.body.email, req.body.username, req.body.password);

    db.query(stringquery, bodyarray, (err, results, fields) => {
      if (err) console.log(err);
        req.flash('regSuccess', 'Sign up Success!');
        res.redirect('/login');
    });
  }
  else{
    res.redirect('/register');
  }
});

exports.register = router;
