var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
const userTypeAuth = require('../cust-0extras/userTypeAuth');
const auth_admin = userTypeAuth.admin;

//dashboard--
router.get('/', auth_admin, (req,res)=>{
    console.log(req.user)
    db.query(`SELECT COUNT(intOrderNo) cnt FROM tblorder WHERE intStatus = 0 AND dateOrdered <= NOW() AND dateOrdered >= NOW() - INTERVAL 2 DAY`,(err1,results1)=>{
      if (err1) console.log(err1)
      db.query(`SELECT COUNT(intUserID) cnt FROM tblcustomer WHERE intStatus = 1`,(err1,results2)=>{
        if (err1) console.log(err1)
        db.query(`SELECT COUNT(intBatchNo) cnt FROM tblbatch WHERE intStatus = 1 AND expirationDate >= NOW() AND expirationDate <= NOW() + INTERVAL 7 DAY`,(err1,results3)=>{
          if (err1) console.log(err1)
          // latest orders
          db.query(`SELECT * FROM tblorder JOIN tbluser ON tblorder.intUserID = tbluser.intUserID WHERE dateOrdered <= NOW() ORDER BY dateOrdered DESC LIMIT 7`,(err1,results4)=>{
            if(err1) console.log(err1)
            // best seller
            db.query(`Select
                      count(*) as total_quantity,
                      sum((details.purchasePrice - (details.purchasePrice * (details.discount / 100) ))) as sum_discounted, details.intOrderDetailsNo,
                      details.purchasePrice, details.discount, tblOrder.*, details.*, tblProductInventory.*,
                      tblProductlist.*, tblUom.*
                      from tblOrder join tblOrderdetails as details on tblOrder.intOrderNo = details.intOrderNo
                      join tblProductInventory on details.intInventoryNo = tblProductInventory.intInventoryno
                      join tblUom on tblProductInventory.intUomNo = tblUom.intUomNo

                      join tblProductList on tblProductInventory.intProductNo = tblProductList.intProductNo

                      where tblOrder.intPaymentStatus = 1 and details.intProductType = 1
                      group by details.intInventoryNo
                      order by total_quantity, sum_discounted desc limit 4`,(err1,results5)=>{
              if(err1) console.log(err1)
              db.query(`SELECT *,(tblproductlist.strDescription)proddesc FROM tblbatch
                        JOIN tblproductinventory ON tblproductinventory.intInventoryNo = tblbatch.intInventoryNo
                        JOIN tblproductlist ON tblproductinventory.intProductNo = tblproductlist.intProductNo
                        JOIN tbluom ON tblproductinventory.intUOMno = tbluom.intUomNo
                        WHERE tblbatch.intStatus = 1 AND expirationDate >= NOW()
                        AND expirationDate <= NOW() + INTERVAL 7 DAY ORDER BY expirationDate ASC LIMIT 4`, (err1,results6)=>{
                if(err1) console.log(err1);
                else{
                  db.query(`SELECT tblorderhistory.intStatus as stat, tblUser.* FROM tblorderhistory join tblOrder on tblorderhistory.intOrderNo = tblOrder.intOrderNo
                    join tblUser on tblOrder.intUserID = tblUser.intUserID  order by historyDate desc limit 8`,(err01,history,fie01)=>{
                    if(err01) console.log(err01);
                    else{
                      res.render('admin-dashboard/views/dashboard', {
                        re1: results1[0].cnt,
                        re2: results2[0].cnt,
                        re3: results3[0].cnt,
                        re4: results4,
                        re5: results5,
                        re6: results6,
                        moment: moment,
                        name: "name",
                        hist: history
                      });
                    }
                  })
                }


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
