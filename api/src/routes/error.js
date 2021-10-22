/**
 * Express Router for error related routes
 * Mounted on /error
 * @author JJ
 * @module Error routes
 */

const express = require("express");
const router = express.Router();
const { asyncWrap } = require("express-error-middlewares");

/**
 * Register new error from client
 * @name POST /error/new/
 * @param {Object} error
 * @returns {object} success indicator
 */
router.post(
  "/new",
  express.json(),
  asyncWrap(async (req, res) => {
    const { error, description, time } = req.body;

    // Save error and time into a new doc with a random key
    // https://firebase.google.com/docs/firestore/manage-data/add-data#add_a_document
    const errorDoc = await require("../utils/fs")
      .collection("errors")
      .add({ error, description, time });

    // Notify developers about error using the telegram notification bot
    const notifyAdmin = require("../utils/tAdminNotification.js");
    notifyAdmin(`*ERROR*

${new Intl.DateTimeFormat("en-SG", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Asia/Singapore",
}).format(new Date())}
Error ID: ${errorDoc.id}
Error: ${error}
Description: ${description}`);

    res.status(201).json({ ok: true });
  })
);

module.exports = router;
