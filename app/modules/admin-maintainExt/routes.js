var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
const generatePassword = require('password-generator');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
var mailAccountUse = "imjanellealag@gmail.com";
const user_name     = 'test.ultrasupergreen@gmail.com';
const email_to = 'imjanellealag@gmail.com';
const passw = 'testusg123';
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/addUserAccount',(req,res)=>{
  var user_no = "1000";
  db.beginTransaction(function(err){
    if(err) console.log(err);
    else{
      db.query(`Select * from tblUser order by intUserID desc limit 1`,(err1,res1,fie1)=>{
        if(err1) console.log(err1);
        else{
          if(res1.length==0){} else{
            user_no = parseInt(res1[0].intUserID) + 1;

            bcrypt.hash(req.body.password,saltRounds,function(erra,hash){
              if(erra) console.log(erra);
              else{
                db.query(`Insert into tblUser (intUserID, intUserTypeNo, strFname, strMname, strLname, strEmail, strUsername, strPassword)
                values ("${user_no}",1,"${req.body.fname}","${req.body.mname}","${req.body.lname}", "${req.body.email}","${req.body.username}","${hash}")`,(err2,res2,fie2)=>{
                  if(err2) console.log(err2);
                  else{
                    db.query(`Select * from tblAdmin where intUserID = "${req.user.intUserID}"`,(err3,res3,fie3)=>{
                      if(err3) console.log(err3);
                      else{
                        db.query(`Insert into tblAdmin (intUserID, strBusinessName, strBusinessAddress, strBusinessEmail,
                           businessTimeOpening, strBusinessPhone, strBusinessMobile, shippingFee,
                          deliveryPeriod, paymentVoucherValidity, bankAccountNo, bankServiceFee, businessBank, intRole)
                          values ("${user_no}", "${res3[0].strBusinessName}","${res3[0].strBusinessAddress}", "${res3[0].strBusinessEmail}",
                          "${res3[0].businessTimeOpening}", "${res3[0].strBusinessPhone}", "${res3[0].strBusinessMobile}", "${res3[0].shippingFee}",
                          "${res3[0].deliveryPeriod}", "${res3[0].paymentVoucherValidity}",
                          "${res3[0].bankAccountNo}", "${res3[0].bankServiceFee}", "${res3[0].businessBank}", 2)`,(err4,res4,fie4)=>{
                            if(err4) console.log(err4);
                            else{
                              db.commit(function(errb){
                                if(errb) console.log(errb);
                                else{
                                  res.send("yes");
                                }
                              })
                            }
                          })
                      }
                    })
                  }
                })
              }
            });
          }
        }
      })
    }
  })
})


router.post('/createAccount',(req,res)=>{
  var password = generatePassword(7, false);
  let transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
   auth: {
     user: user_name,
     pass: passw
   }
});
      bcrypt.hash(password,saltRounds,function(err,hash){
        if(err) console.log(err);
        console.log(req.body.no);
        db.query(`Update tblUser set strUsername = "${req.body.name}", strPassword = "${hash}" where intUserID = "${req.body.no}"`,(err1,res1,fie1)=>{
          if(err1) res.send("error")
          else{

            let mailOptions = {
                from    : user_name, // sender address
                to      : email_to, // list of receivers
                subject : 'USG Consignor Account', // Subject line
                text    : `Username: ${req.body.name}    Password: ${password}`, // plaintext body
                html    : `<b>Username: ${req.body.name}    Password: ${password} </b>`, // html body

            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.send("error");
                }
                console.log('Message sent: ' + info.response);

                res.send({username: req.body.name, password: hash});
              });

          }
        })
      })



  });

router.post('/adjustmentType',(req,res)=>{
  db.query(`Select * from tblAdjustmentTypes where strAdjustment = "${req.body.data}" and intStatus <> 2`,(err,results,fields)=>{
    if(err){ console.log(err); res.send("yes")}
    else{
      if(results.length == 0){
        res.send("no");
      }else{
        res.send("yes");
      }
    }
  })
});

router.post('/certification',(req,res)=>{
  db.query(`Select * from tblProductCertification where strCertification = "${req.body.data}" and intStatus <> 2`,(err,results,fields)=>{
    if(err){ console.log(err); res.send("yes")}
    else{
      if(results.length == 0){
        res.send("no");
      }else{
        res.send("yes");
      }
    }
  })
});

router.post('/brand',(req,res)=>{
  db.query(`Select * from tblProductBrand where strBrand = "${req.body.data}" and intStatus <> 2`,(err,results,fields)=>{
    if(err){ console.log(err); res.send("yes")}
    else{
      if(results.length == 0){
        res.send("no");
      }else{
        res.send("yes");
      }
    }
  })
});

router.post('/businessType',(req,res)=>{
  db.query(`Select * from tblbusinesstype where strBusinessType = "${req.body.data}" and intStatus <> 2`,(err,results,fields)=>{
    if(err){ console.log(err); res.send("yes")}
    else{
      if(results.length == 0){
        res.send("no");
      }else{
        res.send("yes");
      }
    }
  })
});

router.post('/category',(req,res)=>{
  db.query(`Select * from tblcategory where strCategory = "${req.body.data}" and intStatus <> 2`,(err,results,fields)=>{
    if(err){ console.log(err); res.send("yes")}
    else{
      if(results.length == 0){
        res.send("no");
      }else{
        res.send("yes");
      }
    }
  })
});

router.post('/subCategory',(req,res)=>{
  db.query(`Select * from tblsubcategory where (strsubCategory = "${req.body.data}" and intCategoryno = ${req.body.data2}) and intStatus <> 2`,(err,results,fields)=>{
    if(err){ console.log(err); res.send("yes")}
    else{
      if(results.length == 0){
        res.send("no");
      }else{
        res.send("yes");
      }
    }
  })
});

router.post('/measurement',(req,res)=>{
  db.query(`Select * from tbluom where strUnitName = "${req.body.data}" and intStatus <> 2`,(err,results,fields)=>{
    if(err){ console.log(err); res.send("yes")}
    else{
      if(results.length == 0){
        res.send("no");
      }else{
        res.send("yes");
      }
    }
  })
});

router.post('/deleteBusinessType',(req,res)=>{
  console.log(req.body.number)
  db.query(`Update tblbusinesstype set intStatus = 2 where intBusinessTypeNo = "${req.body.number}"`,(err,results,fields)=>{
    if(err) console.log(err);
    else{

      res.send("yes");
    }
  });
});

router.post('/deleteProductCertification',(req,res)=>{
  db.query(`UPDATE tblproductcertification SET intStatus = 2 where intCertificationNo = "${req.body.number}"`,(err,results,fields)=>{
    if(err) console.log(err);
    else{
      res.send("yes");
    }
  });
});

router.post('/deleteProductBrand',(req,res)=>{
  db.query(`UPDATE tblproductbrand SET intStatus = 2 where intBrandNo = "${req.body.number}"`,(err,results,fields)=>{
    if(err) console.log(err);
    else{
      res.send("yes");
    }
  });
});

router.post('/deleteMeasurements',(req,res)=>{
  db.query(`UPDATE tbluom SET intStatus = 2 where intUomNo = "${req.body.number}"`,(err,results,fields)=>{
    if(err) console.log(err);
    else{
      res.send("yes");
    }
  });
});

router.post('/banCustomer',(req,res)=>{
  db.query(`UPDATE tblcustomer SET intStatus = 2 where intUserID = "${req.body.number}"`,(err,results,fields)=>{
    if(err) console.log(err);
    else{
      res.send("yes");
    }
  });
});

exports.maintenance2 = router;
