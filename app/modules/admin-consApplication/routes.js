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
          res.render('admin-consApplication/views/cons-register', {btype: results1, category: results2});

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

router.get('/consignor-dash', (req,res)=>{
  res.render('admin-consApplication/views/cons-dashboard');
});

router.get('/', (req,res)=>{
  db.query(`Select tblContract.intContractStatus as stats, tblContract.*,tblSupplier.*,S.* from tblContract join
    tblSupplier on tblContract.intConsignorID = tblSupplier.intUserID
    join tblUser as S  on tblContract.intConsignorID = S.intUserID
    `,(err1,results1,fields1)=>{
      if (err1) console.log(err1);

      res.render('admin-consApplication/views/applicationList', {list: results1, moment: moment});
    });
});

router.get('/details', (req,res)=>{
  var contract = req.query.contract;

  db.query(`Select * from tblContract join tblSupplier on tblContract.intConsignorID = tblSupplier.intUserID join tblUser on tblUser.intUserID = tblSupplier.intUserID join tblBusinesstype on tblbusinesstype.intBusinessTypeNo = tblSupplier.intBusinessTypeNo  where intContractno = ${contract}`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    res.render('admin-consApplication/views/applicationDetails', {contract: results1, moment: moment});

  });
});

router.post('/sendInvitation', (req,res)=>{
  db.query(`Update tblContract set intContractStatus = 3`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

  });
});

router.post('/acceptConsignor', (req,res)=>{
  db.query(`Update tblContract set intContractStatus = 1`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    db.query(`Update tblSupplier set intStatus = 1
      where tblSupplier.intUserID = (Select intConsignorID from tblContract where intContractNo = ${req.body.data})`,(err2,results2,fields2)=>{
        if (err2) console.log(err2);

        res.send("yes");
      });
  });
});

router.post('/terminateContract',(req,res)=>{
  db.query(`Update tblContract set intContractStatus = 4`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    db.query(`Update tblProductOwnership set intStatus = 0`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);

      db.query(`Update tblSupplier set intStatus = 0
        where tblSupplier.intUserID = (Select intConsignorID from tblContract where intContractNo = ${req.body.data})`,(err3,results3,fields3)=>{
          if (err3) console.log(err3);
          if (!err3) res.send("yes");
        });

    });
  });
});

router.post('/reject',(req,res)=>{
  db.query(`Update tblContract set intContractStatus = 2`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);

    db.query(`Update tblSupplier set intStatus = 2
      where tblSupplier.intUserID = (Select intConsignorID from tblContract where intContractNo = ${req.body.data})`,(err2,results2,fields2)=>{
        if (err2) console.log(err2);
        if (!err2) res.send("yes");
      });
  })
});

router.post('/addConsignorProduct',(req,res)=>{

  var itemNo = "0000";
  db.query(`Select * from tblProductOwnership order by intItemOwnNo desc limit 1`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);

    if (results1 == 'undefined' || results1 == 'null' || results1.length == 0){
      itemNo = "0000";
    }else{
      itemNo = parseInt(results1[0].int) + 1;

    }
    db.query(`Insert into tblProductOwnership (intItemOwnNo,strProduct,intUserID) values ("${itemNo}","${req.body.mytext}","${req.body.consignorNo}")`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);

    });
  });
});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.consApplication = router;
