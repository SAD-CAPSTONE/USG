const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const db = require('../app/lib/database')();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const firstID = 1000; // First User ID in Database

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
      db.query(`SELECT * FROM tbluser WHERE strUsername= ?`,[username], (err, results, fields) => {
        if (err) console.log(err);
        if (results[0]){
          bcrypt.compare(password, results[0].strPassword, function(err, res) {
            if (res)
              return done(null, results[0]);
            else
              return done(null, false, { message: 'Incorrect username or password.' });
          });
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
    db.beginTransaction(function(err) {
      if (err) console.log(err);
      db.query(`SELECT * FROM tbluser WHERE intFacebook= ?`, [profile.id], function(err, results, fields) {
        if (err) console.log(err);
        if (!results[0]) {
          db.query(`SELECT * FROM tbluser ORDER BY intUserID DESC LIMIT 1`, function(err, results, fields) {
            if (err) console.log(err);
            let newID = results[0] ? parseInt(results[0].intUserID)+1 : firstID;
            db.query(`INSERT INTO tbluser (intUserID, intUserTypeNo, strFname, strLname, strEmail, intFacebook) VALUES (?,3,?,?,?,?)`,
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
            let newID = results[0] ? parseInt(results[0].intUserID)+1 : firstID;
            db.query(`INSERT INTO tbluser (intUserID, intUserTypeNo, strFname, strLname, strEmail, intGoogle) VALUES (?,3,?,?,?,?)`,
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
