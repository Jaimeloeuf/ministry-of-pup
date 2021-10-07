/**
 * Express Router for user RBAC (Role Based Access Control) permissions
 * Mounted on /rbac
 * @author JJ
 * @module rbac routes
 */

const express = require("express");
const router = express.Router();
const sendMail = require("../utils/sendMail");
const fs = require("../utils/fs");
const unixseconds = require("unixseconds");
const { asyncWrap } = require("express-error-middlewares");

// Set admin privilege on the user corresponding to uid.
// admin
// .auth()
// .setCustomUserClaims("SNK5kyw3I0hcHvy0TQr5ETzrNZC3", { isAdmin: true })
// .then(() => {
//   // The new custom claims will propagate to the user's ID token the
//   // next time a new one is issued.
// });

// Verify the ID token first.
// admin
//   .auth()
//   .verifyIdToken(idToken)
//   .then((claims) => {
//     if (claims.isAdmin === true) {
//       // Allow access to requested admin resource.
//     }
//   });

// // Lookup the user associated with the specified uid.
// admin
//   .auth()
//   .getUser(uid)
//   .then((userRecord) => {
//     // The claims can be accessed on the user record.
//     console.log(userRecord.customClaims["isAdmin"]);
//   });

/**
 * Take an item, storing (what, who, when, why)
 * @name POST /rbac/give-admin-access
 * @returns Sucess indicator
 */
router.post(
  "/give-admin-access",
  express.json(),
  asyncWrap(async (req, res) => {
    const { uid } = req.authenticatedUser;

    // Ensure user's email is verified

    // Set admin privilege on the user corresponding to uid
    await admin.auth().setCustomUserClaims(uid, { admin: true });

    await fs.collection("events").add({
      // Store time item was taken in unix seconds (this is the time of the server executing the code)
      time: unixseconds(),

      item,
      quantity,
      user,
    });

    res.status(200).json({ ok: true });
  })
);

module.exports = router;
