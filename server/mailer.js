const index = require("./index");
const nodemailer = require("nodemailer");
const uuid = require("node-uuid");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.fatcow.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "noreply@orgboat.info", // generated ethereal user
    pass: "Orwell1984", // generated ethereal password
  },
  secure: false,
  // here it goes
  tls: { rejectUnauthorized: false },
});

exports.rpwdm = function (req, res, next) {
  var email = req.body.rstEmail;
  var uuid_numbr = uuid.v4();
  index.orgboatDB.query(
    "SELECT email FROM usrs WHERE email = ?",
    [email],
    (err, resp) => {
      if (resp.length >= 1) {
        index.orgboatDB.query(
          "UPDATE usrs SET Random = ? WHERE email = ?",
          [uuid_numbr, email],
          (error, results) => {
            if (error) {
              throw error;
            }
            transporter;
            var mailOptions = {
              from: "noreply@orgboat.info", //replace with your email
              to: email, //replace with your email
              subject: `Orgboat : Reset Password:`,
              html:
                `<div class="col-md-12">
			 <table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #eaf0f7; margin: 0;" bgcolor="#eaf0f7">
			     <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
			         <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
			         <td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;"
			             valign="top">
			             <div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 50px; 0">
			                 <table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px dashed #4d79f6;"
			                        bgcolor="#fff">
			                     <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
			                         <td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
			                             <meta itemprop="name" content="Confirm Email" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
			                             <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
			                                 <tr>
			                                 <td><a href="#"><img src="https://orgboat.herokuapp.com/media/imgs/blue_helm2.png" alt="" style="margin-left: auto; margin-right: auto; margin-bottom: 20px; display:block; height: 50px;"></a></td>
			                                 </tr>
			                                 <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
			                                 <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; color: #0a80ff; font-size: 24px; font-weight: 700; text-align: center; vertical-align: top; margin: 0; padding: 0 0 10px;"
			                                         valign="top">OrgBoat</td>
			                                 </tr>
			                                 <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
			                                     <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; color: #3f5db3; font-size: 14px; vertical-align: top; margin: 0; padding: 10px 10px;" valign="top">` +
                email +
                `</td>
			                                 </tr>
			                                 <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
			                                     <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 10px 10px;" valign="top">Expires in 24 hours. Click the button to reset your password:</td>
			                                 </tr>
			                                 <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
			                                     <td class="content-block" itemprop="handler" itemscope itemtype="http://schema.org/HttpActionHandler" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 10px 10px;"
			                                         valign="top"><a href="https://orgboat.herokuapp.com/pwdRst?uuid=` +
                uuid_numbr +
                `&em=` +
                email +
                `" itemprop="url" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: block; border-radius: 5px; text-transform: capitalize; background-color: #0a80ff; margin: 0; border-color: #0a80ff; border-style: solid; border-width: 10px 20px;">Reset Password</a></td>
			                                 </tr>
			                                 <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
			                                     <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; padding-top: 5px; vertical-align: top; margin: 0; text-align: right;" valign="top">&mdash; <b>OrgBoat´s</b> - Team</td>
			                                 </tr>
			                             </table>
			                         </td>
			                     </tr>
			                 </table>
			                         </div>`,
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                res.json({
                  ok: false,
                });
                console.log(error);
              } else {
                res.json({
                  ok: true,
                });
              }
            });
          }
        ); //closes Insert New Usr Into Table
      } else {
        res.json({
          ok: false,
        });
      }
    }
  );
};

const verifyEmail = (req, res, email, uuid) => {
  transporter;
  var mailOptions = {
    from: "noreply@orgboat.info", //replace with your email
    to: email, //replace with your email
    subject: `Orgboat : Verify Email:`,
    html:
      `<div class="col-md-12">
<table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #eaf0f7; margin: 0;" bgcolor="#eaf0f7">
    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
        <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
        <td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;"
            valign="top">
            <div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 50px; 0">
                <table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px dashed #4d79f6;" bgcolor="#fff">
                       <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                       <td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
                       <meta itemprop="name" content="Confirm Email" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                       <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                       <tr>
                       <td><a href="#"><img src="https://orgboat.herokuapp.com/media/imgs/blue_helm2.png" alt="" style="margin-left: auto; margin-right: auto; margin-bottom: 20px; display:block; height: 50px;"></a></td>
                       </tr>
                       <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
 					   <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; color: #0a80ff; font-size: 24px; font-weight: 700; text-align: center; vertical-align: top; margin: 0; padding: 0 0 10px;" valign="top">OrgBoat</td>
                       </tr>
                       <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                       <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; color: #3f5db3; font-size: 14px; vertical-align: top; margin: 0; padding: 10px 10px;" valign="top">` +
      email +
      `</td>
                       </tr>
                       <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                       <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 10px 10px;" valign="top">Please click the following link to verify your email.</td>
                       </tr>
                       <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                       <td class="content-block" itemprop="handler" itemscope itemtype="http://schema.org/HttpActionHandler" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 10px 10px;"
                                        valign="top"><a href="https://orgboat.me/verMail?uuid=` +
      uuid +
      `&em=` +
      email +
      `" itemprop="url" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: block; border-radius: 5px; text-transform: capitalize; background-color: #0a80ff; margin: 0; border-color: #0a80ff; border-style: solid; border-width: 10px 20px;">Verify Email Address.</a></td>
                                </tr>
                                <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                    <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; padding-top: 5px; vertical-align: top; margin: 0; text-align: right;" valign="top">&mdash; <b>OrgBoat´s</b> - Team</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                        </div>
				 `,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.render("pages/sec/response", {
        opt1: "Please try again.",
        opt2: "Error",
      });
    } else {
      res.render("pages/sec/response", {
        opt1: "Please check your inbox to verify your email.",
        opt2: "Sent Successfully",
      });
    }
  });
};

exports.verifyEmail = verifyEmail;
