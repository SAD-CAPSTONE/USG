var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
var async = require('async');

router.get('/',(req,res)=>{
  db.query(`Select tblPurchaseOrder.intStatus as stat, tblreceiveorder.intReceiveorderNo as rno, tblreturnbadorders.*, tblreceiveorder.*, tblSupplier.* from tblreturnbadorders join tblreceiveorder on tblreturnbadorders.intReceiveorderNo = tblreceiveorder.intReceiveorderNo join tblPurchaseOrder on tblreceiveorder.intPurchaseOrderNo = tblPurchaseOrder.intPurchaseOrderNo join tblSupplier on tblPurchaseOrder.intSupplierID = tblSupplier.intUserID`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      db.query(`Select * from tblReturnProducts join tblSupplier on tblReturnProducts.intSupplierID = tblSupplier.intUserID`,(err2,res2,fie2)=>{
        if(err2) console.log(err2);
        else{
          res.render('admin-returnProducts/views/allReturns', {bad: res1, moment: moment, returns: res2});

        }
      })

    }
  })
});

router.get('/form',(req,res)=>{
  var num = "1000"
  // Select * suppliers
  db.query(`Select * from tblUser join tblSupplier on tblUser.intUserID = tblSupplier.intUserID where intSupplierType = 1 and intUserTypeNo = 2`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    // Select last return prod record
    db.query(`Select * from tblReturnProducts order by intReturnProductsNo desc limit 1`,(err2,res2,fie2)=>{
      if(err2) console.log(err2);
      else{
        if(res2==null||res2==undefined){} else if(res2.length==0){}
        else{
          num = parseInt(res2[0].intReturnProductsNo) + 1;
        }

        res.render('admin-returnProducts/views/returnProductsForm', {suppliers: res1, lastRecord: num, moment: moment});


      }
    })
  })
});

router.get('/findProducts/:pid',(req,res)=>{
  db.query(`Select * from tblProductInventory join tblUom on tblProductInventory.intUomNo = tblUom.intUomNo join tblProductList on tblProductInventory.intProductNo = tblProductList.intProductNo where tblProductInventory.intUserID = ${req.params.pid}`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      res.render('admin-returnProducts/views/productLoader',{products: res1});
    }
  })
});

router.post('/submitForm',(req,res)=>{
  var rp_no = "1000", rplist_no = "1000", count = 0;
  var loop = req.body.ino;

  db.beginTransaction(function(err1){
    if(err1) console.log(err1);
    else{
      db.query(`Select * from tblReturnProducts order by intReturnProductsNo desc limit 1`,(err2,res2,fie2)=>{
        if(err2) console.log(err2);
        else{
          if(res2==null||res2==undefined){} else if(res2.length==0){}
          else{ rp_no = parseInt(res2[0].intReturnProductsNo) + 1;}

          db.query(`Select * from tblReturnProductList order by intReturnProductListNo desc limit 1`,(err3,res3,fie3)=>{
            if(err3) console.log(err3);
            else{
              if(res3==null||res3==undefined){} else if(res3.length==0){}
              else{ rplist_no = parseInt(res3[0].intReturnProductListNo) + 1;}

              db.query(`Insert into tblReturnProducts (intReturnProductsNo, intSupplierID, intAdminID, strEmail, strSpecialNotes, intStatus)
              values ("${rp_no}","${req.body.supplier}","1000","${req.body.email}", "${req.body.specialnote}", 0)`,(err4,res4,fie4)=>{
                if(err4) console.log(err4);
                else{
                  async.eachSeries(loop, function(data, callback){
                    db.query(`Insert into tblReturnProductList(intReturnProductListNo, intReturnProductsNo, intInventoryNo, intQuantity, strReturnReason)
                    values("${rplist_no}", "${rp_no}","${req.body.ino[count]}", ${req.body.quantity[count]}, "${req.body.reason[count]}")`,(err5,res5,fie5)=>{
                      if(err5) console.log(err5);
                      else{
                        count++; rplist_no++;
                        callback();

                      }
                    })
                  }, function(err,results){
                      if(err) console.log(err);
                      else{
                        db.commit(function(e){
                          if(e) console.log(e);
                          else{
                            res.send("yes");
                          }
                        })
                      }
                  });
                }
              })


            }
          })
        }
      })
    }
  })


})

exports.returnProducts = router;
