var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
const userTypeAuth = require('../cust-0extras/userTypeAuth');
const auth_admin = userTypeAuth.admin;

router.get('/', auth_admin, (req,res)=>{
  db.query(`Select * from tblSupplier join tblContract on tblSupplier.intUserID = tblContract.intConsignorID where  tblContract.intContractStatus = 1`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    db.query(`Select * from tblSupplier join tblContract on tblSupplier.intUserID = tblContract.intConsignorID where intContractStatus = 4 and intSupplierType = 1`,(err2,res2,fie2)=>{
      if(err2) console.log(err2);
      if(!err2) res.render('admin-consAgreement/views/consignors',{active: res1, terminated: res2, moment: moment});

    })
  });
});

router.get('/contract', auth_admin,(req,res)=>{
  db.query(`Select * from tblSupplier join tblContract on tblSupplier.intUserID = tblContract.intConsignorID join tblBusinessType on tblBusinessType.intBusinessTypeNo = tblSupplier.intBusinessTypeNo where tblSupplier.intUserID = "${req.query.q}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    if(!err1){
      //console.log(res1);
      res.render('admin-consAgreement/views/contract',{contract: res1, moment: moment})
    }
  })
});

router.post('/renew', auth_admin,(req,res)=>{
  var history_no = "1000";
  db.query(`Update tblContract set startingDate="${req.body.start}", endingDate="${req.body.end}", intContractStatus = 1 where intContractNo = "${req.body.no}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{

      db.query(`Update tblSupplier set intStatus = 1
        where tblSupplier.intUserID = "${req.body.supplier}"`,(err2,res2,fie2)=>{
          db.query(`Select * from tblContractHistory order by intContractHistoryNo desc limit 1`,(err3,res3,fie3)=>{
            if(err3) console.log(err3)
            else{
              if(res3==null||res3==undefined){} else if(res3.length==0) {}
              else{ history_no = parseInt(res3[0].intContractHistoryNo) + 1}

              db.query(`Insert into tblContractHistory (intContractHistoryNo, intContractNo, intContractStatus, strChanges)
              values ("${history_no}", "${req.body.no}", 1, "Renewed Contract ${moment().format("MM/DD/YYYY")}")`,(err4,res4,fie4)=>{
                if(err4) console.log(err4);
                else{
                  res.send("yes");
                }
              })
            }
          })

        });

    }
  })
});

function checkItems(req,res,next){
  var alert = 0;
  var x = 0;
  db.query(`Select * from tblProductInventory where intUserID = "${req.body.supplier}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      if(res1.length==0){
        next();
      }else{
        for(x = 0; x < res1.length; x++){
          if(res1[x].intReservedItems > 0){
            alert = 1;
            break;
          }else{

          }
        }

        if(alert==1){
          res.send("reserved");
        }else{
          next();
        }

      }
    }

  })

}

router.post('/terminate', auth_admin, checkItems,(req,res)=>{

  var history_no = "1000";
  db.query(`Update tblContract set intContractStatus = 4 where intContractNo = "${req.body.no}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    db.query(`Update tblSupplier set intStatus = 0
      where tblSupplier.intUserID = (Select intConsignorID from tblContract where intContractNo = ${req.body.no})`,(err2,res2,fie2)=>{
        if(err2) console.log(err2);
        else{
          db.query(`Select * from tblContractHistory order by intContractHistoryNo desc limit 1`,(err3,res3,fie3)=>{
            if(err3) console.log(err3)
            else{
              if(res3==null||res3==undefined){} else if(res3.length==0) {}
              else{ history_no = parseInt(res3[0].intContractHistoryNo) + 1}

              db.query(`Insert into tblContractHistory (intContractHistoryNo, intContractNo, intContractStatus, strChanges) values ("${history_no}", "${req.body.no}", 4, "Terminated Contract ${moment().format("MM/DD/YYYY")}")`,(err4,res4,fie4)=>{
                if(err4) console.log(err4);
                else{
                  db.query(`Update tblProductInventory set intStatus = 0 where intUserID = "${req.body.supplier}"`,(err01,res01,fie01)=>{
                    if(err01) console.log(err01);
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

  })
});

router.get('/contract/load/:id', auth_admin, (req,res)=>{
  if (!req.user){
    res.send('none')
  }
  else if (req.user.intUserTypeNo != 1){
    res.send('none')
  }
  else{
    db.query(`SELECT strFname, strMname, strLname, strBusinessName, strBrands, strBusinessTIN, strSupplierPhone,
    strSupplierMobile, strBusinessEmail, deliverySchedule, strFrequencyOfDelivery, remittanceSchedule FROM tbluser
    INNER JOIN tblsupplier ON tbluser.intUserID= tblsupplier.intUserID
    INNER JOIN tblcontract ON tblsupplier.intUserID= tblcontract.intConsignorID
    WHERE tblsupplier.intUserID= ?`,[req.params.id], (err, results, fields) => {
      if (err) console.log(err);
      if (results[0]){
        res.send({
          contract: results[0]
        })
      }
      else{
        res.send('none')
      }
    });
  }
});

router.get('/history', auth_admin,(req,res)=>{
  db.query(`Select tblContractHistory.intContractStatus as stat, tblContract.*, tblContractHistory.* from tblContractHistory join tblContract on tblContractHistory.intContractNo = tblContract.intContractNo join tblSupplier on tblContract.intConsignorID = tblSupplier.intUserID where tblSupplier.intUserID = "${req.query.q}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1)
    else{
      res.render('admin-consAgreement/views/history',{re: res1, moment: moment})
    }
  })
});

router.post('/modifyContract', auth_admin,(req,res)=>{
  var history_no = "1000";
  var sheet =  (req.body.sheet == undefined) ? 0 : 1;
  var receipt = (req.body.deliveryreceipt == undefined) ? 0 : 1;
  var profile = (req.body.companyprofile == undefined) ? 0 : 1;
  var certification = (req.body.ecocert == undefined) ? 0 : 1;

  db.beginTransaction(function(err){
    if(err) console.log(err);
    else{
      db.query(`Select * from tblContractHistory order by intContractHistoryNo desc limit 1`,(err1,res1,fie1)=>{
        if(err1) console.log(err1);
        else{
          if(res1.length==0){} else{history_no = parseInt(res1[0].intContractHistoryNo)+1}

          db.query(`Update tblContract set consignmentPrice = ${req.body.price}, strCategories = "${req.body.category}", strProductCertifications = "${req.body.certification}",
            deliverySchedule = "${req.body.delivery}", strFrequencyOfDelivery = "${req.body.frequency}", remittanceSchedule = "${req.body.remittance}",
            intProductInfoSheet = ${sheet}, intDeliveryReceipt = ${receipt}, intCompanyProfile = ${profile}, intEcoCertification = ${certification}
            where intContractNo = "${req.body.cont_no}"`,(err2,res2,fie2)=>{
              if(err2) console.log(err2);
              else{
                db.query(`Insert into tblContractHistory (intContractHistoryNo, intContractNo, intContractStatus, strChanges)
                values("${history_no}", "${req.body.cont_no}", 1, "${req.body.changes}")`,(err3,res3,fie3)=>{
                  if(err3) console.log(err3);
                  else{
                    res.send("yes")
                  }
                })
              }
            })
        }
      })
    }
  })

})

exports.consAgreement = router;
