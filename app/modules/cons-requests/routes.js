var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
var async = require('async');
const userTypeAuth = require('../cust-0extras/userTypeAuth');
const auth_cons = userTypeAuth.cons;

router.get('/', auth_cons, (req,res)=>{
  db.query(`Select * from tblConsignorRequest where intConsignorNo = "${req.user.intUserID}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      res.render('cons-requests/views/cons-requests',{re: res1, moment: moment})
    }
  })
});

router.get('/newRequest', auth_cons, (req,res)=>{
  db.query(`Select * from tblUser join tblSupplier on tblUser.intUserID = tblSupplier.intUserID
    where tblUser.intUserID = "${req.user.intUserID}"`,(err1,res1,fie1)=>{
      if(err1) console.log(err1);
      else{
        res.render('cons-requests/views/newRequest',{moment: moment, consignor: res1});

      }
    })
});

router.post('/newRequest', auth_cons,(req,res)=>{
  var request_no = "1000", rlist_no = "1000", count = 0;
  var loop = req.body.product;

  db.beginTransaction(function(err){
    if(err) console.log(err);
    else{
      db.query(`Select * from tblConsignorRequest order by intRequestNo desc limit 1`,(err1,res1,fie1)=>{
        if(err1) console.log(err1);
        else{
          if(res1.length==0){} else{ request_no = parseInt(res1[0].intRequestNo) + 1}

          db.query(`Select * from tblProductRequest order by intProductRequestNo desc limit 1`,(err2,res2,fie2)=>{
            if(err2) console.log(err2);
            else{
              if(res2.length==0){} else { rlist_no = parseInt(res2[0].intProductRequestNo) + 1}

              db.query(`Insert into tblConsignorRequest (intRequestNo, intConsignorNo, intRequestType) values
              ("${request_no}", "${req.user.intUserID}", 1)`,(err3,res3,fie3)=>{
                if(err3) console.log(err3);
                else{

                  async.eachSeries(loop, function(data,callback){
                    db.query(`Insert into tblProductRequest (intProductRequestNo, intRequestNo, strProductName, strDescription, strProductCategory, strCertifications)
                    values ("${rlist_no}", "${request_no}", "${req.body.product[count]}", "${req.body.description[count]}", "${req.body.category[count]}", "${req.body.certifications[count]}")`,(err4,res4,fie4)=>{
                      if(err4) console.log(err4);
                      else{
                        count++; rlist_no++;
                        callback();
                      }
                    })
                  }, function(err,results){
                    db.commit(function(erra){
                      if(erra) console.log(erra);
                      else {
                        res.send("yes");
                      }
                    })
                  })
                }
              })
            }
          })
        }
      })
    }
  })
});

router.get('/viewRequest',(req,res)=>{
  db.query(`Select * from tblConsignorRequest join tblProductRequest on tblConsignorRequest.intRequestNo = tblProductRequest.intRequestNo
    where tblConsignorRequest.intRequestNo = "${req.query.q}"`,(err1,res1,fie1)=>{
      if(err1) console.log(err1);
      else{
        db.query(`Select * from tblUser join tblSupplier on tblUser.intUserID = tblSupplier.intUserID
          join tblConsignorRequest on tblConsignorRequest.intConsignorNo = tblUser.intUserID
          where intRequestNo = "${req.query.q}"`,(err2,res2,fie2)=>{
            if(err2) console.log(err2);
            else{
              res.render('cons-requests/views/viewRequest',{consignor: res2, re: res1, moment: moment, request: req.query.q  })

            }
          })
      }
    })
})

exports.consRequests = router;
