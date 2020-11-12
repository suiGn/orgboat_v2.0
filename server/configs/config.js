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
} else {
  urlDB = process.env.URL_FRONT;
}
process.env.URL_FRONT = urlFront;

module.exports = {
  llave: "miclaveultrasecreta123*",
};
sessionName = "SESSION_ID";
secretKey = "MYSECRETKEYDSAFGEWHWEfenig23974ovuwyfbhkjfvvfuo";
