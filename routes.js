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

//DATA BASE CONNECTION
var index = require('./index');
const { Client } = require('pg');
const config = require('./configs/config');
//const theVault = new Client({
//connectionString: "postgres://csicplnifqncpc:ce12c51c83e437148779a4f7e0d508722f0a5ce9f05f894f9b6f88b9f2d9b3f9@ec2-174-129-253-53.compute-1.amazonaws.com:5432/d70qi6m3chd89a",
//ssl: true,
//});
//theVault.connect();
var uuid = require('node-uuid');
const jwt = require('jsonwebtoken');
exports.home = function(req, res){res.render('pages/index')};
exports.login = function(req, res){
	theVault.query('SELECT Usrname, Password FROM Usrs WHERE Usrname = $1 && Password = $2', [req.body.usrname, req.body.pwd], (err, res) => {
	if(res.rowCount >= 1){
		res.redirect('/');
		}
    if(req.body.usrname === "asfo" && req.body.pwd === "holamundo") {
  const payload = {
   check:  true
  };
  const token = jwt.sign(payload, config.llave, {
   expiresIn: 1440
  });
  res.json({
   mensaje: 'Logged In!',
   token: token
  });
    } else {
        res.json({ mensaje: "Incorrect username or password!"})
    }
})
}

exports.datos = function(req, res){
 const datos = [
  { id: 1, nombre: "Asfo" },
  { id: 2, nombre: "Denisse" },
  { id: 3, nombre: "Carlos" }
 ];
 
 res.json(datos);
};

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
	if (clName <= 3 || usrname <= 4 || email <= 3 || pwd <= 3){
	}else if (pwd != rtPwd){
	return false;
	}else{
	//Verifies if the user already exists
	theVault.query('SELECT Usrname FROM Usrs WHERE Usrname = $1', [usrname], (err, res) => {
	if(res.rowCount >= 1){
		res.redirect('/');
		}else{	
	theVault.query('SELECT Email FROM Usrs WHERE Email = $1', [email], (err, res) => {
	if(res.rowCount >= 1){
		res.redirect('/');
		}else{				
	//STORES DATA
	theVault.query('INSERT INTO usrs (uuid, name, usrname, email, password, Verified, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7)', [uuid_numbr, clName, usrname, email, pwd, verified, dt], (error, results) => {
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
			res.render('pages/main/runme');
				}//End Post Method	
							