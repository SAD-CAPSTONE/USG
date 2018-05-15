// generate new user ID based on previous user ID
var db = require('../../lib/database')();
var firstID = 1000; // First User ID in Database

module.exports= (req,res,next) => {
  db.query(`SELECT * FROM tbluser ORDER BY intUserID DESC LIMIT 1`, (err, results, fields) => {
    if (err) console.log(err);
    req.newUserID = results[0] ? parseInt(results[0].intUserID)+1 : firstID;
    return next();
  });
};
