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

const index = require("./index");
const uuid = require("node-uuid");
const jwt = require("jsonwebtoken");
const config = require("./configs/config");
const method = require("./methods");
const bcrypt = require("bcrypt");
const mailer = require("./mailer");
const multer = require("multer");
const { CustomValidation } = require("express-validator/src/context-items");

exports.home = function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/workspace");
  } else {
    res.render("pages/index", {
      opt1: "Sign Up",
      opt2: "/subscribe",
      opt3: " ",
    });
  }
};

exports.badLogin = function (req, res) {
  res.render("pages/index", {
    opt1: "Sign Up",
    opt2: "/subscribe",
    opt3: "Invalid login credentials.",
  });
};
exports.subscribe = function (req, res) {
  res.render("pages/subscribe", { opt: " ", opt1: "Log In", opt2: "/" });
};
exports.authGoogle = (req, res) => {
  var name = req.user.displayName;
  var usrname = req.user.emails[0].value;
  var email = usrname;
  var profile_pic = req.user.photos[0].value;
  var u_type = 1;
  var dt = new Date();
  var uuid_numbr = uuid.v4();
  index.orgboatDB.query(
    `SELECT * FROM usrs WHERE usrname = '${usrname}'  OR email = '${usrname}'`,
    (err, resp) => {
      if (err) {
        res.render("pages/index", {
          opt1: "Sign Up",
          opt2: "/subscribe",
          opt3: " ",
        });
      } else {
        if (resp.length == 0) {
          //STORES DATA
          index.orgboatDB.query(
            "INSERT INTO usrs (name, usrname, email, Verified, last_update, u_id, created, u_type, pphoto) VALUES (?, ?, ?, ?, ?, ?, ?, ? ,?)",
            [name, usrname, email, 1, dt, uuid_numbr, dt, u_type, profile_pic],
            (error, results) => {
              if (error) {
                res.redirect("/");
                throw error;
              }
              console.log("New user saved!");
            }
          );
        }
        res.redirect("/");
      }
    }
  );
};

exports.resetPass = function (req, res) {
  res.render("pages/sec/reset-pass");
};
exports.pwdRst = function (req, res) {
  var uuid = req.query.uuid;
  var email = req.query.em;
  index.orgboatDB.query(
    "SELECT * FROM usrs WHERE email = ?",
    [email],
    (err, resp) => {
      if (resp.length >= 1) {
        var usr = resp[0];
        if (usr.random === uuid) {
          res.render("pages/sec/newPass", { opt: email, opt1: uuid });
        } else {
          res.render("pages/sec/response", {
            opt2: "Error",
            opt1: "Link Expired.",
          });
        }
      } else {
        res.render("pages/sec/response", {
          opt2: "Error",
          opt1: "Not valid. Try again.",
        });
      }
    }
  );
};

exports.verMail = function (req, res) {
  var uuid = req.query.uuid;
  var email = req.query.em;
  var verified = 1;
  index.orgboatDB.query(
    "SELECT * FROM usrs WHERE email = ?",
    [email],
    (err, resp) => {
      console.log(resp);
      if (resp.length >= 1) {
        var usr = resp[0];
        if (usr.u_id === uuid) {
          index.orgboatDB.query(
            "UPDATE usrs SET verified = ? WHERE email = ?",
            [verified, email],
            (error, results) => {
              if (error) {
                res.render("pages/sec/response", {
                  opt2: "Error",
                  opt1: "Something weird happened. Please try again.",
                });
              } else {
                res.render("pages/sec/response", {
                  opt2: "Email Verified",
                  opt1: "You can now login to your account.",
                });
              }
            }
          );
        } else {
          res.render("pages/sec/response", {
            opt2: "Error",
            opt1: "Something weird happened. Please try again.",
          });
        }
      }
    }
  );
};

exports.rsnvMail = function (req, res) {
  var uuid = req.query.uuid;
  var email = req.query.em;
  mailer.verifyEmail(req, res, email, uuid);
  //console.log(req.user[0]);
};

exports.changePass = function (req, res) {
  var random = req.body.uuid;
  var email = req.body.email;
  var password = req.body.password;
  var rtpass = req.body.rtpass;
  var reset = "0";
  var saltRounds = 10;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      throw err;
    } else {
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          throw err;
        } else {
          var Pwd = hash;
          if (password == rtpass) {
            index.orgboatDB.query(
              "UPDATE usrs SET password = ?, random = ? WHERE email = ? AND random = ?",
              [Pwd, email, random, reset],
              (error, results) => {
                if (error) {
                  res.render("pages/sec/response", {
                    opt2: "Error",
                    opt1: "Something weird happened. Please try again.",
                  });
                } else {
                  res.render("pages/sec/response", {
                    opt2: "Password Changed",
                    opt1: "Please login with your new password.",
                  });
                }
              }
            );
          } else {
            res.render("pages/sec/response", {
              opt2: "Error",
              opt1: "Password does not match.",
            });
          }
        }
      });
    }
  });
};

exports.lockScreen = function (req, res) {
  res.render("pages/sec/lock-screen");
};
//exports.workspace = function(req, res){res.render('pages/workspace')};
//subscribe
exports.subscribing = function (req, res) {
  var clName = req.body.subName;
  var usrname = req.body.subUsername;
  var email = req.body.subEmail;
  var pwd = req.body.subPwd;
  const saltRounds = 10;
  var hashPwd = "";
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      throw err;
    } else {
      bcrypt.hash(pwd, salt, function (err, hash) {
        if (err) {
          throw err;
        } else {
          hashPwd = hash;
          var rtPwd = req.body.subRtPwd;
          var uuid_numbr = uuid.v4();
          var verified = 0;
          var dt = new Date();
          var u_type = 0;
          if (
            method.nameRegex(clName) &&
            method.usrnmRegex(usrname) &&
            method.emailRegex(email)
          ) {
            if (
              clName.length <= 3 ||
              usrname.length <= 3 ||
              email.length <= 3 ||
              pwd.length <= 4
            ) {
              res.render("pages/subscribe", {
                opt: "Too short.",
                opt1: "Log In",
                opt2: "/",
              });
              returnl;
            } else if (pwd != rtPwd) {
              res.render("pages/subscribe", {
                opt: "Password does not match.",
                opt1: "Log In",
                opt2: "/",
              });
              return;
            } else {
              //Verifies if the user already exists
              index.orgboatDB.query(
                "SELECT usrname FROM usrs WHERE usrname = ?",
                [usrname],
                (err, resp) => {
                  if (resp.length >= 1) {
                    console.log("username exists");
                    res.render("pages/subscribe", {
                      opt: "Username Already Exists.",
                      opt1: "Log In",
                      opt2: "/",
                    });
                    return;
                  } else {
                    console.log(resp);
                    index.orgboatDB.query(
                      "SELECT email FROM usrs WHERE email = ?",
                      [email],
                      (err, resp) => {
                        console.log(resp);
                        if (err) {
                          console.log("Errore login: " + err);
                        }
                        if (resp.length >= 1) {
                          console.log("Email exists");
                          res.render("pages/subscribe", {
                            opt: "Email Already Exists.",
                            opt1: "Log In",
                            opt2: "/",
                          });
                          return;
                        } else {
                          //STORES DATA
                          index.orgboatDB.query(
                            "INSERT INTO usrs (name, usrname, email, password, verified, last_update, u_id, created, u_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)",
                            [
                              clName,
                              usrname,
                              email,
                              hashPwd,
                              verified,
                              dt,
                              uuid_numbr,
                              dt,
                            ],
                            (error, results) => {
                              if (error) {
                                throw error;
                              }
                              console.log("New user saved!");
                              console.log(clName + usrname + email);
                              //mailer.verifyEmail(email, uuid_numbr);
                            }
                          ); //closes Insert New Usr Into Table
                        } //else
                      }
                    ); // Closes second query - email
                  } //closes else first query
                }
              ); //closes the vault first query - username
            } // Pwd do not match
            mailer.verifyEmail(req, res, email, uuid_numbr);
          } else {
            res.render("pages/subscribe", {
              opt: "Oops! Something went wrong while submitting the form.",
              opt1: "Log In",
              opt2: "/",
            });
          }
        }
      });
    }
  });
};

exports.workspace = function (req, res) {
  res.render("pages/workspace", { user: req.user[0] });
};

exports.editProfile = function (req, res) {
  var fullName = req.body.fullNameEditP;
  var avatar = req.body.avatarEditP;
  var city = req.body.cityEditP;
  var phone = req.body.phoneEditP;
  var website = req.body.websiteEditP;
  var isPublic = req.body.isPublicEditP;
  var about = req.body.aboutEditP;
  var email = req.user[0].email;
  var rqname = req.user[0].name;
  index.orgboatDB.query(
    "UPDATE usrs SET name = ?, city = ?, phone = ?, website = ?, public = ?, about = ?  WHERE email = ?",
    [fullName, city, phone, website, isPublic, about, email],
    (error, results) => {
      if (error) {
        res.redirect("/workspace");
        console.log(error);
      } else {
        res.redirect("/workspace");
        console.log(email);
      }
    }
  );
};

exports.savedbimage = function (req, res) {
  console.log(req);
  var photo = req.file.path;
  var uidd = req.user[0].u_id;
  index.orgboatDB.query(
    "UPDATE usrs SET pphoto = ? WHERE u_id = ?",
    [photo, uidd],
    (error, results) => {
      if (error) {
        //res.redirect("/workspace");
        console.log(error);
      } else {
        //res.redirect("/workspace");
        console.log("Okay");
      }
    }
  );
};
