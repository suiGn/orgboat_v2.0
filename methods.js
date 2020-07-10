//      _ ___   _  _  __
//  |V||_  ||_|/ \| \(_ 
//  | ||__ || |\_/|_/__)	
//orgboat
	//dependencies	
const index = require('./index');


//REGEXS
//EMAIL REGEX
const emailRegex = (email) => {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
exports.emailRegex = emailRegex;
//USERNAME REGEX
const usrnmRegex = (usrname) => {
	var re = /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
	return re.test(usrname);
}
exports.usrnmRegex = usrnmRegex;
//NAME REGEX
const nameRegex = (subname) => {
	var re = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{3,21}$/u;
	return re.test(subname);
}	
exports.nameRegex = nameRegex;

exports.subscribingData = function subscribingData(){
		console.log("got it");
	
}

exports.dataSubmitVerification = function dataSubmitVerification(pckr){
	if (pckr.code == 'vName'){//Verify Name
			if (nameRegex(pckr.value)) { //Validate name
				index.subVerificationRes("validDataRes", "", "#39D1BB", "inputName", "#labelName", "g");//ValidName
			} else {
			index.subVerificationRes("validDataRes", "Invalid Name!", "#ff6666", "inputName", "#labelName", "ni");
				}    
			}// VERIFY NAME CLOSURE
	else if (pckr.code == 'vUser'){//Validate Username
			if (usrnmRegex(pckr.value)) {
			index.orgboatDB.query('SELECT usrname FROM usrs WHERE usrname = ?', [pckr.value], (err, res) => {
			if(res.length >= 1){
			index.subVerificationRes("validDataRes", "Username already taken!", "#ff6666", "inputUsername", "#labelUsername", "ut");
			 }else{	
			index.subVerificationRes("validDataRes", "", "#39D1BB", "inputUsername", "#labelUsername", "g");//validUsername
				}})}
			else{
			index.subVerificationRes("validDataRes", "Invalid Username!", "#ff6666", "inputUsername", "#labelUsername", "ui");
				}    
			}// VALID USERNAME CLOSURE		
	else if (pckr.code == 'vEmail'){//Validate Email
			if (emailRegex(pckr.value)) {
			index.orgboatDB.query('SELECT email FROM Usrs WHERE Email = ?', [pckr.value], (err, res) => {
			if(res.length >= 1){
			index.subVerificationRes("validDataRes", "Email already taken!", "#ff6666", "inputEmail", "#labelEmail", "et");	
			}else{	
			index.subVerificationRes("validDataRes", "", "#39D1BB", "inputEmail", "#labelEmail", "g");//validEmail
				}})}
			else{
			index.subVerificationRes("validDataRes", "Invalid Email!", "#ff6666", "inputEmail", "#labelEmail", "ei");	
					}
				}//VALID EMAIL CLOSURE
}