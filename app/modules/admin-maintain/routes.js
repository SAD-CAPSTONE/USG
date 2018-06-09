var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');


router.get('/voucher', (req,res)=>{
  db.query(`Select * from tblvoucher`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    db.query(`Select * from tblvoucher order by intvoucherno desc limit 1`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);
      res.render('admin-maintain/views/voucher', {re:results1, moment: moment, lastvoucher: results2});

    });

  });
});

router.post('/addVoucher',(req,res)=>{
  db.query(`Insert into tblVoucher (intVoucherNo, strVoucherCode, strDescription, validityDate) values ("${req.body.vno}", "${req.body.vcode}", "${req.body.vdesc}","${req.body.vvalid}")`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    if (!err1) res.send("yes");
  });
});

router.get('/voucherUsers',(req,res)=>{
  var vno = req.query.number;
  var vcode = req.query.vcode;
  db.query(`Select * from tblvoucherusers
join tblUser on tblvoucherusers.intUserID = tblUser.intUserID
 where intvoucherno = "${vno}"`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);

    res.render('admin-maintain/views/voucherUsers', {re:results1, moment:moment, vcode: vcode});
  });
});

router.get('/batch', (req,res)=>{
  res.render('admin-maintain/views/batch');
});

router.get('/supplier', (req,res)=>{
  db.query(`Select tblSupplier.intStatus as Stats, tblUser.*,tblSupplier.* from
    tblUser join tblSupplier on tblUser.intUserID =
    tblSupplier.intUserID`,(err1,results1,fields1)=>{
      if (err1) console.log(err1);
      res.render('admin-maintain/views/supplier', {re: results1});

  });
});

router.get('/supplierForm',(req,res)=>{
  res.render('admin-maintain/views/supplierForm');
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
  db.query(`Select * from tblbusinesstype`,(err1,results1,fields1)=>{
    if (err1) console.log(err2);
    db.query(`Select * from tblbusinesstype order by intbusinesstypeno desc limit 1`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);
      res.render('admin-maintain/views/businessType', {re: results1, moment:moment, lasttype: results2});
    });
  });
});

router.post('/addBusinessType',(req,res)=>{
  db.query(`Insert into tblbusinesstype (intBusinessTypeNo,intAdminID, strBusinessType) values ("${req.body.bno}", "1000","${req.body.btype}")`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    if (!err1) res.send("yes");
  });
});

router.get('/FAQ', (req,res)=>{
  res.render('admin-maintain/views/FAQ');
});

router.get('/promotion', (req,res)=>{
  db.query(`Select * from tblPromo`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    db.query(`Select * from tblpromo order by intPromoNo limit 1`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);
      res.render('admin-maintain/views/promotion',{re: results1, moment: moment, lastpromo: results2});
    });
  });
});

router.post('/addPromotion',(req,res)=>{
  db.query(`Insert into tblPromo (intPromoNo, intAdminID, strProductCode, strPromoName, discount, date_end, strPromoDescription) values ("${req.body.pno}","1000","${req.body.pcode}","${req.body.pname}","${req.body.pdiscount}","${req.body.pdue}","${req.body.pdesc}")`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    if (!err1) res.send("yes");
  });
});

router.get('/promotionList',(req,res)=>{
  var promono = req.query.promo;
  db.query(`Select * from tblpromolist
join tblpromo on tblpromo.intpromono = tblpromolist.intpromono
join tblproductinventory on tblpromolist.intinventoryno = tblproductinventory.intinventoryno
join tbluser on tbluser.intuserid = tblproductinventory.intuserid
where tblpromolist.intpromono = ${promono}`, (err1,results1,fields1)=>{
  if (err1) console.log(err1);

  res.render('admin-maintain/views/promolist', {re: results1, promo: promono});
});
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
