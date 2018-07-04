var router = require('express').Router();

router.get('/', (req,res)=>{
  res.render('admin-dashboard/views/dashboard', {name: "name"});
})

exports.dashboard = router;
