var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
 

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
