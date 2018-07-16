var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');

router.get('/register-consignor', (req,res)=>{
  db.query(`Select * from tblBusinesstype`,(err1,results1,fields1)=>{
    if (err1){
      console.log(err1);
    }else{
      db.query(`Select * from tblCategory join tblSubCategory on tblCategory.intCategoryNo = tblSubCategory.intCategoryNo`,(err2,results2,fields2)=>{
        if (err2){
          console.log(err2);
        }else{
          db.query(`Select * from tblProductCertification`,(err3,results3,fields3)=>{
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


router.post('/register',(req,res)=>{
  var user_no = "1000";
  var contract_no = "1000";
  // change array to string

  db.beginTransaction(function(err){
    if(err){db.rollback(function(){console.log(err)})
    }else{
      // Select last user record
      db.query(`Select * from tblUser order by intUserID desc limit 1`,(err1,user,fields1)=>{
        if(err1){db.rollback(function(){console.log(err1)})
        }else{
          if(user == null || user == undefined){} else if(user.length == 0){}
          else{
            user_no = parseInt(user[0].intUserID) + 1;
          }

          // Select last contract no
          db.query(`Select * from tblContract order by intContractNo desc limit 1`,(err2,contract,fields2)=>{
            if(err2){db.rollback(function(){console.log(err2)})
            }else{
              if (contract == null || contract == undefined){} else if(contract.length == 0){}
              else{
                contract_no = parseInt(contract[0].intContractNo) + 1;

                // Insert to supplier record
                db.query(`Insert into tblUser (intUserID, intUserTypeNo, strFName, strMName, strLName) values ("${user_no}", 2, "${req.body.fname}", "${req.body.mname}", "${req.body.lname}")`, (err3,useri,fields3)=>{
                  if (err3){db.rollback(function(){console.log(err3)})}
                  else{

                    db.query(`Insert into tblSupplier (intUserID, intBusinessTypeNo, strBrands, strBusinessName, strBusinessEmail, strBusinessAddress, strSupplierPhone, strSupplierMobile, strBusinessTIN,  intSupplierType, intStatus) values ("${user_no}","${req.body.businessType}","${req.body.brands}","${req.body.businessname}", "${req.body.email}", "${req.body.businessaddress}", "${req.body.phone}","${req.body.mobile}","${req.body.businesstin}",  ${req.body.suppliertype}, 0)`,(err4,supplieri,fields4)=>{
                      if(err4) {db.rollback(function(){console.log(err4)})}
                      else{

                        // Insert to contract record
                        var cert = req.body.certification.toString();
                        var cat = req.body.category.toString();
                        db.query(`Insert into tblContract (intContractNo, intConsignorID, timeDayToReach, consignmentPrice, deliverySchedule, strFrequencyOfDelivery, intDTIStat, intBIRStat, intFDAStat, strProductCertifications, strCategories, strFDAID, replacementAgreement, marketingAgreement, intContractStatus) values ("${contract_no}", "${user_no}", "${req.body.besttime}", ${req.body.consignment}, "${req.body.deliverysched}", "${req.body.freq}",${req.body.dtistat},${req.body.birstat},${req.body.fdastat},"${cert}", "${cat}","${req.body.fda}",${req.body.replacement},
                        ${req.body.marketing}, 0)`,(err5,contract1,fields5)=>{
                          if(err5) {db.rollback(function(){console.log(err5)})}
                          else{
                            db.commit(function(e){
                              if(e){db.rollback(function(){console.log(e)})}
                              else{
                                res.send("yes");
                              }
                            })
                          }
                        });
                      }
                    });
                  }
                });
              }
            }
          });
        }
      });
    }
  });
});

exports.consRegistration = router;
