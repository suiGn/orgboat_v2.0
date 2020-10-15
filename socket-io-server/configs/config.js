// ============================
//  ENVIRONMENT
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ============================
// URL FRONT-END
// ============================
let urlFront;
if (process.env.NODE_ENV === "dev") {
  urlDB = "http://127.0.0.1:3000";
} else {
  urlDB = process.env.URL_FRONT;
}
process.env.URL_FRONT = urlFront;

module.exports = {
  llave: "miclaveultrasecreta123*",
};
