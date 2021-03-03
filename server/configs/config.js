// ============================
//  ENVIRONMENT
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ============================
// URL FRONT-END
// ============================
let urlFront;
if (process.env.NODE_ENV === "dev") {
  urlDB = "http://localhost:3000";
  urlMAIL = "http://localhost:5000";
} else {
  urlDB = process.env.URL_FRONT;
  urlMAIL = process.env.URL_FRONT;
}
process.env.URL_FRONT = urlFront;

module.exports = {
  llave: "miclaveultrasecreta123*",
};
sessionName = "SESSION_ID";
secretKey = "MYSECRETKEYDSAFGEWHWEfenig23974ovuwyfbhkjfvvfuo";
//DB
DB_HOST = "y0nkiij6humroewt.cbetxkdyhwsb.us-east-1.rds.amazonaws.com";
DB_USER = "zwe4df04sf0pb5h8";
DB_PASS = "wel73mofval4ua95";
DB_PORT = "3306";
DB_DATABASE = "v0mgbm8nfthxqwz1";
//google auth
CLIENTID = "607767999750-f6d55nj3fpip31ovh1ml6n4p1sq499i3.apps.googleusercontent.com";
CLIENTSECRET = "k0y5AVknuSUpBNMXndAmAVHZ";
CALLBACKURL = "/auth/google/callback";

AUTHUSER ="cleaker6@gmail.com";
AUTHPASS = "8p&6%gPYqFsf";
