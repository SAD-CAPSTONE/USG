var router = require('express').Router();
var db = require('../../lib/database')();

router.get('/', (req,res)=>{
  res.render('admin-login/views/login');
});

router.post('/', (req,res)=>{
  db.query(`Select * from tblUser where strUsername = "${req.body.username}" and strPassword = "${req.body.password}" `, (err,results,fields)=>{
    if (err) console.log(err);

    if (results.length == 0 || results == 'undefined' || results == 'NULL'){
      res.render('admin-login/views/login');
    }else{
      req.session.user = results[0];
      if(results[0].intUserTypeNo == 1){
        res.render('admin-dashboard/views/dashboard')
      }else{
        res.send('You are a different user type');
      }
    }

  });
});

exports.adminlogin = router;
