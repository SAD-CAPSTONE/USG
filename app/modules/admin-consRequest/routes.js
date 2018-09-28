var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
var async = require('async');

router.get('/',(req,res)=>{
  db.query(`Select tblConsignorRequest.intStatus as stat, tblConsignorRequest.*, tblUser.*
     from tblConsignorRequest join tblUser on tblUser.intUserID = tblConsignorRequest.intConsignorNo
    `,(err1,res1,fie1)=>{
      if(err1) console.log(err1);
      else{
        res.render('admin-consRequest/views/requests.ejs',{all: res1});
      }
    })
});

router.get('/productRequest',(req,res)=>{
  db.query(`Select * from tblConsignorRequest join tblProductRequest on tblConsignorRequest.intRequestNo =
    tblProductRequest.intRequestNo where tblConsignorRequest.intRequestNo = "${req.query.no}"`,(err1,res1,fie1)=>{
      if(err1) console.log(err1);
      else{
        db.query(`Select * from tblConsignorRequest join tblUser on tblConsignorRequest.intConsignorNo = tblUser.intUserID
          join tblSupplier on tblUser.intUserID = tblSupplier.intUserID where tblConsignorRequest.intRequestNo = "${req.query.no}"`,(err2,res2,fie2)=>{
            if(err2) console.log(err2);
            else{
              res.render(`admin-consRequest/views/productRequest`,{re: res1, request: req.query.no, consignor: res2 })

            }
          })
      }
    })
});

router.post('/acceptRequest',(req,res)=>{
  db.query(`Update tblConsignorRequest set intStatus = 1, dateAcknowledged = NOW() where intRequestNo = "${req.body.no}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      res.send("yes")
    }
  })
})

router.post('/rejectRequest',(req,res)=>{
  db.query(`Update tblConsignorRequest set intStatus = 2 where intRequestNo = "${req.body.no}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      res.send("yes")
    }
  })
})

exports.consignorRequests = router;
