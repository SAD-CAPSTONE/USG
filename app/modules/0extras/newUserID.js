// generate new user ID based on previous user ID
var db = require('../../lib/database')();

module.exports= (req,res,next) => {
  db.query(`SELECT * FROM tbluser ORDER BY intUserID DESC LIMIT 1`, (err, results, fields) => {
    if (err) console.log(err);
    req.newUserID = parseInt(results[0].intUserID)+1;
    return next();
  });
};
