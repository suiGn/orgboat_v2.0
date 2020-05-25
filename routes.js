/*
______ _____ _   _ _____ _____ _____ 
| ___ \  _  | | | |_   _|  ___/  ___|
| |_/ / | | | | | | | | | |__ \ `--. 
|    /| | | | | | | | | |  __| `--. \
| |\ \\ \_/ / |_| | | | | |___/\__/ /
\_| \_|\___/ \___/  \_/ \____/\____/ 
							OrgBoat
CODED BY: SUI GENERIS 
where do we go from here?
*/

var index = require('./index');
var uuid = require('node-uuid');
const jwt = require('jsonwebtoken');
const config = require('./configs/config');
const method = require('./methods');

exports.home = function(req, res){res.render('pages/index', { opt1: "Sign Up", opt2: "/subscribe", opt3: " " })};
exports.subscribe = function(req, res){res.render('pages/subscribe', { opt: " ", opt1: "Log In", opt2: "/" })};
exports.login = function(req, res){
	 if(req.body.usrname === "asfo" && req.body.pwd === "holamundo") {
	     const payload = {
	      check:  true
	     };
	     const token = jwt.sign(payload, config.llave, {
	      expiresIn: 1440
	     });
	     res.json({
	      mensaje: 'Autenticación correcta',
	      token: token
	     });
	       } else {
			   res.render('pages/index', { opt1: "Sign Up", opt2: "/subscribe", opt3: "Incorrect usarname or password. " })
	       }
	   };

exports.datos = function(req, res){
 const datos = [
  { id: 1, nombre: "Asfo" },
  { id: 2, nombre: "Denisse" },
  { id: 3, nombre: "Carlos" }
 ];
 
 res.json(datos);
};

exports.resetPass = function(req, res){res.render('pages/sec/reset-pass')};
exports.lockScreen= function(req, res){res.render('pages/sec/lock-screen')};
exports.workspace = function(req, res){res.render('pages/workspace')};



//subscribe
exports.subscribing = function(req,res){
	var clName = req.body.subName; 
	var usrname = req.body.subUsername; 
	var email = req.body.subEmail; 
	var pwd = req.body.subPwd; 
	var rtPwd = req.body.subRtPwd; 
	var uuid_numbr = uuid.v4();
	var verified = 0;
	var dt = new Date();
	if (method.nameRegex(clName) && method.usrnmRegex(usrname) && method.emailRegex(email)) {
	if (clName.length <= 3 || usrname.length <= 3 || email.length <= 3 || pwd.length <= 4){
	res.render("pages/subscribe" ,{ opt: "Too short."});
	}else if (pwd != rtPwd){
	res.redirect("/");
	}else{
	//Verifies if the user already exists
	index.orgboatDB.query('SELECT usrname FROM usrs WHERE Usrname = $1', [usrname], (err, resp) => {
	if(resp.rowCount >= 1){
		console.log("username exists");
		return;
			}else{	
			index.orgboatDB.query('SELECT Email FROM Usrs WHERE Email = $1', [email], (err, resp) => {
			if(resp.rowCount >= 1){
			return;
				}else{				
		//STORES DATA
		index.orgboatDB.query('INSERT INTO usrs (name, usrname, email, password, Verified, last_update, u_id, created) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [clName, usrname, email, pwd, verified, dt, uuid_numbr, dt], (error, results) => {
		if (error) {
		throw error
				 }
		console.log("New user saved!");
		console.log(clName + usrname + email + pwd);
			})//closes Insert New Usr Into Table
			}//else
			})// Closes second query - email
				} //closes else first query 
				}) //closes the vault first query - username
			}// Pwd do not match
			res.render('pages/workspace');
				}else{
				res.render("pages/subscribe" ,{ opt: "Oops! Something went wrong while submitting the form."});
			}
		}