var router = require('express').Router();

router.get('/', (req,res)=>{
  res.render('admin-queries/views/queries');
});

router.get('/allProducts',(req,res)=>{
  db.query(`Select * from tblProductList`,(err1,res1,fie1)=>{
    if(err1) console.log(err1);
    else{
      res.render('admin-queries/views/allProducts',{productss: res1})
    }
  })
})

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.queries = router;
