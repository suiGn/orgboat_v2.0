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
// Google STRATEGY ===================================================================================
// ==================================================================================================
// Strategy config
const GoogleStrategy = require('passport-google-oauth20');
const index = require('./../index');
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
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
    // Google SIGNUP ============================================================
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
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
/*
    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
            function (req, username, password, done) {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                //connection.connect();
                connection.query("SELECT * FROM users WHERE username = ?", [username], function (err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = {
                            type: '0',
                            username: username,
                            password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                        };

                        var insertQuery = "INSERT INTO users ( type, username, password ) values ('0',?,?)";
                        //connection.connect();
                        connection.query(insertQuery, [newUserMysql.username, newUserMysql.password], function (err, rows) {
                            newUserMysql.id = rows.insertId;

                            return done(null, newUserMysql);
                        });
                        //connection.end();
                    }
                });
                //connection.end();
            })
    );
*/
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

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
                    if (err) {
                        res.render('pages/index', { opt1: "Sign Up", opt2: "/subscribe", opt3: "No account found." });
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
