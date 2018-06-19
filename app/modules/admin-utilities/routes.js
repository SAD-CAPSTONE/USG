var router = require('express').Router();
var db = require('../../lib/database')();


router.get('/businessInfo', (req,res)=>{
  db.query(`Select * from tblAdmin where intUserID = 1000`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    res.render('admin-utilities/views/businessInfo', {re: results1});

  });
});

router.post('/updateBusinessInfo',(req,res)=>{
  db.query(`Update tblAdmin set strbusinessName = "${req.body.name}", strbusinessAddress = "${req.body.address}", strbusinessEmail = "${req.body.email}", strbusinessphone = "${req.body.phone}", strbusinessMobile = "${req.body.mobile}" where intUserID = 1000`, (err1,results1,fields1)=>{
    if (err1) console.log(err1);
    if (!err1) res.send("yes");
  });
});

// <%- include('../../../templates/admin-navbar.ejs') -%>

exports.utilities = router;
