var router = require('express').Router();

router.get('/', (req,res)=>{
  res.render('admin-dashboard/views/dashboard');
})

exports.dashboard = router;
