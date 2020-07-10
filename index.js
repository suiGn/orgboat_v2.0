/** SERVER APP: OrgBoat **
 ██████  ██████   ██████  ██████   ██████   █████  ████████ 
██    ██ ██   ██ ██       ██   ██ ██    ██ ██   ██    ██    
██    ██ ██████  ██   ███ ██████  ██    ██ ███████    ██    
██    ██ ██   ██ ██    ██ ██   ██ ██    ██ ██   ██    ██    
 ██████  ██   ██  ██████  ██████   ██████  ██   ██    ██    
                                                                                                                                                                                                         
*** CODED BY sui Gn Good
workspace
****/
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const jwt = require('jsonwebtoken')
const config = require('./configs/config')
const { body, validationResult } = require("express-validator")
const { sanitizeBody } = require("express-validator")
const bodyParser = require("body-parser")
const multer = require('multer')
const routes = require('./routes')
const method = require('./methods')
const mailer = require('./mailer')
var unicorn = "🍺🦄🍺"
var uuid = require('node-uuid')
var nodemailer = require('nodemailer')
var cookieParser = require('cookie-parser');
var passport = require('passport');
//const cookieSession = require('cookie-session');
var flash = require('connect-flash');
require('./configs/passport')(passport);//pass passport for configuration
var Sequelize = require('sequelize');
var session = require('express-session');
var mysql = require('mysql');

var MySQLStore = require('express-mysql-session')(session);

let options = {
	host: 'kuantum.tech',
	port: '3306',
	user: 'remote',
	password: 'r3m0t3',
	database: 'cleaker'
};

var connection = mysql.createConnection(options); // or mysql.createPool(options);
var sessionStore = new MySQLStore({}/* session store options */, connection);

var sessionName = 'SESSION_ID';
var secretKey = 'MYSECRETKEYDSAFGEWHWEfenig23974ovuwyfbhkjfvvfuo'

var sessionMiddleware = session({
	cookie: { maxAge: 24 * 60 * 60 * 1000 },
	name: sessionName,
	store: sessionStore,
	secret: secretKey,
	resave: false,
	saveUninitialized: true
});



exports.orgboatDB = connection;


const server = express()
	.use(express.static(path.join(__dirname, 'public')))
	.use(cookieParser())
	.use(bodyParser.urlencoded({ extended: false }))
	.use(bodyParser.json())
	.use(sessionMiddleware)
	.use(passport.initialize())
	.use(passport.session())
	.use(flash()) // use connect-flash for flash messages stored in session
	.set('views', path.join(__dirname, 'views'))
	// passport.authenticate middleware is used here to authenticate the request
	.set('view engine', 'ejs')
	// The middleware receives the data from Google and runs the function on Strategy config
	.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	})
	.get('/testing', (req, res) => res.render('pages/index'))
	.get('/', routes.home)
	.get('/subscribe', routes.subscribe)
	.get('/verMail', routes.verMail)
	.get('/resnd', routes.rsnvMail)
	.post('/subscribing', routes.subscribing)
	// process the login form
	.post('/login', passport.authenticate('local-login', {
		successRedirect: '/workspace', // redirect to the secure profile section
		failureRedirect: '/badLogin', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}), function (req, res) {
		res.redirect('/workspace');
	})
	.get('/badLogin', routes.badLogin)

	.get('/reset-pwd', routes.resetPass) // Reset Password request
	.post('/rstpwd', mailer.rpwdm) //Send Reset Pwd Password
	.get('/pwdRst', routes.pwdRst) //Change Password
	.post('/resetPwd', routes.changePass)// Post Change Password
	//Passport
	.get('/auth/google',
		passport.authenticate('google', {
			scope: ['profile', 'email'] // Used to specify the required data
		})
	)
	.get('/auth/google/callback', passport.authenticate('google'), routes.authGoogle)
	.get('/lock-screen', routes.lockScreen)
	.get('/workspace', isLoggedIn, routes.workspace)
	.post('/edProf', isLoggedIn, routes.editProfile)



//   __ _    __ 
//  (_ / \	|_ 
//  __)\_/	|__


var http = require('http').Server(server);
var io = require("socket.io")(http)
var passportSocketIo = require("passport.socketio");


//With Socket.io >= 1.0

io.use(passportSocketIo.authorize({
	cookieParser: cookieParser,         // the same middleware you registrer in express
	key: sessionName,                   // the name of the cookie where express/connect stores its session_id
	secret: secretKey,                  // the session_secret to parse the cookie
	store: sessionStore,                // we NEED to use a sessionstore. no memorystore please
	success: onAuthorizeSuccess,        // *optional* callback on success - read more below
	fail: onAuthorizeFail,              // *optional* callback on fail/error - read more below
}));

io.use(function (socket, next) {
	// Wrap the express middleware
	sessionMiddleware(socket.request, {}, next);
});

io.on("connection", function (socket) {
	var user = socket.request.session.passport.user;
	if(user != null){
	socket.join(user.u_id);
	console.log(`[Socket.io] - Connected user: ${user.usrname}, u_id: ${user.u_id}`)
	}
	//Transmit the messages from one user to another
	socket.on('get chats', function (msg) {
		console.log(`[Socket.io] - User ${user.usrname} asked for chats`)
		connection.query(`
			select chats.chat_uid, chats.chat_name, chats.chat_type, chats2.u_id as user_chat, usrs.name, 
				m.u_id as last_message_user_uid, m.message as last_message_message, m.time as last_message_time
			
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
			`
			, function (err, rows) {
				io.to(user.u_id).emit('retrieve chats', { my_uid: user.u_id, chats: rows });
			}
		);
	});

	//Transmit the messages from one user to another
	socket.on('chat message', function (msg) {
		chat = msg.chat;
		message = msg.message;
		from = user.u_id;
		time = new Date();
		connection.query(`
			select * from chats_users 
			inner join chats on chats.chat_uid = chats_users.chat_uid
			where chats_users.chat_uid = '${chat}'
		`, function (err, chats) {
			chats.forEach(qchat => {
				if (from != qchat.u_id) {
					io.to(qchat.u_id).emit('chat message', { chat: chat, type: qchat.chat_type, from: from, from_name: user.name, message: message, time: time });
				}
			});
		});

		timeDB = formatLocalDate().slice(0, 19).replace('T', ' ');
		connection.query(`insert into messages(chat_uid, u_id, message,time) 
                            values ('${chat}','${from}','${message}','${timeDB}')`)
	});

	//Client request the messages
	socket.on('get messages', function (msg) {
		console.log(`[Socket.io] - ${user.usrname} request the messages from chat: ${msg.id}, page:${msg.page}`);
		//initMsg
		connection.query(`
			select messages.u_id as message_user_uid, messages.message, messages.time, usrs.name, chats.chat_type  
			from messages inner join usrs on messages.u_id = usrs.u_id
			inner join chats on chats.chat_uid = messages.chat_uid
			where  messages.chat_uid = '${msg.id}' order by time desc limit 10;

		 `, function (err, rows) {
			io.to(user.u_id).emit('retrieve messages', { messages: rows, message_user_uid: user.message_user_uid });
		});
	});
	
	
	socket.on('subscribingData', function(data){
		method.subscribingData(data);
	});
	
	
});



function formatLocalDate() {
	var now = new Date(),
		tzo = -now.getTimezoneOffset(),
		dif = tzo >= 0 ? '+' : '-',
		pad = function (num) {
			var norm = Math.abs(Math.floor(num));
			return (norm < 10 ? '0' : '') + norm;
		};
	return now.getFullYear()
		+ '-' + pad(now.getMonth() + 1)
		+ '-' + pad(now.getDate())
		+ 'T' + pad(now.getHours())
		+ ':' + pad(now.getMinutes())
		+ ':' + pad(now.getSeconds())
		+ dif + pad(tzo / 60)
		+ ':' + pad(tzo % 60);
}

function onAuthorizeSuccess(data, accept) {
	accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
	console.log("[Socket.io] - User not Authenticated ", message)
	// We use this callback to log all of our failed connections.
	accept(null, true);
}


// launch ======================================================================
http.listen(PORT, function () {
	console.log(
		` 
 ██████  ██████   ██████  ██████   ██████   █████  ████████ 
██    ██ ██   ██ ██       ██   ██ ██    ██ ██   ██    ██    
██    ██ ██████  ██   ███ ██████  ██    ██ ███████    ██    
██    ██ ██   ██ ██    ██ ██   ██ ██    ██ ██   ██    ██    
 ██████  ██   ██  ██████  ██████   ██████  ██   ██    ██   
				Listening on port: ${PORT}`)

});

//      _ ___   _  _  __
//  |V||_  ||_|/ \| \(_ 
//  | ||__ || |\_/|_/__)	

// Array with some colors
var colors = ['#a8d069', '#30ad64', '#25ccbf', '#20ac99', '#f8c740', '#e2a62b',
	'#face6a', '#e4b962', '#fd7072', '#cf404d', '#d39f9a',
	'#735260', '#af4173', '#822e50', '#e64c40', '#bf3a30', '#fc7d64', '#49647b'];
// ... in random order
colors.sort(function (a, b) { return Math.random() > 0.5; });

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()) {
		if (req.user[0].verified === 0) {
			//console.log(req.user[0]);
			res.render('pages/sec/verify-email', { usr: req.user[0]});
			return;
		} else {
			//console.log(req.user[0].verified);
			return next();
		}
	}
	// if they aren't redirect them to the home page
	res.redirect("/");
}


/** 			   o       o                                
				   |       |                               
				   o   o   o  
					\ / \ / 
					 o   o  */
/*_      _____ ___ ___  ___   ___ _  _____ _____ 
 \ \    / / __| _ ) __|/ _ \ / __| |/ / __|_   _|
  \ \/\/ /| _|| _ \__ \ (_) | (__| ' <| _|  | |  
   \_/\_/ |___|___/___/\___/ \___|_|\_\___| |_|
  
		serverside websocket managment 

//exports.wsServer;
// WebSocket server Starts from Here

			else if (pckr.clkcd === 'onCleaker') { //CLEAKER NETWORK MONITORING
				//console.log(pckr.cleaker); //for dev purposes, remove to not saturate the console.
				//packet - send INFORMATION TO RUNME
				var activeUser = JSON.stringify({ type: "clkr_Start", cleaker: pckr.cleaker });
				//console.log(pckr.cleaker);
				brdCstRight("runmeMasterMind", activeUser);
			} //ACTIVE USERS - RUNME CLOSURE
			else if (pckr.clkcd === 'appCleaker') { // RECEIVING CLEAKER FROM A MOBILE APP
				//console.log(pckr.cleaker);
			}//MOBILE APP CLOSURE
			else if (pckr.clkcd === 'keepMeAlive') { // TIMER TO KEEP SESSIONS ALIVE
				//console.log("keepme");
				var stayingAlive = JSON.stringify({ type: "stayingAlive", chorus: "A A A A" });
				brdCstRight("runmeMasterMind", stayingAlive);
			}// KEEP ME ALIVE CLOSURE

			else if (pckr.clkcd == "subVer") {//Submit Data Verification
				exports.subVerificationRes = function (type, value, color, input, label, check) {
					connection.sendUTF(JSON.stringify({
						type: type,
						value: value,
						rcolor: color,
						input: input,
						label: label,
						check: check
					}));
				}
				method.dataSubmitVerification(pckr);
			}//subVer
		}//IF MESSAGE.TYPE CLOSURE
	});//END CONNECTION.ON MESSAGE		
**/
	
