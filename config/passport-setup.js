const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
var db = require('../app/lib/database')();

passport.serializeUser((user, done) => {
  done(null, user.intUserID);
});

passport.deserializeUser((id, done) => {
  db.query(`SELECT * FROM tbluser WHERE intUserID= ?`, [id], function(err, results, fields) {
    if (err) console.log(err);
    done(null, results[0]);
  });
});

passport.use(
  new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/login/google/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    db.beginTransaction(function(err) {
      if (err) console.log(err);
      db.query(`SELECT * FROM tbluser WHERE intGoogle= ?`, [profile.id], function(err, results, fields) {
        if (err) console.log(err);
        if (!results[0]) {
          db.query(`SELECT * FROM tbluser ORDER BY intUserID DESC LIMIT 1`, function(err, results, fields) {
            if (err) console.log(err);
            var newID = parseInt(results[0].intUserID)+1;
            db.query(`INSERT INTO tbluser (intUserID, intUserTypeNo, strFname, strLname, strEmail, intGoogle) VALUES (?,2,?,?,?,?)`,
            [newID,profile.name.givenName, profile.name.familyName, profile.emails[0].value, profile.id], (err, results, fields) => {
              if (err) console.log(err);
              console.log('>>>>>>> RECORD ADDED');
              db.query(`SELECT * FROM tbluser WHERE intGoogle= ?`, [profile.id], function(err, results, fields) {
                if (err) console.log(err);
                db.commit(function(err) {
                  if (err) console.log(err);
                  done(null, results[0]);
                });
              });
            });
          });
        }
        else {
          db.commit(function(err) {
            if (err) console.log(err);
            console.log('>>>>>>> USER EXISTS');
            done(null, results[0]);
          });
        }
      });
    });
  })
);
