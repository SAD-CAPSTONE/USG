var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
const generatePassword = require('password-generator');


router.post('/createAccount',(req,res)=>{
  var password = generatePassword(7, false);
  res.send({password: password, username: req.body.name});
});

router.post('/brand',(req,res)=>{
  db.query(`Select * from tblProductBrand where strBrand = "${req.body.data}"`,(err,results,fields)=>{
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
  db.query(`Select * from tblbusinesstype where strBusinessType = "${req.body.data}"`,(err,results,fields)=>{
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
  db.query(`Select * from tblcategory where strCategory = "${req.body.data}"`,(err,results,fields)=>{
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
  db.query(`Select * from tblsubcategory where strsubCategory = "${req.body.data}" and intCategoryno = ${req.body.data2}`,(err,results,fields)=>{
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
  db.query(`Select * from tbluom where strUnitName = "${req.body.data}"`,(err,results,fields)=>{
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
