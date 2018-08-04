var router = require('express').Router();
var db = require('../../lib/database')();
var moment = require('moment');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const generatePassword = require('password-generator');
var mailAccountUse = "imjanellealag@gmail.com"

function me(){
  console.log(generatePassword(7, false));
}

function run(){
    const user_name     = 'imjanellealag@gmail.com';

    const email_to = 'imjanellealag@gmail.com';



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
       subject : 'Hello ✔', // Subject line
       text    : 'Hello world ?', // plaintext body
       html    : '<b>Hello world ?</b>', // html body


   };

   // send mail with defined transport object
   transporter.sendMail(mailOptions, function (error, info) {
       if (error) {
           return console.log(error);
       }
       console.log('Message sent: ' + info.response);
   });

}

router.get('/try',(req,res)=>{
  run();
});

router.get('/',(req,res)=>{
  res.render('admin-POS/views/quickOrder');
});

exports.sales = router;
