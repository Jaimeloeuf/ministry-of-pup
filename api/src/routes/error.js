/**
 * Express Router for error related routes
 * Mounted on /error
 * @author JJ
 * @module Error routes
 */

const express = require("express");
const router = express.Router();
const { asyncWrap } = require("express-error-middlewares");

const fs = require("../utils/fs");

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
    const errorDoc = await fs
      .collection("errors")
      .add({ error, description, time });

    // Construct the error message
    const message =
      `Hello developer, new error '${time}' has been reported to the API!\n\n` +
      `Error ID: ${errorDoc.id}\n` +
      `Error: ${error}\n` +
      `Description: ${description}\n`;

    // @todo Send telegram message via telegram bot to notify developers of error
    // Get the telegram chat ID from env
    process.env.developer_telegram_chat_id;

    res.status(201).json({ ok: true });
  })
);

module.exports = router;
