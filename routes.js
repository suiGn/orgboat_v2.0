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


exports.home = function(req, res){res.render('pages/index', { opt1: "Sign Up", opt2: "/subscribe", opt3: " " })};
exports.subscribe = function(req, res){res.render('pages/subscribe', { opt: " ", opt1: "Log In", opt2: "/" })};
exports.login = function(req, res){
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
			  	bcrypt.compare(pwd, hash, function(err, isMatch) {
			  	  if (err) {
			  	    throw err
			  	  } else if (!isMatch) {
			  	   res.render('pages/index', { opt1: "Sign Up", opt2: "/subscribe", opt3: "Invalid username or password." });
			  	  } else {
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
				 	       } 
				 	   })
			  }
			  })
			};
			
exports.rpwdm = function(req,res,next){
	var email = req.body.rstEmail;
	console.log(email)
  // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.fatcow.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "noreply@orgboat.info", // generated ethereal user
        pass: "Orwell1984", // generated ethereal password
      },
    });
	var mailOptions = {
	from: 'noreply@orgboat.info',//replace with your email
	to: email,//replace with your email
	subject: `Orgboat : Reset Password:`,
	html:`<h1>Contact details</h1>
	<h2> email:${req.body.email} </h2><br>
	<h2> phonenumber:${req.body.phonenumber} </h2><br>
	<h2> message:${req.body.message} </h2><br>`
	};
	transporter.sendMail(mailOptions, function(error, info){
	if (error) {
	console.log(error);
	res.send('error') // if error occurs send error as response to client
	}
	else {
	console.log('Email sent: ' + info.response);
	res.send('Sent Successfully')//if mail is sent successfully send Sent successfully as response
	}
	});
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
	const saltRounds = 10
	var hashPwd = "";
	bcrypt.genSalt(saltRounds, function (err, salt) {
	  if (err) {
	    throw err
	  } else {
	    bcrypt.hash(pwd, salt, function(err, hash) {
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
		index.orgboatDB.query('INSERT INTO usrs (name, usrname, email, password, Verified, last_update, u_id, created) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [clName, usrname, email, hashPwd, verified, dt, uuid_numbr, dt], (error, results) => {
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
				}else{
				res.render("pages/subscribe" ,{ opt: "Oops! Something went wrong while submitting the form."});
			}
		}