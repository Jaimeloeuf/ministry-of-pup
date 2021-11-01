/**
 * Express Router for Contact Us form in landing page
 * Mounted on /contact-us-form
 * @author JJ
 * @module Contact Us Form API
 */

const express = require("express");
const router = express.Router();
const { asyncWrap } = require("express-error-middlewares");
const verifyRecaptcha = require("../utils/verifyRecaptcha");

/**
 * @name POST /contact-us-form
 * @returns {object} success indicator
 */
router.post(
  "/",
  verifyRecaptcha,
  express.json(),
  asyncWrap(async (req, res) => {
    const { fname, lname, number, email, message } = req.body;

    // Notify developers about error using the telegram notification bot
    const notifyAdmin = require("../utils/tAdminNotification.js");
    notifyAdmin(`<b>ContactForm</b>

${new Intl.DateTimeFormat("en-SG", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Asia/Singapore",
}).format(new Date())}
Name: ${lname} ${fname}
Number: ${number}
Email: ${email}
Message: ${message | ""}`);

    res.status(201).json({ ok: true });
  })
);

module.exports = router;
