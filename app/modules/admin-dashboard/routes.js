var router = require('express').Router();
var db = require('../../lib/database')();
//dashboard--
router.get('/', (req,res)=>{
    db.query(`SELECT COUNT(intOrderNo) cnt FROM tblorder WHERE intStatus = 1 UNION SELECT COUNT(intUserID) FROM tbluser WHERE intUserTypeNo = 3`,(err1,results1)=>{
      if (err1) console.log(err1)
      console.log(results1)
      res.render('admin-dashboard/views/dashboard', {re1: results1[0].cnt, re2: results1[1].cnt, name: "name"});
    })
  });


router.get('/load',(req,res)=>{
  res.render('admin-dashboard/views/loading', {name: "name"});
})

exports.dashboard = router;
