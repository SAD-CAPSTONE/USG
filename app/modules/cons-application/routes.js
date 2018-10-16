var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');

router.get('/register-consignor', (req,res)=>{
  db.query(`Select * from tblBusinesstype where intStatus = 1`,(err1,results1,fields1)=>{
    if (err1){
      console.log(err1);
    }else{
      db.query(`Select * from tblCategory join tblSubCategory on tblCategory.intCategoryNo = tblSubCategory.intCategoryNo
         where tblCategory.intStatus = 1 and tblSubCategory.intStatus =1`,(err2,results2,fields2)=>{
        if (err2){
          console.log(err2);
        }else{
          db.query(`Select * from tblProductCertification where intStatus = 1`,(err3,results3,fields3)=>{
            if (err3){
              console.log(err3)
            }else{
              res.render('cons-application/views/cons-register', {btype: results1, category: results2, certification: results3});
            }
          });
        }
      });
    }
  });
});
// router.get('/register-consignor', (req,res)=>{
//   res.render()
// });

router.post('/register-consignor',(req,res)=>{
  var user_no = "1000";
  var contract_no = "1000";
  // change array to string

  let cert = req.body.certification ?
    req.body.certification.reduce((str, data)=>{
      str ? str += `, ` : 0;
      return str += data;
    },'') : null,
  mkt = req.body.marketing ? 1 : 0,
  cat = req.body.category ?
    req.body.category.reduce((str, data)=>{
      str ? str += `, ` : 0;
      return str += data;
    },'') : null,
  phone = req.body.phone.slice(4).slice(0,3) + req.body.phone.slice(4).slice(4),
  mname = req.body.mname ? req.body.mname : null,
  fda = req.body.fda ? req.body.fda : null,
  besttime = req.body.besttime ? req.body.besttime : null;

  cat ?
    req.body.others && req.body.specify ? cat += `, ${req.body.specify}` : 0
  : 0

  db.beginTransaction(function(err){
    if(err){db.rollback(function(){console.log(err)})
    }else{

      // Select last user record
      db.query(`Select * from tblUser order by intUserID desc limit 1`,(err,user,fields1)=>{
        if(err){db.rollback(function(){console.log(err)})
        }else{
          user[0] ? user_no = parseInt(user[0].intUserID) + 1 : 0

          // Select last contract no
          db.query(`Select * from tblContract order by intContractNo desc limit 1`,(err,contract,fields2)=>{
            if(err){db.rollback(function(){console.log(err);})
            }else{

              if (contract == null || contract == undefined){} else if(contract.length == 0){}
              else{ contract_no = parseInt(contract[0].intContractNo) + 1; }

                // Insert to supplier record
                db.query(`Insert into tblUser (intUserID, intUserTypeNo, strFName, strMName, strLName, strEmail)
                values (?,2,?,?,?,?)`,
                [user_no, req.body.fname, req.body.mname, req.body.lname, req.body.email], (err,useri,fields3)=>{

                  if (err){db.rollback(function(){console.log(err);})}
                  else{

                    db.query(`Insert into tblSupplier (intUserID, intBusinessTypeNo, strBrands, strBusinessName, strBusinessEmail,
                      strBusinessAddress, strSupplierPhone, strSupplierMobile, strBusinessTIN, intSupplierType, intStatus)
                      values (?,?,?,?,?,?,?,?,?,?,3)`,
                      [user_no, req.body.businessType, req.body.brands, req.body.businessname, req.body.email, req.body.businessaddress,
                      phone, req.body.mobile, req.body.businesstin, 1],(err,supplieri,fields4)=>{

                      if(err) {db.rollback(function(){console.log(err);})}
                      else{
                        // Insert to contract record

                        db.query(`Insert into tblContract (intContractNo, intConsignorID, intAdminID, timeDayToReach, consignmentPrice,
                          deliverySchedule, strFrequencyOfDelivery, intDTIStat, intBIRStat, intFDAStat, strProductCertifications,
                          strCategories, strFDAID, replacementAgreement, marketingAgreement, intContractStatus) values (?,?,1000,?,?,?,?,?,?,?,?,?,?,?,?,0)`,
                          [contract_no, user_no, besttime, req.body.consignment, req.body.deliverysched, req.body.freq,
                          req.body.dtistat, req.body.birstat, req.body.fdastat, cert, cat, fda, req.body.replacement,
                          mkt],(err,contract1,fields5)=>{
                          if(err) {db.rollback(function(){console.log(err);})}
                          else{
                            db.commit(function(e){
                              if(e){db.rollback(function(){console.log(e);})}
                              else{
                                res.render('cons-application/views/success');
                              }
                            })
                          }
                        });
                      }
                    });
                  }
                });

            }
          });
        }
      });
    }
  });
});

exports.consRegistration = router;
