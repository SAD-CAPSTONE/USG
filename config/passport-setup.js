var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var keys = require('./keys');
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
  new LocalStrategy(
    function(username, password, done) {
      db.query(`SELECT * FROM tbluser WHERE strUsername= ? AND strPassword= ?`,[username, password], (err, results, fields) => {
        if (err) console.log(err);
        if (results[0]){
          return done(null, results[0]);
        }
        else
          return done(null, false, { message: 'Incorrect username or password.' });
      });
    }
  )
);

passport.use(
  new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: '/login/facebook/redirect',
    profileFields: ['email','id', 'first_name', 'gender', 'last_name']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('????????????????????????????? PROFILE');
    console.log(profile);

    db.beginTransaction(function(err) {
      if (err) console.log(err);
      db.query(`SELECT * FROM tbluser WHERE intFacebook= ?`, [profile.id], function(err, results, fields) {
        if (err) console.log(err);
        if (!results[0]) {
          db.query(`SELECT * FROM tbluser ORDER BY intUserID DESC LIMIT 1`, function(err, results, fields) {
            if (err) console.log(err);
            var newID = parseInt(results[0].intUserID)+1;
            db.query(`INSERT INTO tbluser (intUserID, intUserTypeNo, strFname, strLname, strEmail, intFacebook) VALUES (?,2,?,?,?,?)`,
            [newID, profile.name.givenName, profile.name.familyName, profile.emails[0].value, profile.id], (err, results, fields) => {
              if (err) console.log(err);
              console.log('>>>>>>> RECORD ADDED');
              db.query(`SELECT * FROM tbluser WHERE intFacebook= ?`, [profile.id], function(err, results, fields) {
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

  }
));

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
            [newID, profile.name.givenName, profile.name.familyName, profile.emails[0].value, profile.id], (err, results, fields) => {
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
