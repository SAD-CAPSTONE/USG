var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
//dashboard--
router.get('/', (req,res)=>{
    db.query(`SELECT COUNT(intOrderNo) cnt FROM tblorder WHERE intStatus = 0 AND dateOrdered <= NOW() AND dateOrdered >= NOW() - INTERVAL 2 DAY`,(err1,results1)=>{
      if (err1) console.log(err1)
      db.query(`SELECT COUNT(intUserID) cnt FROM tblcustomer WHERE intStatus = 1`,(err1,results2)=>{
        if (err1) console.log(err1)
        db.query(`SELECT COUNT(intBatchNo) cnt FROM tblbatch WHERE intStatus = 1 AND expirationDate >= NOW() AND expirationDate <= NOW() + INTERVAL 7 DAY`,(err1,results3)=>{
          if (err1) console.log(err1)
          db.query(`SELECT * FROM tblorder JOIN tbluser ON tblorder.intUserID = tbluser.intUserID WHERE dateOrdered <= NOW() ORDER BY dateOrdered DESC LIMIT 7`,(err1,results4)=>{
            if(err1) console.log(err1)
            db.query(`SELECT * FROM tblproductinventory JOIN tblproductlist ON tblproductinventory.intProductNo = tblproductlist.intProductNo JOIN tbluom ON tblproductinventory.intUOMno = tbluom.intUomNo WHERE dateRecorded <= NOW() ORDER BY dateRecorded DESC LIMIT 4`,(err1,results5)=>{
              if(err1) console.log(err1)
              db.query(`SELECT *,(tblproductlist.strDescription)proddesc FROM tblbatch
                        JOIN tblproductinventory ON tblproductinventory.intInventoryNo = tblbatch.intInventoryNo
                        JOIN tblproductlist ON tblproductinventory.intProductNo = tblproductlist.intProductNo
                        JOIN tbluom ON tblproductinventory.intUOMno = tbluom.intUomNo
                        WHERE tblbatch.intStatus = 1 AND expirationDate >= NOW()
                        AND expirationDate <= NOW() + INTERVAL 7 DAY ORDER BY expirationDate ASC LIMIT 4`, (err1,results6)=>{
                if(err1) console.log(err1)
          console.log(results6)
      res.render('admin-dashboard/views/dashboard', {
        re1: results1[0].cnt,
        re2: results2[0].cnt,
        re3: results3[0].cnt,
        re4: results4,
        re5: results5,
        re6: results6,
        moment: moment,
        name: "name"
      });
                })
              });
            })
          });
        })
      })
    })


router.get('/load',(req,res)=>{
  res.render('admin-dashboard/views/loading', {name: "name"});
})

exports.dashboard = router;
