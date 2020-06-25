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

var Sequelize = require('sequelize')
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

	socket.join(user.u_id);
	console.log(`[Socket.io] - Connected user: ${user.usrname}, u_id: ${user.u_id}`)


	//Transmit the messages from one user to another
	socket.on('get chats', function (msg) {

		console.log(`[Socket.io] - User ${user.usrname} ask for chats`)

		connection.query(`
						
			select chats.chat_uid, chats.chat_name, chats.chat_type, chats.chat_u_id_1, chats.chat_u_id_2, 
			m.u_id as last_message_user_uid, m.message as last_message_message, m.time as last_message_time,
			user1.name as user1_name, user2.name as user2_name, last_user.name as last_user_name

			#select *

			from chats_users  

			inner join chats on chats_users.chat_uid = chats.chat_uid 
			left join messages m on m.chat_uid = chats.chat_uid 
			and m.message_id = 
				(
				SELECT MAX(message_id) 
				FROM messages z 
				WHERE z.chat_uid = m.chat_uid
				)
				
			left join usrs user1 on chats.chat_u_id_1 = user1.u_id
			left join usrs user2 on chats.chat_u_id_2 = user2.u_id
			left join usrs last_user on m.u_id = last_user.u_id

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
		sku = msg.sku;
		message = msg.message;
		from = socket.request.session.passport.user.sku;
		time = new Date();

		io.to(sku).emit('chat message', { from: from, message: message, time: time });
		timeDB = formatLocalDate().slice(0, 19).replace('T', ' ');
		connection.query(`insert into messages(user_sku_from, user_sku_to, message,time) 
                            values ('${from}','${sku}','${message}','${timeDB}')`)


	});

	//Client request the messages
	socket.on('get messages', function (msg) {

		console.log(`[Socket.io] - ${user.sku} request the messages from ${msg.sku}, page:${msg.page}`);

		initMsg

		connection.query(`select * from messages where  (user_sku_from = '${user.sku}' and user_sku_to  = '${msg.sku}') or 
            (user_sku_from = '${msg.sku}' and user_sku_to  = '${user.sku}') order by time desc limit 10`, function (err, rows) {
			io.to(user.sku).emit('retrieve messages', { messages: rows, sku: user.sku });
		});

	});

});


function onAuthorizeSuccess(data, accept) {
	accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
	console.log("[Socket.io] - Failed connection: ", message)


	// We use this callback to log all of our failed connections.
	//accept(null, false);
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

function brdCstRight(room, obj) { //broadcast to room membrs Only
	var BroadCastMembers = [];
	//Filters only members belonging to the same room
	const members = allMembers.filter(goes => goes.room === room);
	//Once filtered to only same room members to broadcast
	members.forEach(function (element) { BroadCastMembers.push(element.client); });
	// broadcast message to all connected clients in room
	BroadCastMembers.forEach(function (EndClient) { EndClient.sendUTF(obj); });
};

/** Helper function for escaping input strings */
function htmlEntities(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
		.replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
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
		if (req.user.verified === 0) {
			res.render('pages/sec/verify-email', { usr: req.user[0].email });
			return;
		} else {
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
  
		serverside websocket managment **/
var webSocketServer = require('websocket').server;
var clients = [];
var allMembers = [];

var wsServer = new webSocketServer({
	httpServer: server
});
//exports.wsServer;
// WebSocket server Starts from Here
wsServer.on('request', function (request) {
	var uuid_numbr = uuid.v4();
	//accept connection if check 'request.origin'
	var connection = request.accept(); //connecting from same website
	var index = clients.push(connection) - 1; //client index to remove them on 'close' event
	//A connection was acepted.
	//console.log('1. wsOnRqstLog - Connection Accepted UUID: ' + uuid_numbr + ' Request.Origin: ' + request.origin);
	//starts - comunication with user - connection.on 
	connection.sendUTF(JSON.stringify({ type: 'cleaked', uuid: uuid_numbr })); // 'cleaked' -- cleaker.js handshake innitiation
	//Listening - on incoming comunication
	connection.on('message', function (message) {
		if (message.type === 'utf8') { //IF TEXT. 
			pckr = JSON.parse(message.utf8Data); //parse to json
			if (pckr.clkcd === 'CleakerRunMe') { //Create rooms for Broadcast Redirection.
				var runMeMember = {
					room: pckr.cleakerRoom,
					index: index,
					client: connection,
					uuid: uuid_numbr
				}
				//Push into the array
				allMembers.push(runMeMember) - 1;// index to remove them on 'close' event;			
			}
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

	// User disconnected
	connection.on('close', function (connection) {
		//console.log(".disconnected - UUID:" + uuid_numbr);//logoutRecord
		clients.splice(index, 1);// remove user from the list of connected clients
	});
}); // FINISHES WEB SERVER ON
