// config/passport.js
// ==================================================================================================
// LOCAL STRATEGY ===================================================================================
// ==================================================================================================
// load all the things we need
var LocalStrategy = require("passport-local").Strategy;
// load up the user model
//var mysql = require('mysql');
var bcrypt = require("bcryptjs");
const uuid = require("node-uuid");
////var dbconfig = require('./database');
//var connection = mysql.createConnection(dbconfig.connection);
//connection.connect();
//connection.query('USE ' + dbconfig.database);
//connection.end();
// expose this function to our app using module.exports
// ==================================================================================================
// == Google STRATEGY ===============================================================================
// ==================================================================================================
// Strategy config
const GoogleStrategy = require("passport-google-oauth20");
const index = require("./../index");
module.exports = function (passport) {
  // =========================================================================
  // == passport session setup ===============================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session
  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    if (user.provider == "google") {
      index.orgboatDB.query(
        "SELECT * FROM usrs WHERE email = ?",
        [user.emails[0].value],
        (err, resp) => {
          if (resp.length == 0) {
            var name = user.displayName;
            var usrname = user.emails[0].value;
            var email = usrname;
            var profile_pic = user.photos[0].value;
            var u_type = 1;
            var dt = new Date();
            var uuid_numbr = uuid.v4();

            index.orgboatDB.query(
              "INSERT INTO usrs (name, usrname, email, verified, last_update, u_id, created, u_type, pphoto) VALUES (?, ?, ?, ?, ?, ?, ?, ? ,?)",
              [
                name,
                usrname,
                email,
                1,
                dt,
                uuid_numbr,
                dt,
                u_type,
                profile_pic,
              ],
              (error, results) => {
                if (error) {
                  throw error;
                }
                index.orgboatDB.query(
                  `SELECT * FROM usrs WHERE usrname = '${usrname}'  OR email = '${usrname}'`,
                  (err, resp) => {
                    done(null, resp[0]);
                  }
                );
              }
            );
          } else {
            done(null, resp[0]);
          }
        }
      );
    } else {
      done(null, user);
    }
  });

  // used to deserialize the user
  passport.deserializeUser(function (user, done) {
    index.orgboatDB.query(
      "SELECT * FROM usrs WHERE email = ?",
      [user.email],
      (err, resp) => {
        //console.log(resp)
        done(null, resp);
      }
    );
  });

  // =========================================================================
  // == Google SIGNUP ========================================================
  // =========================================================================
  // Strategy config
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "1054555069073-3tb02eakofr767al4p8er2na71iu50g4.apps.googleusercontent.com",
        clientSecret: "NRVI5oFf2eRxOxJ6x-oehRsX",
        callbackURL: "https://orgboat.herokuapp.com/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, profile); // passes the profile data to serializeUser
      }
    )
  );
  // =========================================================================
  // == LOCAL LOGIN ==========================================================
  // =========================================================================
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "usrname",
        passwordField: "pwd",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      function (req, usrname, password, done) {
        // callback with email and password from our form
        index.orgboatDB.query(
          `SELECT * FROM usrs WHERE (usrname = '${usrname}' OR email = '${usrname}') AND verified = 1`,
          (err, resp) => {
            if (resp.length == 0) {
              return done(err);
            } else {
              // selects return an array, so access the first in the array
              var usr = resp[0];
              var hash = usr.password;
              // now lets compare the passwords
              bcrypt.compare(password, hash, function (err, isMatch) {
                if (err) {
                  return done(err);
                } else if (!isMatch) {
                  return done(err);
                } else {
                  //console.log(true)
                  return done(null, usr);
                }
              });
            }
          }
        );
      }
    )
  );
};
