/**
 * Express Router for users to request for help
 * Mounted on /help
 * @author JJ
 * @module help route
 */

const express = require("express");
const router = express.Router();
const sendMail = require("../utils/sendMail");
const fs = require("../utils/fs");
const unixseconds = require("unixseconds");
const { asyncWrap } = require("express-error-middlewares");

/**
 * Request for help
 * @name POST /help
 * @returns Sucess indicator
 */
router.post(
  "/",
  express.json(),
  asyncWrap(async (req, res) => {
    // @todo Validate inputs
    const { user, details } = req.body;

    await fs.collection("support-tickets").add({
      // Store time of request in unix seconds (this is the time of the server executing the code)
      time: unixseconds(),

      user,
      details,
    });

    // Get the list of emails from DB of developers that needs to be notified
    const docs = await fs.collection("support-notification").get();

    // Send out emails 1 by 1 to all accounts and wait for all mail to complete
    await Promise.all(
      docs.docs.map((doc) =>
        // @todo Use email template instead
        sendMail.send({
          to: doc.data().email,
          from: process.env.notificationEmailSender,
          subject: "Ministry Of Pup: Support required!",
          html:
            "Hello admin, a new support ticket has been raised through the app!<br /><br />" +
            // @todo Might change this, as this might be interpolated into locale time, so depends on server location
            `Date and Time: ${new Date()}<br />` +
            // @todo Might add user's contact info
            `Requested by: ${user}<br />` +
            `<br />` +
            `Description: ${details}<br />`,
        })
      )
    );

    res.status(200).json({ ok: true });
  })
);

module.exports = router;
