var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
var voucher_codes = require('voucher-code-generator');


// Adjustment Types ---------------
router.get('/adjustmentTypes',(req,res)=>{
  db.query(`Select * from tblAdjustmentTypes where intStatus <> 2`,(err1,res1,fie1)=>{
    if(err1) console.log(err1)
    if(!err1) res.render('admin-maintain/views/adjustmentType', {re: res1, moment: moment});
  });
});

router.post('/changeAdjustmentStat',(req,res)=>{
  db.query(`Update tblAdjustmentTypes set intStatus = ${req.body.value} where intAdjustmentTypeNo = "${req.body.no}"`,(err2,res2,fie2)=>{
    if(err2) console.log(err2);
    res.send("")
  })
});

router.post('/addAdjustment',(req,res)=>{
  var no = "1000";
  db.query(`Select * from tblAdjustmentTypes order by intAdjustmentTypeNo desc limit 1`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    if(!err1){
      if(res1.length == 0){}
      else{ no = parseInt(res1[0].intAdjustmentTypeNo) +1}

      db.query(`Insert into tblAdjustmentTypes (intAdjustmentTypeNo, strAdjustment, intAdjustmentType, intAdminID) values (${no}, "${req.body.adjustment}", ${req.body.type}, "1000")`,(err2,res2,fie2)=>{
        if(err2) console.log(err2);
        if(!err2) res.send("yes")
      })
    }
  })
});

router.post('/editAdjustmentType',(req,res)=>{
  db.query(`Update tblAdjustmentTypes set strAdjustment = "${req.body.type_edit}", intAdjustmentType = ${req.body.type} where intAdjustmentTypeNo = "${req.body.no_edit}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      res.send("yes")
    }
  })
})

// Voucher -----------------------
router.get('/voucher', (req,res)=>{
  var code = voucher_codes.generate({
      prefix: "USG-",
      postfix: "-2018"
  })
  db.query(`Select * from tblvoucher`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);

    db.query(`Select intVoucherNo, strVoucherCode from tblvoucher order by intvoucherno desc limit 1`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);
      res.render('admin-maintain/views/voucher', {re:results1, moment: moment, lastvoucher: results2, code: code});

    });

  });
});

// Batch -------

router.get('/batch',(req,res)=>{
  db.query(`Select tblBatch.intQuantity as quantity, tblproductInventory.*, tblBatch.*, tblproductlist.* from tblBatch join tblproductinventory on tblbatch.intInventoryNo = tblproductInventory.intInventoryNo join tblProductList on tblProductList.intProductno = tblproductInventory.intProductno`,(err,results,fields)=>{
    if(err) console.log(err);
    res.render('admin-maintain/views/batch',{re: results, moment: moment});
  });
});

router.post('/addVoucher',(req,res)=>{
  db.query(`Insert into tblVoucher (intVoucherNo, strVoucherCode, strDescription, validityDate, discount) values ("${req.body.vno}", "${req.body.vcode}", "${req.body.vdesc}","${req.body.vvalid}", ${req.body.vdisc})`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    if (!err1) res.send("yes");
  });
});

router.post('/inactivateVoucher',(req,res)=>{
  db.query(`Update tblVoucher set intStatus = 0 where intVoucherNo = "${req.body.no}"`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    if (!err1) res.send("yes");
  });
});

router.post('/activateVoucher',(req,res)=>{
  db.query(`Update tblVoucher set intStatus = 1 where intVoucherNo = "${req.body.no}"`,(err1,results1,fields1)=>{
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

router.post('/editVoucher',(req,res)=>{
  res.send("yes");
});

// Batch -------------------------
router.get('/batch', (req,res)=>{
  res.render('admin-maintain/views/batch');
});

// Supplier --------------------------
router.get('/supplier', (req,res)=>{
  db.query(`Select tblSupplier.intStatus as Stats, tblUser.*,tblSupplier.* from
    tblUser join tblSupplier on tblUser.intUserID =
    tblSupplier.intUserID where tblSupplier.intStatus <> 3 and tblSupplier.intStatus <> 0 and tblSupplier.intStatus <> 2`,(err1,results1,fields1)=>{
      if (err1) console.log(err1);
      res.render('admin-maintain/views/supplier', {re: results1});

  });
});

router.get('/supplierForm',(req,res)=>{
  db.query(`Select * from tblUser order by intUserID desc limit 1`,(err1,results1,fields1)=>{
      if (err1) console.log(err1);

      db.query(`Select * from tblbusinesstype where intStatus = 1`,(err2,results2,fields2)=>{
        if (err2) console.log(err2);

        var lastnum = "1000";
        if (results1 == null || results1 == undefined){

        }else if(results1.length == 0){

        }else{
          lastnum = parseInt(results1[0].intUserID) + 1;
        }
        console.log(lastnum);
        res.render('admin-maintain/views/supplierForm', {lastsupplier: lastnum, businesstype: results2});

      });

  });
});

router.post('/addSupplier',(req,res)=>{
  var no = "1000";
  var cont_no = "1000";


  db.beginTransaction(function(err){
    if(err){db.rollback(function(){console.log(err)})}
    else{
      db.query(`Select * from tblUser order by intUserID desc limit 1`,(err1,results1,fields1)=>{
        if(err1){db.rollback(function(){console.log(err1)})}
        else{
          if(results1 == null || results1 == undefined){} else if (results1.length == 0){}
          else{
            no = parseInt(results1[0].intUserID) +1;
          }
          db.query(`Insert into tblUser (intUserID, intUserTypeNo, strFName, strMName, strLName,
            strEmail) values ("${no}",2,"${req.body.fname}","${req.body.mname}","${req.body.lname}","${req.body.email}")`,(err2,results2,fields2)=>{
            if(err2) {db.rollback(function(){console.log(err2)})}
            else{
              db.query(`Insert into tblSupplier (intUserID, intBusinessTypeNo, strBrands,
                strBusinessName, strBusinessEmail,strBusinessAddress,strSupplierPhone,strSupplierMobile,strBusinessTIN, intInvoiceAvailable, intSupplierType) values ("${no}","${req.body.busstype}","${req.body.brands}","${req.body.bname}","${req.body.email}","${req.body.address}","${req.body.phone}","${req.body.mobile}","${req.body.tin}","${req.body.inv}",${req.body.supptype})`,(err3,results3,fields3)=>{
                if (err3) {db.rollback(function(){console.log(err3)})}
                else{

                  // for Outright suppliers
                  if(req.body.supptype == 2){
                    db.commit(function(erra){
                      if (erra) {db.rollback(function(){console.log(erra)})}
                      else{
                        res.send("yes");
                      }
                    });

                  // for Consignor suppliers
                  }else{
                    db.query(`Select * from tblContract order by intContractNo desc limit
                      1`,(err4,contract,fields4)=>{
                      if(err4) {db.rollback(function(){console.log(err4)})}
                      if(!err4){
                        console.log(err4);
                        if(contract==undefined||contract==null){} else if(contract.length==0){}
                        else{ cont_no = parseInt(contract[0].intContractNo) + 1;}

                        db.query(`Insert into tblContract (intContractNo, intConsignorID, intAdminID, startingDate, endingDate, consignmentPrice, deliverySchedule, strFrequencyOfDelivery, remittanceSchedule, intCompanyProfile, intProductInfoSheet, intDTIStat, intBIRStat, intDeliveryReceipt, intFDAStat, strProductCertifications, intContractStatus, strCategories, strFDAID, replacementAgreement, marketingAgreement) values ("${cont_no}", "${no}", "${1000}", "${req.body.startDate}","${req.body.endDate}",${req.body.commission},"${req.body.deliverySchedule}","${req.body.frequencyDelivery}", "${req.body.remittanceSched}", ${req.body.companyProfile}, ${req.body.productInfoSheet}, ${req.body.dti},${1},${req.body.deliveryReceipt},${req.body.fdaStat}, "${req.body.certifications}", ${1}, "${req.body.categories}", "${req.body.fdaID}", ${req.body.replacement},${req.body.marketing})`,(err5,results5,fields5)=>{
                          if(err5) {db.rollback(function(){console.log(err5)})}
                          if(!err5){
                            db.commit(function(errb){
                              if (errb) {db.rollback(function(){console.log(errb)})}
                              else{
                                res.send("yes");
                              }
                            });
                          }
                        }); // End of insert to contract -----------------
                      }
                    }); // Select * contract --------------
                  }
                }
              }); // End of insert to tblSupplier  ---------------
            }
          }) // End of Insert to tblUser ----------------
        }
      }); // End of Select * tblUser -------------
    }
  }); // End of transaction ------------------

});

router.post('/inactivateSupplier',(req,res)=>{
  db.query(`Update tblSupplier set intStatus = 4 where intUserID = "${req.body.no}"`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    if(!err1) res.send("yes");
  });
})

router.post('/activateSupplier',(req,res)=>{
  db.query(`Update tblSupplier set intStatus = 1 where intUserID = "${req.body.no}"`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    if(!err1) res.send("yes");
  });
});

router.get('/supplierDetails',(req,res)=>{
  db.query(`Select * from tblUser join tblSupplier on tblUser.intUserID = tblSupplier.intUserID where tblUser.intUserID = "${req.query.supplier}"`,(err1,supplier,fields1)=>{
    if(err1){
      console.log(err1); res.send("error");
    }else{

      if(supplier[0].intSupplierType == 2){
        res.render('admin-maintain/views/outrightDetail',{re: supplier});
      }
      else{
        db.query(`Select * from tblContract where intConsignorID = "${req.query.supplier}"`,(err2,contract,fields2)=>{
          if(err2){
            console.log(err2); res.send("error");
          }
          else{
            res.render('admin-maintain/views/consignorDetail',{re: supplier, co: contract});
          }
        });
      }
    }
  });
});

router.get('/contract',(req,res)=>{
  db.query(`Select * from tblContract where intConsignorID = "${req.query.c}" order by applicationDate desc`,(err1,results1,fields1)=>{
    if(err1) console.log(err1);
    if(!err1){
      res.render('admin-maintain/views/contracts',{re: results1, moment: moment})
    }
  });
});



// Product Category --------------------------
router.get('/productCategory', (req,res)=>{
  db.query(`Select * from tblcategory`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    db.query(`Select tblSubCategory.intStatus as S, tblCategory.*, tblSubcategory.* from tblSubcategory join tblCategory on tblSubcategory.intCategoryNo = tblCategory.intCategoryNo`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);
      res.render('admin-maintain/views/category', {category: results1, sub: results2});

    });

  });
});

router.post('/editCategory',(req,res)=>{
  db.query(`Update tblCategory set strCategory = "${req.body.category}" where intCategoryNo = "${req.body.no}"`,(err,results,fieldds)=>{
    if(err) console.log(err);
    else{
      res.send("yes")
    }
  });
});

router.post('/editSubCategory',(req,res)=>{
  db.query(`Update tblSubCategory set strSubCategory = "${req.body.subcateg_e}", intCategoryNo = "${req.body.categ_e}" where intSubCategoryNo = "${req.body.no_e}"`,(err,results,fieldds)=>{
    if(err) console.log(err);
    else{
      res.send("yes")
    }
  });
});

router.post('/changeCategoryStat',(req,res)=>{
  db.query(`Update tblCategory set intStatus = ${req.body.value} where intCategoryNo = "${req.body.no}"`,(err2,res2,fie2)=>{
    if(err2) console.log(err2);
    res.send("")
  })
});

router.post('/changeSubCategoryStat',(req,res)=>{
  db.query(`Update tblSubCategory set intStatus = ${req.body.value} where intSubCategoryNo = "${req.body.no}"`,(err2,res2,fie2)=>{
    if(err2) console.log(err2);
    res.send("")
  })
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

    db.query(`Insert into tblSubCategory (intSubCategoryNo, intCategoryNo, strSubCategory) values ("${num}", "${req.body.categ_a}", "${req.body.subcategory}")`,(err3,results3,fields3)=>{
      if (err3) console.log(err3);

      res.redirect('/maintenance/productCategory');
    });
  });
});



// Business Type -------------------
router.get('/businessType', (req,res)=>{
  db.query(`Select * from tblbusinesstype WHERE intStatus != 2`,(err1,results1,fields1)=>{
    if (err1) console.log(err2);
    db.query(`Select * from tblbusinesstype order by intbusinesstypeno desc limit 1`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);
      res.render('admin-maintain/views/businessType', {re: results1, moment:moment, lasttype: results2});
    });
  });
});

router.post('/addBusinessType',(req,res)=>{
  var no = "1000";
  db.query(`Select * from tblBusinessType order by intBusinessTypeNo desc limit 1`,(err2,res2,fie2)=>{
    if(err2) console.log(err2);
    if(!err2){
      if(res2.length == 0){}
      else{ no = parseInt(res2[0].intBusinessTypeNo) + 1}

      db.query(`Insert into tblbusinesstype (intBusinessTypeNo,intAdminID, strBusinessType) values ("${no}", "1000","${req.body.btype}")`,(err1,results1,fields1)=>{
        if (err1) console.log(err1);
        if (!err1) res.send("yes");
      });
    }
  })

});

router.post('/editBusinessType',(req,res)=>{
  db.query(`Update tblBusinessType set strBusinessType = "${req.body.type_edit}" where intBusinessTypeNo = "${req.body.no_edit}"`,(err,resu,fie)=>{
    if(err) console.log(err);
    else{
      res.send("yes");
    }
  });
})

router.post('/changeBusinessTypeStat',(req,res)=>{
  db.query(`Update tblBusinessType set intStatus = ${req.body.value} where intBusinessTypeNo = "${req.body.no}"`,(err2,res2,fie2)=>{
    if(err2) console.log(err2);
    res.send("")
  })
});


// FAQ --------------------------------
router.get('/FAQ', (req,res)=>{
  db.query(`Select * from tblfaq`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    db.query(`Select * from tblfaq order by intfaqno desc limit 1`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);
      var num = "1000";
      if (results2 == null || results2 == undefined){

      }else if (results2.length == 0){

      }else{
        num = parseInt(results2[0].intFaqNo) + 1;
      }
      res.render('admin-maintain/views/FAQ', {re: results1, lastfaq: num });

    });

  });
});

router.post('/addFaq',(req,res)=>{
  db.query(`Insert into tblfaq (intFaqNo, strQuestion, strAnswer) values ("${req.body.fno}", "${req.body.question}", "${req.body.answer}")`,(err1,results1,fields1)=>{
    if (err1){
     console.log(err1);
     res.send("no");
    }
    if (!err1) res.send("yes");
  });
});

router.post('/inactivateFaq',(req,res)=>{
  db.query(`Update tblFaq set intStatus = 0 where intFaqNo = "${req.body.no}"`,(err1,results1,fields1)=>{
    if(err1) console.log(err1);
    if(!err1) res.send("yes");
  });
});

router.post('/activateFaq',(req,res)=>{
  db.query(`Update tblFaq set intStatus = 1 where intFaqNo = "${req.body.no}"`,(err1,results1,fields1)=>{
    if(err1) console.log(err1);
    if(!err1) res.send("yes");
  });
});


 // Promotion --------------------------------
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
  db.query(`Insert into tblPromo (intPromoNo, intAdminID,  strPromoName, discount, date_end, strPromoDescription) values ("${req.body.pno}","1000","${req.body.pname}","${req.body.pdiscount}","${req.body.pdue}","${req.body.pdesc}")`,(err1,results1,fields1)=>{
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

      // product list
      db.query(`Select * from tblproductinventory
        join tblproductlist on tblproductinventory.intproductno = tblproductlist.intproductno
        join tbluser on tblproductinventory.intuserid = tbluser.intuserid
        join tblproductbrand on tblproductlist.intbrandno = tblproductbrand.intbrandno
        join tbluom on tblproductinventory.intuomno = tbluom.intuomno
        where tblproductinventory.intPromotype = 1
        and tblproductinventory.intinventoryno not in (Select intInventoryno from tblpromolist)`,(err2,results2,fields2)=>{
          if (err2) console.log(err2);

          res.render('admin-maintain/views/promolist', {re: results1, promo: promono, productlist: results2});

        });

  });
});

router.post('/addToPromo',(req,res)=>{
  db.query(`Select * from tblpromolist order by intpromolistno desc limit 1`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    var num = "1000";
    if (results1 == null || results1 == undefined){

    }else if (results1.length == 0){

    }else{
      num = parseInt(results1[0].intPromoListNo) + 1;
    }
    db.query(`Insert into tblpromolist (intPromoListno, intPromoNo, intInventoryNo) values("${num}","${req.body.pno}","${req.body.ino}")`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);

      if (!err2) res.send("yes");
    });

  });
});

router.post('/inactivatePromo',(req,res)=>{
  db.query(`Update tblPromo set intStatus = 0 where intPromoNo = "${req.body.intPromoNo}"`,(err1,results1,fields1)=>{
    if(err1) console.log(err1);
    if (!err1) res.send("yes");
  })
});

router.post('/activatePromo',(req,res)=>{
  db.query(`Update tblPromo set intStatus = 1 where intPromoNo = "${req.body.intPromoNo}"`,(err1,results1,fields1)=>{
    if(err1) console.log(err1);
    if (!err1) res.send("yes");
  })
});

 // Package -------------------------------
router.get('/package', (req,res)=>{
  db.query(`Select * from tblpackage`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);
    db.query(`Select * from tblpackage where dateDue <= CURDATE()`,(err2,res2,fie2)=>{
      if(err2) console.log(err2);
      else{
        res.render('admin-maintain/views/package',{re: results1, moment: moment, due: res2});
      }
    })
  });
});

router.post('/getBarcode',(req,res)=>{
  db.query(`Select * from tblproductInventory join tblproductlist on tblproductinventory.intproductno = tblproductlist.intproductno
  join tblsubcategory on tblsubcategory.intsubcategoryno = tblproductlist.intsubCategoryNo
  join tblcategory on tblcategory.intCategoryNo = tblSubCategory.intCategoryno
  join tbluom on tbluom.intUomNo = tblproductInventory.intUomNo
  join tblProductBrand on tblProductList.intBrandno = tblProductBrand.intBrandNo where strBarcode = "${req.body.o}"`,(err1,inventory,fields1)=>{
    if(err1){
      console.log(err1); res.send("error");
    }
    if(!err1){
      db.query(`Select SUM(tblBatch.intQuantity) - SUM(tblBatch.intReservedItems) as totalQty from tblBatch join tblproductInventory on tblBatch.intInventoryNo = tblproductInventory.intInventoryNo where strBarcode = "${req.body.o}" `,(err2,batch,fie3)=>{
        if(err2){
          console.log(err2); res.send("error");
        }
        if(!err2){
          if(inventory == null|| inventory == undefined){res.send("error")}
          else if(inventory.length == 0){res.send("error")}
          else{ res.json({inventory: inventory, batch: batch})}
        }
      })

    }
  });
});

router.post('/addPackage',(req,res)=>{
  db.query(`Select * from tblpackage order by intPackageNo desc limit 1`,(err1,results1,fields1)=>{
    if (err1) console.log(err1);

    var num = "1000";
    if (results1 == null || results1 == undefined){

    }else if (results1.length == 0){

    }else{
      num = parseInt(results1[0].intPackageNo) + 1;
    }

    db.query(`Insert into tblpackage (intPackageNo, intAdminID, strPackageName, strPackageDescription, packagePrice, intQuantity, dateDue) values ("${num}","1000","${req.body.pname}","${req.body.pdesc}",${req.body.pprice}, ${req.body.pquantity}, "${req.body.pdue}")`,(err2,results2,fields2)=>{
      if (err2) console.log(err2);
      if (!err2) res.send("yes");
    });
  })
});

router.get('/packageList',(req,res)=>{
  var pack = req.query.package;

  db.query(`Select * from tblpackagelist
    join tblproductinventory on tblpackagelist.intinventoryno = tblproductinventory.intinventoryno
    join tblproductlist on tblproductlist.intproductno = tblproductinventory.intproductno
    join tbluom on tblproductinventory.intuomno = tbluom.intuomno
    join tbluser on tblproductinventory.intuserid = tbluser.intuserid
    where tblpackagelist.intpackageno = ${pack}`,(err1,results1,fields1)=>{
      if (err1) console.log(err1);

      db.query(`Select * from tblPackage where intPackageNo = ${pack}`,(err2,results2,fields2)=>{
        if(err2) console.log(err2);

        res.render('admin-maintain/views/packagelist',{re:results1, moment: moment, package: pack, quantity: results2[0].intQuantity});
      });


    });
});

router.post('/addPackageList',(req,res)=>{
  var no = "1000";

  db.beginTransaction(function(err){
    if(err){db.rollback(function(){console.log(err); res.send("error");})}
    else{
      db.query(`Select * from tblPackageList order by intpackagelistno desc limit 1`,(err1,results1,fields1)=>{
        if(err1){db.rollback(function(){console.log(err1); res.send("error");})}
        if(!err1){
          if(results1==null||results1==undefined){} else if(results1.length==0){}
          else{
            no = parseInt(results1[0].intPackageListNo) + 1;
          }

          db.query(`Insert into tblPackageList (intPackageListNo, intInventoryNo, intPackageNo, intProductQuantity) values ("${no}","${req.body.inventory}","${req.body.package}","${req.body.quantity}")`,(err2,results2,fields2)=>{
            if(err2){db.rollback(function(){console.log(err2); res.send("error");})}

            db.query(`Update tblPackage set intQuantity = ${req.body.package_quantity} where intPackageNo = "${req.body.package}"`,(err3,res3,fie3)=>{
              if(err3) {db.rollback(function(){console.log(err3); res.send("error");})}

              db.query(`Update tblProductInventory set intQuantity = intQuantity - (${req.body.package_quantity} * ${req.body.quantity}) where intInventoryNo = "${req.body.inventory}"`,(err4,res4,fie4)=>{
                if(err4) {db.rollback(function(){console.log(err4); res.send("error");})}
                else{
                  db.query(`SELECT * FROM tblbatch where intinventoryno = "${req.body.inventory}"  order by created_at`,(err5,batch,fie5)=>{
                    if(err5) {db.rollback(function(){console.log(err5); res.send("error");})}
                    else{
                      var remaining = req.body.package_quantity * req.body.quantity;
                      for(var a in batch){
                        if(remaining == 0){
                          break;

                        }
                        else if(batch[a].intQuantity < remaining || batch[a].intQuantity == remaining){
                          let newValue = 0;
                          // remaining -= batch[a].intQuantity;
                          // console.log('newValue: '+newValue);
                          // console.log('remaining: '+remaining);
                          db.query(`Update tblBatch set intQuantity = ${newValue} where intBatchNo = "${batch[a].intBatchNo}"`,(e4,r4,f4)=>{
                            if(e4)console.log(e4);
                          });

                        }
                        else{
                          let newValue = batch[a].intQuantity - remaining;
                          remaining = 0;
                          // console.log('newValue: '+newValue);
                          // console.log('remaining: '+remaining);
                          db.query(`Update tblBatch set intQuantity = ${newValue} where intBatchNo = "${batch[a].intBatchNo}"`,(e5,r5,f5)=>{
                            if(e5)console.log(e5);
                          });
                        }
                      }
                      com(req,res);
                      function com(req,res){
                        db.commit(function(e){
                          if(e){db.rollback(function(){console.log(e); res.send("error");})}
                          else{
                            res.send("success");

                          }
                        })
                      }


                    }
                  })
                }
              });
            });

          });
        }
      });
    }
  })


});

router.post('/changePackageStat',(req,res)=>{
  db.query(`Update tblPackage set intStatus = ${req.body.value} where intPackageNo = "${req.body.no}"`,(err2,res2,fie2)=>{
    if(err2) console.log(err2);
    res.send("")
  })
});

router.post('/editPackage',(req,res)=>{
  //var d = moment(req.body.date).format('')
  db.query(`Update tblPackage set strPackageName = "${req.body.name}", strPackageDescription="${req.body.description}", packagePrice=${req.body.price}, dateDue="${req.body.date}" where intPackageNo = "${req.body.no}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      res.send("yes")
    }
  })
})

// Measuremens ------------------------------------
router.get('/measurements', (req,res)=>{
  db.query(`Select * from tblUom WHERE intStatus != 2`, (err1,results1,fields1)=>{
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

    db.query(`Insert into tblUom (intUomNo,intUserID,strUnitName, strDescription) values ("${num}", "1000", "${req.body.measurement}", "${req.body.description}")`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);

      res.send("yes")
    });
  });
});

router.post('/editMeasurement',(req,res)=>{
  db.query(`Update tblUom set strUnitName = "${req.body.measure}", strDescription = "${req.body.description}" where intUomNo = "${req.body.no}"`,(err,results,fields)=>{
    if(err) console.log(err);
    else{
      res.send("yes");
    }
  });
});

router.post('/changeUomStat',(req,res)=>{
  db.query(`Update tblUom set intStatus = ${req.body.value} where intUomno = "${req.body.no}"`,(err2,res2,fie2)=>{
    if(err2) console.log(err2);
    res.send("")
  })
});


// Customer -------------------------------------
router.get('/customer', (req,res)=>{
  db.query(`SELECT tblcustomer.intStatus as Stats, tblUser.*,tblcustomer.* from
    tblUser join tblcustomer on tblUser.intUserID =
    tblcustomer.intUserID WHERE intStatus != 2`,(err1,results1)=>{
      if (err1) console.log(err1);
      res.render('admin-maintain/views/customer', {re: results1});


  });
});

// Certification --------------------------------
router.get('/productCertification',(req,res)=>{
  db.query(`Select * from tblProductCertification WHERE intStatus != 2`,(err1,results1,fields1)=>{
    if(err1) console.log(err1);
    res.render('admin-maintain/views/certifications',{certification: results1});
  });
});

router.post('/addCertification',(req,res)=>{
  var certno = "1000";
  db.query(`Select * from tblProductCertification order by intCertificationNo desc limit 1`,(err1,results1,fields1)=>{
    if(err1) console.log(err1);

    if(results1 == null || results1 == undefined){

    }else if(results1.length == 0){

    }else{
      certno = parseInt(results1[0].intCertificationNo) + 1;
    }

    db.query(`Insert into tblProductCertification (intCertificationNo, strCertification) values ("${certno}", "${req.body.certification}")`, (err2,results2,fields2)=>{
      if (err2) console.log(err2);
      res.send("yes");
    })
  });
});

router.post('/editCertification',(req,res)=>{
  db.query(`Update tblProductCertification set strCertification = "${req.body.certification_e}" where intCertificationNo = "${req.body.no_e}"`,(err,resu,fie)=>{
    if(err) console.log(err);
    else{
      res.send("yes");
    }
  });
});

router.post('/changeCertificationStat',(req,res)=>{
  db.query(`Update tblProductCertification set intStatus = ${req.body.value} where intCertificationNo = "${req.body.no}"`,(err2,res2,fie2)=>{
    if(err2) console.log(err2);
    res.send("")
  })
});

// Brand ---------------
router.get('/brand',(req,res)=>{
  db.query(`Select * from tblProductBrand WHERE intStatus != 2`,(err1,results1,fields1)=>{
    if(err1) console.log(err1);
    if(!err1) res.render('admin-maintain/views/brand',{re: results1});
  });
});

router.post('/addBrand',(req,res)=>{
  var no = "1000";
  db.query(`Select * from tblProductBrand order by intBrandNo desc limit 1`,(err1,results1,fields1)=>{
    if(err1) console.log(err1);
    if(!err1){
      if(results1 == null || results1 == undefined){} else if (results1.length == 0 ){}
      else{ no = parseInt(results1[0].intBrandNo) + 1; }

      db.query(`Insert into tblProductBrand (intBrandNo, strBrand) values ("${no}", "${req.body.brand}")`,(err2,results2,fields2)=>{
        if(err2)console.log(err2);
        if (!err2) res.send("yes");
      });
    }
  });
});

router.post('/editBrand',(req,res)=>{
  db.query(`Update tblProductBrand set strBrand = "${req.body.brand}" where intBrandNo = "${req.body.no}"`,(err1,res1,fie1)=>{
    if(err1) console.log(err1)
    else{
      res.send("yes");
    }
  })
})

router.post('/changeBrandStat',(req,res)=>{
  db.query(`Update tblProductBrand set intStatus = ${req.body.value} where intBrandNo = "${req.body.no}"`,(err2,res2,fie2)=>{
    if(err2) console.log(err2);
    res.send("")
  })
});


router.post('/editCustomer',(req,res)=>{
    db.query(`UPDATE tbluser SET strEmail = ?, strUsername = ?, strFname = ?, strMname = ?, strLname = ? WHERE intUserID = ?`,[req.body.c_email, req.body.c_uname, req.body.c_fname, req.body.c_mname, req.body.c_lname, req.body.c_no], (err,results,fields)=>{
      if(err) console.log(err);
      else{
        res.send("yes")
      }
      db.query(`UPDATE tblcustomer SET strShippingAddress = ?, strBillingAddress = ?, strCusPhoneNo = ?, strCusMobileNo = ? WHERE intUserID = ?`,[req.body.c_saddress, req.body.c_baddress, req.body.c_pno, req.body.c_mno, req.body.c_no], (err,results,fields)=>{
        if(err) console.log(err);
    });
  });
});

// User Accounts ------------------------
router.get('/userAccounts',(req,res)=>{
  db.query(`Select * from tblUser join tblAdmin on tblUser.intUserID = tblAdmin.intUserID where intUserTypeNo = 1`,(err1,res1,fie1)=>{
    res.render('admin-maintain/views/userAccounts', {re: res1, moment: moment});

  })
});





exports.maintenance = router;
