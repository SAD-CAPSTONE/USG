var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
const generatePassword = require('password-generator');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
var mailAccountUse = "imjanellealag@gmail.com";
const user_name     = 'imjanellealag@gmail.com';
const email_to = 'imjanellealag@gmail.com';


router.post('/createAccount',(req,res)=>{
  var password = generatePassword(7, false);



  let transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
   auth: {
       type: 'OAuth2',
       user: user_name,
       clientId: '992501111737-qhi235s1dma1cksa1n2r14m9uul6b33j.apps.googleusercontent.com',
       clientSecret: '0DgRehIAZWKBg3rIjuTbaW0h',
       refreshToken: '1/gRa-PZ-HiOcUHF1T7O2gfkwA7-rWIMXnm2nlSWKDqJw',
       accessToken: 'ya29.Glv9BZ29u-p2vcTTV2BTXpT1R6COUG39LUdfql8SE3PwoH-yGcUuRkVNh_KS6hDeCy1W6d1PEUKqLy7YjHJSfnB6LYp_NNrFFQiqCQqA7E83u4lti-GoBh5lPibY'
   }
});


  let mailOptions = {
      from    : user_name, // sender address
      to      : email_to, // list of receivers
      subject : 'USG Consignor Account', // Subject line
      text    : `Username: ${req.body.name}    Password: ${password}`, // plaintext body
      html    : '<b>Just sign-in </b>', // html body

  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
      res.send({username: req.body.name, password: password});
  });

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
  console.log(req.body.number)
  db.query(`Update tblbusinesstype set intStatus = 2 where intBusinessTypeNo = "${req.body.number}"`,(err,results,fields)=>{
    if(err) console.log(err);
    else{

      res.send("yes");
    }
  });
});

exports.maintenance2 = router;
