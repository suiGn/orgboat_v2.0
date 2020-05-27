// config/passport.js

// ==================================================================================================
// LOCAL STRATEGY ===================================================================================
// ==================================================================================================
// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
// load up the user model
const index = require('./index');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);
//connection.connect();
index.orgboatDB.query('USE ' + dbconfig.database);
//connection.end();
// expose this function to our app using module.exports


// ==================================================================================================
// Google STRATEGY ===================================================================================
// ==================================================================================================
// Strategy config
const GoogleStrategy = require('passport-google-oauth20');



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
        console.log(user);

        if (user.type == 'local') {
            id = user.id
            index.orgboatDB.query("SELECT * FROM users WHERE id = ? ", [id], function (err, rows) {
                done(err, rows[0]);
            });
        } else {
            done(null, user);
        }
    });

    // =========================================================================
    // Google SIGNUP ============================================================
    // =========================================================================
    // Strategy config
    passport.use(new GoogleStrategy({
        clientID: '88301559636-9lcb3e4h77t5etmruuqfnlsamo1r9822.apps.googleusercontent.com',
        clientSecret: 'qYayWv7JPQP3Hgiie-SZbYwz',
        callbackURL: 'http://localhost:8000/auth/google/callback'
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
                index.orgboatDB.query("SELECT * FROM users WHERE username = ?", [username], function (err, rows) {
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

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
            function (req, username, password, done) { // callback with email and password from our form
                //connection.connect();
                connection.query("SELECT * FROM users WHERE username = ?", [username], function (err, rows) {
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                    }

                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                    // all is well, return successful user
                    return done(null, rows[0]);
                });
                //connection.end();
            })
    );
};
