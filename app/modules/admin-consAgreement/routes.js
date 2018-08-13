var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');

router.get('/',(req,res)=>{
  db.query(`Select * from tblSupplier join tblContract on tblSupplier.intUserID = tblContract.intConsignorID where  intContractStatus = 1 and intSupplierType = 1`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    db.query(`Select * from tblSupplier join tblContract on tblSupplier.intUserID = tblContract.intConsignorID where intContractStatus = 4 and intSupplierType = 1`,(err2,res2,fie2)=>{
      if(err2) console.log(err2);
      if(!err2) res.render('admin-consAgreement/views/consignors',{active: res1, terminated: res2, moment: moment});

    })
  });
});

router.get('/contract',(req,res)=>{
  db.query(`Select * from tblSupplier join tblContract on tblSupplier.intUserID = tblContract.intConsignorID where tblSupplier.intUserID = "${req.query.q}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    if(!err1){

      res.render('admin-consAgreement/views/contract',{contract: res1, moment: moment})
    }
  })
});

router.post('/renew',(req,res)=>{
  console.log('renew');
  db.query(`Update tblContract set intContractStatus = 1 where intContractNo = "${req.body.no}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    db.query(`Update tblSupplier set intStatus = 1
      where tblSupplier.intUserID = (Select intConsignorID from tblContract where intContractNo = ${req.body.no})`,(err2,res2,fie2)=>{
        if(err2) console.log(err2);
        if(!err2) res.send("yes");
      });

  })
});

router.post('/terminate',(req,res)=>{
  console.log('terminate')
  db.query(`Update tblContract set intContractStatus = 4 where intContractNo = "${req.body.no}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    db.query(`Update tblSupplier set intStatus = 0
      where tblSupplier.intUserID = (Select intConsignorID from tblContract where intContractNo = ${req.body.no})`,(err2,res2,fie2)=>{
        if(err2) console.log(err2);
        if(!err2) res.send("yes");
      })

  })
});

exports.consAgreement = router;
