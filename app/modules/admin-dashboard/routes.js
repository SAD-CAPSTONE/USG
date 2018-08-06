var router = require('express').Router();
var db = require('../../lib/database')();
//dashboard--
router.get('/', (req,res)=>{
    db.query(`SELECT COUNT(intOrderNo) cnt FROM tblorder WHERE intStatus = 0 AND dateOrdered <= NOW() AND dateOrdered >= NOW() - INTERVAL 2 DAY`,(err1,results1)=>{
      if (err1) console.log(err1)
      db.query(`SELECT COUNT(intUserID) cnt FROM tblcustomer WHERE intStatus = 1`,(err1,results2)=>{
        if (err1) console.log(err1)
        db.query(`SELECT COUNT(intBatchNo) cnt FROM tblbatch WHERE intStatus = 1 AND expirationDate >= NOW() AND expirationDate <= NOW() + INTERVAL 7 DAY`,(err1,results3)=>{
          if (err1) console.log(err1)
      console.log(results1[0].cnt)
      console.log(results2[0].cnt)
      console.log(results3[0].cnt)
      res.render('admin-dashboard/views/dashboard', {
        re1: results1[0].cnt, 
        re2: results2[0].cnt, 
        re3: results3[0].cnt, 
        name: "name"
      });
            })
          });
        })
      });


router.get('/load',(req,res)=>{
  res.render('admin-dashboard/views/loading', {name: "name"});
})

exports.dashboard = router;
