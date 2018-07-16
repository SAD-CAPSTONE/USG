var router = require('express').Router();

router.get('/', (req,res)=>{
  res.render('admin-dashboard/views/dashboard', {name: "name"});
})

router.get('/load',(req,res)=>{
  res.render('admin-dashboard/views/loading', {name: "name"});
})

exports.dashboard = router;
