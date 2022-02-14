module.exports = require("./authz.js")(
  require("firebase-admin"),
  (claims) => claims.admin
);
