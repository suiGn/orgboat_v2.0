/************************************
APP: OrgBoat                        *
____ ____ ____ ___  ____ ____ ___   *
|  | |__/ | __ |__] |  | |__|  |    *
|__| |  \ |__] |__] |__| |  |  |    *                                                                                                                                                                                                                                                                                                 
Coded by Sui Gn			            *
Copyrights Neurons Art & Technology *
*************************************/
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
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
var sessionName = "SESSION_ID";
var secretKey = "MYSECRETKEYDSAFGEWHWEfenig23974ovuwyfbhkjfvvfuo";
var sessionMiddleware = session({
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  name: sessionName,
  store: sessionStore,
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
});

const server = express()
  .use(express.static(path.join(__dirname, "public")))
  .use(cookieParser())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(sessionMiddleware)
  .use(passport.initialize())
  .use(passport.session())
  .use(flash()) // use connect-flash for flash messages stored in session
  .set("views", path.join(__dirname, "views"))
  // passport.authenticate middleware is used here to authenticate the request
  .set("view engine", "ejs")
  // The middleware receives the data from Google and runs the function on Strategy config
  .get("/", routes.home)
  // process the login form
  .post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/workspace", // redirect to the secure profile section
      failureRedirect: "/badLogin", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    }),
    function (req, res) {
      res.redirect("/workspace");
    }
  )
  .get("/badLogin", routes.badLogin)
  .get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  })
  .get("/testing", (req, res) =>
    res.render("pages/index", {
      opt1: "Sign Up",
      opt2: "/subscribe",
      opt3: " ",
    })
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
  .get("/workspace", isLoggedIn, routes.workspace)
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
const { router } = require("websocket");
const { error } = require("console");
exports.io = io;
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

io.on("connection", function (socket) {
  var user = socket.request.session.passport.user;
  if (user != null || user != undefined) {
    socket.join(user.u_id);
    console.log(
      `[Socket.io] - Connected user: ${user.usrname}, u_id: ${user.u_id}`
    );
  } else {
    var guest = uuid.v4();
    socket.join(guest);
    exports.guest = guest;
  }
  //Transmit the messages from one user to another
  socket.on("get chats", function (msg) {
    console.log(`[Socket.io] - User ${user.usrname} asked for chats`);
    //console.log(user.pphoto);
    connection.query(
      `
			select chats.chat_uid, chats.chat_name, chats.chat_type, chats2.u_id as user_chat ,usrs.name,usrs.pphoto, 
				m.u_id as last_message_user_uid, m.message as last_message_message, m.time as last_message_time,chats_users.archiveChat
			
			from chats_users  

			inner join chats_users chats2 on chats2.chat_uid = chats_users.chat_uid
			inner join usrs on usrs.u_id = chats2.u_id

			inner join chats on chats_users.chat_uid = chats.chat_uid 
			left join messages m on m.chat_uid = chats.chat_uid 
				and m.message_id = 
					(
						SELECT MAX(message_id) 
						FROM messages z 
						WHERE z.chat_uid = m.chat_uid
					)
			where chats_users.u_id = '${user.u_id}'
			order by time desc;
			`,
      function (err, rows) {
        //console.log(rows);
        io.to(user.u_id).emit("retrieve chats", {
          my_uid: user.u_id,
          chats: rows,
        });
      }
    );
  });
  socket.on("get chats archived", function (msg) {
    console.log(`[Socket.io] - User ${user.usrname} asked for chats`);
    //console.log(user.pphoto);
    connection.query(
      `
			select chats.chat_uid, chats.chat_name, chats.chat_type, chats2.u_id as user_chat ,usrs.name,usrs.pphoto, 
				m.u_id as last_message_user_uid, m.message as last_message_message, m.time as last_message_time,chats_users.archiveChat
			
			from chats_users  

			inner join chats_users chats2 on chats2.chat_uid = chats_users.chat_uid
			inner join usrs on usrs.u_id = chats2.u_id

			inner join chats on chats_users.chat_uid = chats.chat_uid 
			left join messages m on m.chat_uid = chats.chat_uid 
				and m.message_id = 
					(
						SELECT MAX(message_id) 
						FROM messages z 
						WHERE z.chat_uid = m.chat_uid
					)
			where chats_users.u_id = '${user.u_id}'
			order by time desc;
			`,
      function (err, rows) {
        //console.log(rows);
        io.to(user.u_id).emit("retrieve chats archived", {
          my_uid: user.u_id,
          chats: rows,
        });
      }
    );
  });

  //Transmit the messages from one user to another
  socket.on("chat message", function (msg) {
    chat = msg.chat;
    message = msg.message;
    from = user.u_id;
    time = new Date();
    connection.query(
      `
			select * from chats_users 
			inner join chats on chats.chat_uid = chats_users.chat_uid
			where chats_users.chat_uid = '${chat}'
		`,
      function (err, chats) {
        chats.forEach((qchat) => {
          if (from != qchat.u_id) {
            io.to(qchat.u_id).emit("chat message", {
              chat: chat,
              type: qchat.chat_type,
              from: from,
              from_name: user.name,
              message: message,
              time: time,
            });
          }
        });
      }
    );
    timeDB = formatLocalDate().slice(0, 19).replace("T", " ");
    connection.query(`insert into messages(chat_uid, u_id, message,time) 
                            values ('${chat}','${from}','${message}','${timeDB}')`);
  });

  //Client request the messages
  socket.on("get messages", function (msg) {
    console.log(
      `[Socket.io] - ${user.usrname} request the messages from chat: ${msg.id}, page:${msg.page}`
    );
    //initMsg
    connection.query(
      `
			select messages.u_id as message_user_uid, messages.message, messages.time, usrs.name, chats.chat_type , usrs.pphoto 
			from messages inner join usrs on messages.u_id = usrs.u_id
			inner join chats on chats.chat_uid = messages.chat_uid
			where  messages.chat_uid = '${msg.id}' order by time desc limit 10;
		 `,
      function (err, rows) {
        io.to(user.u_id).emit("retrieve messages", {
          messages: rows,
          message_user_uid: user.message_user_uid,
        });
      }
    );
  });

  socket.on("subscribingData", function (data) {
    method.subscribingData(data);
  });

  socket.on("ViewProfile", function (data) {
    connection.query(
      "select usrname, pphoto,name,about,phone,city,website from usrs where u_id=(select u_id from chats_users where chat_uid = '" +
        data.id +
        "' and u_id!='" +
        user.u_id +
        "');",
      function (err, rows) {
        //console.log(rows);
        io.to(user.u_id).emit("retrieve viewprofile", {
          usrprofile: rows,
        });
      }
    );
  });
  socket.on("ViewOwnProfile", function (data) {
    connection.query(
      `select usrname, pphoto,name,about,phone,city,website from usrs where u_id='${data.id}'`,
      function (err, rows) {
        //console.log(rows);
        io.to(user.u_id).emit("retrieve viewownprofile", {
          usrprofile: rows,
        });
      }
    );
  });
  socket.on("archived chat", function (chat) {
    connection.query(
      `UPDATE chats_users SET archiveChat=1 WHERE chat_uid ='${chat.chat}' and u_id='${user.u_id}'`,
      function (err, rows) {
        io.to(user.u_id).emit("archived response");
      }
    );
  });
  socket.on("Unarchive chat", function (chat) {
    connection.query(
      `UPDATE chats_users SET archiveChat=0 WHERE chat_uid ='${chat.chat}' and u_id='${user.u_id}'`,
      function (err, rows) {
        io.to(user.u_id).emit("Unarchive response");
      }
    );
  });
});

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

//      _ ___   _  _  __
//  |V||_  ||_|/ \| \(_
//  | ||__ || |\_/|_/__)

// route middleware to make sure
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    if (req.user[0].verified === 0) {
      //console.log(req.user[0]);
      res.render("pages/sec/verify-email", { usr: req.user[0] });
      return;
    } else {
      //console.log(req.user[0].verified);
      return next();
    }
  }
  // if they aren't redirect them to the home page
  res.redirect("/");
}

function formatLocalDate() {
  var now = new Date(),
    tzo = -now.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      var norm = Math.abs(Math.floor(num));
      return (norm < 10 ? "0" : "") + norm;
    };
  return (
    now.getFullYear() +
    "-" +
    pad(now.getMonth() + 1) +
    "-" +
    pad(now.getDate()) +
    "T" +
    pad(now.getHours()) +
    ":" +
    pad(now.getMinutes()) +
    ":" +
    pad(now.getSeconds()) +
    dif +
    pad(tzo / 60) +
    ":" +
    pad(tzo % 60)
  );
}

function onAuthorizeSuccess(data, accept) {
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  console.log("[Socket.io] - User not Authenticated ", message);
  // We use this callback to log all of our failed connections.
  accept(null, true);
}
