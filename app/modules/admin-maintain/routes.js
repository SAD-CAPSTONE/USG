var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');


router.get('/voucher', (req,res)=>{
  res.render('admin-maintain/views/voucher');
});

router.get('/batch', (req,res)=>{
  res.render('admin-maintain/views/batch');
});

router.get('/supplier', (req,res)=>{
  res.render('admin-maintain/views/supplier');
});

router.get('/productCategory', (req,res)=>{
  db.query(`Select * from tblcategory`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    db.query(`Select tblSubCategory.intStatus as S, tblCategory.*, tblSubcategory.* from tblSubcategory join tblCategory on tblSubcategory.intCategoryNo = tblCategory.intCategoryNo`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);
      res.render('admin-maintain/views/category', {category: results1, sub: results2});

    });

  });
});

router.get('/businessType', (req,res)=>{
  res.render('admin-maintain/views/businessType');
});

router.get('/FAQ', (req,res)=>{
  res.render('admin-maintain/views/FAQ');
});

router.get('/promotion', (req,res)=>{
  res.render('admin-maintain/views/promotion');
});

router.get('/package', (req,res)=>{
  res.render('admin-maintain/views/package');
});

router.get('/measurements', (req,res)=>{
  db.query(`Select * from tblUom`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    res.render('admin-maintain/views/measurements', {re: results1, moment: moment});
  });
});

router.post('/addMeasurement', (req,res)=>{
  var num = 1000;
  // Select last record
  db.query(`Select * from tbluom order by intUomNo desc limit 1`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    if (results1 == null || results1 == undefined || results1.length == 0){

    }else{
      num = parseInt(results1[0].intUomNo)+1;
    }

    db.query(`Insert into tblUom (intUomNo,intUserID,strUnitName) values ("${num}", "1000", "${req.body.measurement}")`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);

      res.redirect('/maintenance/measurements');
    });
  });
});

router.post('/addCategory',(req,res)=>{
  // query last category note
  var num = 1000;
  db.query(`Select * from tblCategory order by intCategoryno desc limit 1`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);

    if(results1 == null || results1 == undefined || results1.length == 0){

    }else{
      num = parseInt(results1[0].intCategoryNo) +1;
    }

    db.query(`Insert into tblCategory (intCategoryNo, intAdminID, strCategory) values ("${num}","1000","${req.body.category}")`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);

      res.redirect('/maintenance/productCategory');
    });
  });
});

router.post('/addSubCategory', (req,res)=>{

  var num = 1000;
  // query last record of subCategory
  db.query(`Select * from tblSubCategory order by intSubCategoryNo desc limit 1`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);


    if (results1 == null || results1 == undefined || results1.length == 0){

    }else{
      num = parseInt(results1[0].intSubCategoryNo) + 1;
    }

    db.query(`Insert into tblSubCategory (intSubCategoryNo, intCategoryNo, strSubCategory) values ("${num}", "${req.body.categ}", "${req.body.subcategory}")`,(err3,results3,fields3)=>{
      if (err3) console.log(err3);

      res.redirect('/maintenance/productCategory');
    });
  });
});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.maintenance = router;
