// config/passport.js

// ==================================================================================================
// LOCAL STRATEGY ===================================================================================
// ==================================================================================================
// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
// load up the user model
//var mysql = require('mysql');
var bcrypt = require('bcryptjs');
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
const GoogleStrategy = require('passport-google-oauth20');
const index = require('./../index');
module.exports = function (passport) {

    // =========================================================================
    // == passport session setup ===============================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
	
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
    // =========================================================================
    // == Google SIGNUP ========================================================
    // =========================================================================
    // Strategy config
    passport.use(new GoogleStrategy({
        clientID: '88301559636-9lcb3e4h77t5etmruuqfnlsamo1r9822.apps.googleusercontent.com',
        clientSecret: 'qYayWv7JPQP3Hgiie-SZbYwz',
        callbackURL: 'http://localhost:5000/auth/google/callback'
    },
        (accessToken, refreshToken, profile, done) => {
            done(null, profile); // passes the profile data to serializeUser
        }
    ));
   
    // =========================================================================
    // == LOCAL LOGIN ==========================================================
    // =========================================================================

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'usrname',
            passwordField: 'pwd',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
            function (req, usrname, password, done) { // callback with email and password from our form
                index.orgboatDB.query('SELECT * FROM Usrs WHERE Usrname = $1 OR email = $1', [usrname], (err, resp) => {
                    if (resp.rowCount == 0) {
                        res.render('pages/index', { opt1: "Sign Up", opt2: "/subscribe", opt3: "No account found." });
						//return done(err);
                    } else {
                        // selects return an array, so access the first in the array
                        var usr = resp.rows[0];
                        var hash = usr.password;
                        // now lets compare the passwords                        
                        bcrypt.compare(password, hash, function (err, isMatch) {
                            if (err) {
                                return done(err);
                            } else if (!isMatch) {
                                return done(err);
                            } else {
                                console.log(true)
                                return done(null, usr);
                            }
                        })
                    }
                })

            })
    );
};
