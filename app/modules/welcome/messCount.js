module.exports= (req,res,next)=>{
  var db = require('../../lib/database')();
  /*COunt of Unseen Messages, Match(session)
  *(tblmessage)*(tblchat)*(tblservice)*/
  db.query("SELECT COUNT(intMessID) AS count FROM tblmessage INNER JOIN tblchat ON intChatID= intMessChatID INNER JOIN tblservice ON intChatServ= intServID WHERE (intChatSeeker= ? AND intSender= 1 AND intMessSSeen= 0) OR (intServAccNo= ? AND intSender= 2 AND intMessPSeen= 0)",[req.session.user, req.session.user], function (err, results, fields) {
      if (err) return res.send(err);
      req.messCount = results;
      return next();
  });
}
