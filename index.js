/** SERVER APP: OrgBoat **
 ██████  ██████   ██████  ██████   ██████   █████  ████████ 
██    ██ ██   ██ ██       ██   ██ ██    ██ ██   ██    ██    
██    ██ ██████  ██   ███ ██████  ██    ██ ███████    ██    
██    ██ ██   ██ ██    ██ ██   ██ ██    ██ ██   ██    ██    
 ██████  ██   ██  ██████  ██████   ██████  ██   ██    ██    
                                                                                                                                                                                                         
*** CODED BY sui Gn
workspace
****/
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const jwt = require('jsonwebtoken')
const config = require('./configs/config')
const { body,validationResult } = require("express-validator")
const { sanitizeBody } = require("express-validator")
var bodyParser = require("body-parser")
var routes = require('./routes')
const method = require('./methods')
var unicorn = "🍺🦄🍺"
var uuid = require('node-uuid')
const { Client } = require('pg')
const orgboatDB = new Client({
connectionString: "postgres://fqzgwpkbzidzom:9fd77d52e8fc5d2cf5da2093c977bda43b10a913ad0e0b91713991fbd41c0a5d@ec2-34-195-169-25.compute-1.amazonaws.com:5432/dds6n0grhdqssn",
ssl: { rejectUnauthorized: false }
});
exports.orgboatDB = orgboatDB;
orgboatDB.connect()

const server = express()
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/testing', (req, res) => res.render('pages/index'))
  .get('/', routes.home)
  .get('/subscribe', routes.subscribe)
  .post('/subscribing', routes.subscribing)
  .post('/login', routes.login)
  .get('/reset-pwd', routes.resetPass)
  .get('/lock-screen', routes.lockScreen)
  .get('/workspace', routes.workspace)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
 
	//      _ ___   _  _  __
	//  |V||_  ||_|/ \| \(_ 
	//  | ||__ || |\_/|_/__)	
		
		function brdCstRight(room, obj){ //broadcast to room membrs Only
		var BroadCastMembers = [ ];
     	//Filters only members belonging to the same room
		const members = allMembers.filter(goes => goes.room === room);
		//Once filtered to only same room members to broadcast
		members.forEach(function(element) {BroadCastMembers.push(element.client);});
		// broadcast message to all connected clients in room
		BroadCastMembers.forEach(function(EndClient){EndClient.sendUTF(obj);});	
			};
			
	/** Helper function for escaping input strings */
	function htmlEntities(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
					      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
							}			
							// Array with some colors
							var colors = [ '#a8d069', '#30ad64', '#25ccbf', '#20ac99', '#f8c740', '#e2a62b',
							 '#face6a', '#e4b962', '#fd7072', '#cf404d', '#d39f9a', 
							'#735260', '#af4173', '#822e50', '#e64c40', '#bf3a30','#fc7d64','#49647b'];
	// ... in random order
	colors.sort(function(a,b) { return Math.random() > 0.5; } );
	
	
	
   /** 				  o       o                                
					  |       |                               
					  o   o   o  
   					   \ / \ / 
   					    o   o  */
	/*_      _____ ___ ___  ___   ___ _  _____ _____ 
	 \ \    / / __| _ ) __|/ _ \ / __| |/ / __|_   _|
      \ \/\/ /| _|| _ \__ \ (_) | (__| ' <| _|  | |  
	   \_/\_/ |___|___/___/\___/ \___|_|\_\___| |_|
				┌─┐┬  ┌─┐┌─┐┬┌─┌─┐┬─┐
				│  │  ├┤ ├─┤├┴┐├┤ ├┬┘
				└─┘┴─┘└─┘┴ ┴┴ ┴└─┘┴└─    
			serverside websocket managment **/
	var webSocketServer = require('websocket').server;
	var clients = [ ];
	var allMembers = [ ];
	
	var wsServer = new webSocketServer({
    httpServer: server
		});
//exports.wsServer;
// WebSocket server Starts from Here
wsServer.on('request', function(request) {
		   var uuid_numbr = uuid.v4();
		  
		//accept connection if check 'request.origin'
		   var connection = request.accept(); //connecting from same website
		   var index = clients.push(connection) - 1; //client index to remove them on 'close' event
		   //A connection was acepted.
		   //console.log('1. wsOnRqstLog - Connection Accepted UUID: ' + uuid_numbr + ' Request.Origin: ' + request.origin);
		    //starts - comunication with user - connection.on 
		   connection.sendUTF(JSON.stringify({ type:'cleaked', uuid: uuid_numbr})); // 'cleaked' -- cleaker.js handshake innitiation
		   //Listening - on incoming comunication
			  connection.on('message', function(message) {
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
			else if (pckr.clkcd === 'onCleaker'){ //CLEAKER NETWORK MONITORING
			//console.log(pckr.cleaker); //for dev purposes, remove to not saturate the console.
			//packet - send INFORMATION TO RUNME
			var activeUser = JSON.stringify({ type: "clkr_Start", cleaker: pckr.cleaker});
			//console.log(pckr.cleaker);
			brdCstRight("runmeMasterMind", activeUser);
					} //ACTIVE USERS - RUNME CLOSURE
			else if (pckr.clkcd === 'appCleaker'){ // RECEIVING CLEAKER FROM A MOBILE APP
					//console.log(pckr.cleaker);
					}//MOBILE APP CLOSURE
			else if (pckr.clkcd === 'keepMeAlive'){ // TIMER TO KEEP SESSIONS ALIVE
					//console.log("keepme");
			 	 	var stayingAlive = JSON.stringify({ type: "stayingAlive", chorus: "A A A A"});
			 	 	brdCstRight("runmeMasterMind", stayingAlive);
					}// KEEP ME ALIVE CLOSURE
					
					else if (pckr.clkcd == "subVer"){//Submit Data Verification
		  exports.subVerificationRes = function(type, value, color, input, label, check){
		 		connection.sendUTF(JSON.stringify({ 
					type:type,
					value: value, 
					rcolor:color ,
					input: input,
					label: label,
					check: check}));
		 			   }
						method.dataSubmitVerification(pckr);
					}//subVer


					}//IF MESSAGE.TYPE CLOSURE
							});//END CONNECTION.ON MESSAGE		
														
			// User disconnected
			connection.on('close', function(connection) {
					//console.log(".disconnected - UUID:" + uuid_numbr);//logoutRecord
					clients.splice(index, 1);// remove user from the list of connected clients
					}); 
				}); // FINISHES WEB SERVER ON
