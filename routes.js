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

const index = require('./index');
const uuid = require('node-uuid');
const jwt = require('jsonwebtoken');
const config = require('./configs/config');
const method = require('./methods');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')


exports.home = function (req, res) {
	if (req.isAuthenticated()) {
		res.redirect("/workspace");
	} else {
		res.render('pages/index', { opt1: "Sign Up", opt2: "/subscribe", opt3: " " })
	}
};

exports.subscribe = function (req, res) { res.render('pages/subscribe', { opt: " ", opt1: "Log In", opt2: "/" }) };
exports.login = function (req, res) {
	var usrname = req.body.usrname;
	var pwd = req.body.pwd;
	index.orgboatDB.query('SELECT * FROM Usrs WHERE Usrname = $1 OR email = $1', [usrname], (err, resp) => {
		if (err) {
			res.render('pages/index', { opt1: "Sign Up", opt2: "/subscribe", opt3: "No account found." });
		} else {
			// selects return an array, so access the first in the array
			var usr = resp.rows[0];
			var hash = usr.password;
			// now lets compare the passwords
			bcrypt.compare(pwd, hash, function (err, isMatch) {
				if (err) {
					throw err
				} else if (!isMatch) {
					res.render('pages/index', { opt1: "Sign Up", opt2: "/subscribe", opt3: "Invalid username or password." });
				} else {
					const payload = {
						check: true
					};
					const token = jwt.sign(payload, config.llave, {
						expiresIn: 1440
					});
					res.json({
						mensaje: 'Autenticación correcta',
						token: token
					});
				}
			})
		}
	})
};


exports.authGoogle = (req, res) => {
	var name = req.user.displayName;
	var usrname = req.user.emails[0].value;
	var email = usrname;
	var u_type = 1;
	var dt = new Date();
	var uuid_numbr = uuid.v4();

	index.orgboatDB.query(`SELECT * FROM Usrs WHERE Usrname = '${usrname}'  OR email = '${usrname}'`, (err, resp) => {
		if (err) {
			res.render('pages/index', { opt1: "Sign Up", opt2: "/subscribe", opt3: " " })
		} else {

			if (resp.rowCount == 0) {
				//STORES DATA
				index.orgboatDB.query('INSERT INTO usrs (name, usrname, email, Verified, last_update, u_id, created, u_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
					[name, usrname, email, 1, dt, uuid_numbr, dt, u_type], (error, results) => {

					if (error) {
						res.redirect('/');
						throw error
					}
					console.log("New user saved!");
				})
			}
			res.redirect('/workspace');
		}
	});
};



exports.resetPass = function (req, res) { res.render('pages/sec/reset-pass') };
exports.pwdRst =  function(req, res) {
	var uuid = req.query.uuid;
	var email = req.query.em;
	index.orgboatDB.query('SELECT * FROM Usrs WHERE Email = $1', [email], (err, resp) => {
	if(resp.rowCount >= 1){
		var usr = resp.rows[0];
		if (usr.random === uuid){
			res.render('pages/sec/newPass', {opt: email, opt1: uuid})
		}else{
		res.render('pages/sec/response', {opt2: "Error", opt1: "Link Expired."})	
		}
		}else{		
			res.render('pages/sec/response', {opt2: "Error", opt1: "Not valid. Try again."});
		}
})};
exports.changePass = function(req, res){
	var random = req.body.uuid;
	var email = req.body.email;
	var password = req.body.password;
	var rtpass = req.body.rtpass;
	var reset = "0";
	var saltRounds = 10;
		bcrypt.genSalt(saltRounds, function (err, salt) {
		  if (err) {
		    throw err
		  } else {
		    bcrypt.hash(password, salt, function(err, hash) {
		      if (err) {
		        throw err
		      } else {
			var Pwd = hash;
			if (password == rtpass){
			index.orgboatDB.query('UPDATE usrs SET Password = $1, Random = $4 WHERE Email = $2 AND Random = $3', [Pwd, email, random, reset], (error, results) => {
			if (error) {
			 res.render('pages/sec/response', {opt2: "Error", opt1: "Something weird happened. Please try again."});
			 }else{
			 res.render('pages/sec/response', {opt2: "Password Changed", opt1: "Please login with your new password."});	
			 	}
			})
			}else{
			res.render('pages/sec/response', {opt2: "Error", opt1: "Password does not match."});
		}
		      }
		    })
		  }
		})
		 	};
	  
exports.lockScreen = function (req, res) { res.render('pages/sec/lock-screen') };
//exports.workspace = function(req, res){res.render('pages/workspace')};



//subscribe
exports.subscribing = function (req, res) {
	var clName = req.body.subName;
	var usrname = req.body.subUsername;
	var email = req.body.subEmail;
	var pwd = req.body.subPwd;
	const saltRounds = 10
	var hashPwd = "";


	bcrypt.genSalt(saltRounds, function (err, salt) {
		if (err) {
			throw err
		} else {
			bcrypt.hash(pwd, salt, function (err, hash) {
				if (err) {
					throw err
				} else {
					hashPwd = hash;
				}
			})
		}
	})
	var rtPwd = req.body.subRtPwd;
	var uuid_numbr = uuid.v4();
	var verified = 0;
	var dt = new Date();
	var u_type = 0;

	if (method.nameRegex(clName) && method.usrnmRegex(usrname) && method.emailRegex(email)) {
		if (clName.length <= 3 || usrname.length <= 3 || email.length <= 3 || pwd.length <= 4) {
			res.render("pages/subscribe", { opt: "Too short." });
		} else if (pwd != rtPwd) {
			res.redirect("/");
		} else {
			//Verifies if the user already exists
			index.orgboatDB.query('SELECT usrname FROM usrs WHERE Usrname = $1', [usrname], (err, resp) => {
				if (resp.rowCount >= 1) {
					console.log("username exists");
					return;
				} else {
					index.orgboatDB.query('SELECT Email FROM Usrs WHERE Email = $1', [email], (err, resp) => {
						if (resp.rowCount >= 1) {
							return;
						} else {
							//STORES DATA
							index.orgboatDB.query('INSERT INTO usrs (name, usrname, email, password, Verified, last_update, u_id, created, u_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0)', [clName, usrname, email, hashPwd, verified, dt, uuid_numbr, dt], (error, results) => {
								if (error) {
									throw error
								}
								console.log("New user saved!");
								console.log(clName + usrname + email);
							})//closes Insert New Usr Into Table
						}//else
					})// Closes second query - email
				} //closes else first query 
			}) //closes the vault first query - username
		}// Pwd do not match
		res.render('pages/workspace');
	} else {
		res.render("pages/subscribe", { opt: "Oops! Something went wrong while submitting the form." });
	}
}


