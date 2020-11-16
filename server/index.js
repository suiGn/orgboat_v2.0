/************************************
APP: OrgBoat                        *
____ ____ ____ ___  ____ ____ ___   *
|  | |__/ | __ |__] |  | |__|  |    *
|__| |  \ |__] |__] |__| |  |  |    *                                                                                                                                                                                                                                                                                                 
Coded by Sui Gn			            *
Copyrights Neurons Art & Technology *
*************************************/
const express = require("express");
const cookieSession = require("cookie-session");
const path = require("path");
const PORT = process.env.PORT || 5000;
//const FRONT_END = process.env.URL_FRONT || "http://localhost:5000";
require("dotenv").config();
const jwt = require("jsonwebtoken");
const config = require("./configs/config");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const routes = require("./routes");
const method = require("./methods");
const mailer = require("./mailer");
var unicorn = "🍺🦄🍺";
var uuid = require("node-uuid");
var nodemailer = require("nodemailer");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var cors = require('cors');
const buildPath = path.join(__dirname, '..', 'build');
const {
  isLoggedIn,
  sessionMiddleware,
  onAuthorizeFail,
  onAuthorizeSuccess,
} = require("./middlewares/authentication");
//const cookieSession = require('cookie-session');
var flash = require("connect-flash");
require("./configs/passport")(passport); //pass passport for configuration
var Sequelize = require("sequelize");
var session = require("express-session");
var mysql = require("mysql");
var MySQLStore = require("express-mysql-session")(session);
let options = {
  host: "y0nkiij6humroewt.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  port: "3306",
  user: "zwe4df04sf0pb5h8",
  password: "wel73mofval4ua95",
  database: "v0mgbm8nfthxqwz1",
};
var connection = mysql.createConnection(options); // or mysql.createPool(options);
var orgboatDB = connection;
exports.orgboatDB = connection;
var sessionStore = new MySQLStore({} /* session store options */, connection);
exports.sessionStore = sessionStore;

const server = express()
  .use(cors())
  .use(express.static(path.join(__dirname, "public")))
  .use(cookieParser())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(sessionMiddleware)
  .use(passport.initialize())
  .use(passport.session())
  .use(flash()) // use connect-flash for flash messages stored in session
  .use(express.static(buildPath))
  
  //.set("views", path.join(__dirname, "views"))
  // passport.authenticate middleware is used here to authenticate the request
  //.set("view engine", "ejs")
  // The middleware receives the data from Google and runs the function on Strategy config
  // process the login form
  .get("/logged",routes.home)
  .get("/logout", (req, res) => {
    console.log('LogOut');
    req.logout();
    res.json({
      ok:true
    })
    //res.redirect("/");
  })
  .get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
  })
  .post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/workspace", // redirect to the secure profile section
      failureRedirect: "/badLogin", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    }),
    function (req, res) {
      console.log("Inicio Session");
      res.redirect(`/workspace`);
    }
  )
  .get("/subscribe", routes.subscribe)
  .get("/verMail", routes.verMail)
  .get("/resnd", routes.rsnvMail)
  .post("/subscribing", routes.subscribing)
  .get("/reset-pwd", routes.resetPass) // Reset Password request
  .post("/rstpwd", mailer.rpwdm) //Send Reset Pwd Password
  .get("/pwdRst", routes.pwdRst) //Change Password
  .post("/resetPwd", routes.changePass) // Post Change Password
  //Passport
  .get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"], // Used to specify the required data
    })
  )
  .get(
    "/auth/google/callback",
    passport.authenticate("google"),
    routes.authGoogle
  )
  .get("/lock-screen", routes.lockScreen)
  .post("/edProf", isLoggedIn, routes.editProfile)
  .post("/uploadpPhoto", function (req, res) {
    //console.log(req.user[0].u_id);
    var storage = multer.diskStorage({
      //Fun
      destination: (req, file, cb) => {
        cb(null, "./uploads");
      },
      filename: (req, file, cb) => {
        //console.log(file);
        var filetype = "";
        if (file.mimetype === "image/gif") {
          filetype = "gif";
        }
        if (file.mimetype === "image/png") {
          filetype = "png";
        }
        if (file.mimetype === "image/jpeg") {
          filetype = "jpg";
        }
        cb(
          null,
          "avatar-" + req.user[0].u_id + "-" + Date.now() + "." + filetype
        );
      },
    });
    var upload = multer({ storage: storage }).single("avatarEditP");
    upload(req, res, function (err) {
      //console.log(req);
      if (err) {
        //console.log(err);
        res.redirect("/workspace");
      }
      //console.log(req.file.path);
      routes.savedbimage(req);
      res.redirect("/workspace");
    });
  })
  .get("/pphoto", (req, res) => {
    //console.log(req);
    res.sendFile(path.join(__dirname, req.user[0].pphoto));
  })
  .get("/pphotoChat/:name", (req, res) => {
    (async () => {
      console.log(req.params.name);
      const result = await routes.pphotourl(req.params.name);
      res.sendFile(path.join(__dirname, result));
    })();
  });

/** 			   o       o                                
           |       |                               
           o   o   o  
          \ / \ / 
           o   o  ebsocket IO
      __ _    __ 
     (_ / \	|_ 
     __)\_/	|__
  **/

var http = require("http").Server(server);
var io = require("socket.io")(http);
var passportSocketIo = require("passport.socketio");
const { json } = require("sequelize");
require('./configs/config')
//Move Socket in file socket.js
io.set("origins", "*:*");
//With Socket.io >= 1.0
io.use(
  passportSocketIo.authorize({
    cookieParser: cookieParser, // the same middleware you registrer in express
    key: sessionName, // the name of the cookie where express/connect stores its session_id
    secret: secretKey, // the session_secret to parse the cookie
    store: sessionStore, // we NEED to use a sessionstore. no memorystore please
    success: onAuthorizeSuccess, // *optional* callback on success - read more below
    fail: onAuthorizeFail, // *optional* callback on fail/error - read more below
  })
);

io.use(function (socket, next) {
  // Wrap the express middleware
  sessionMiddleware(socket.request, {}, next);
});
module.exports.io = io;
require("./sockets/socket");

// launch ======================================================================
http.listen(PORT, function () {
  console.log(
    ` 
 ██████  ██████   ██████  ██████   ██████   █████  ████████ 
██    ██ ██   ██ ██       ██   ██ ██    ██ ██   ██    ██    
██    ██ ██████  ██   ███ ██████  ██    ██ ███████    ██    
██    ██ ██   ██ ██    ██ ██   ██ ██    ██ ██   ██    ██    
 ██████  ██   ██  ██████  ██████   ██████  ██   ██    ██   
				Listening on port: ${PORT}`
  );
});
