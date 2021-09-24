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

// Function to check if item with "itemID" is a controlled item
const isControlledItem = async (itemID) =>
  (await fs.collection("controlled-items").doc(itemID).get()).exists;

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
  "/",
  express.json(),
  asyncWrap(async (req, res) => {
    const { uid } = req.authenticatedUser;

    // Ensure user's email is verified

    // Set admin privilege on the user corresponding to uid
    await admin.auth().setCustomUserClaims(uid, { admin: true });

    // @todo store which fire station it is taken from
    await fs.collection("events").add({
      // Store time item was taken in unix seconds (this is the time of the server executing the code)
      time: unixseconds(),

      item,
      quantity,
      user,
    });

    if (await isControlledItem(item)) {
      // Get the list of emails from DB of admins that needs to be notified when a controlled item is checked out
      const docs = await fs.collection("controlled-items-notification").get();

      // Send out emails 1 by 1 to all accounts and wait for all mail to complete
      await Promise.all(
        docs.docs.map((doc) =>
          // @todo Use email template instead, or consider https://www.open.gov.sg/products/postman/
          sendMail.send({
            to: doc.data().email,
            from: process.env.notificationEmailSender,
            subject: "Ministry Of Pup: Controlled item checked out!",
            html:
              "Hello admin!<br /><br />" +
              // @todo Might change this, as this might be interpolated into locale time, so depends on server location
              `Date and Time: ${new Date()}<br />` +
              // @todo Fix this once item name added
              `Controlled item name: ${null}<br />` +
              `Controlled item ID: ${item}<br />` +
              // @todo Fix this once description of controlled item added
              `Description: ${null}<br />`,
          })
        )
      );
    }

    res.status(200).json({ ok: true });
  })
);

module.exports = router;
