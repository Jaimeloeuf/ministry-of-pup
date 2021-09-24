/**
 * Express Router for new item taken API
 * Mounted on /take
 * @author JJ
 * @module take routes
 */

const express = require("express");
const router = express.Router();
const sendMail = require("../utils/sendMail");
const fs = require("../utils/fs");
const unixseconds = require("unixseconds");
const { asyncWrap } = require("express-error-middlewares");
const FieldValue = require("firebase-admin").firestore.FieldValue;
// const incrementInstruction = FieldValue.increment(1);
const decrementInstruction = FieldValue.increment(-1);

// Function to check if item with "itemID" is a controlled item
const isControlledItem = async (itemID) =>
  (await fs.collection("controlled-items").doc(itemID).get()).exists;

/**
 * Take an item, storing (what, who, when, why)
 * @name POST /take
 * @returns Sucess indicator
 */
router.post(
  "/",
  express.json(),
  asyncWrap(async (req, res) => {
    // @todo Validate inputs
    // Read item, user and reason for reporting from request body
    const { item, quantity, user } = req.body;

    // Check if the item is a valid item in DB

    /* Atomic batched writes to reduce item quantity and save event */
    // https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes

    // Get a new write batch
    // const batch = fs.batch();

    // // Get doc using itemID and decrement its quantity
    // const itemDocRef = fs.collection("items").doc(item);
    // batch.update(itemDocRef, { left: decrementInstruction });

    // // Get ref to events collection and add new document
    // const eventColRef = fs.collection("events");
    // batch.add(eventColRef, {
    //   item,
    //   quantity,
    //   user,

    //   // Store time item was taken in unix seconds (this is the time of the server executing the code)
    //   time: unixseconds(),

    //   // Strip white spaces from both end of reason string
    //   // reason: reason.trim(),
    // });

    // // Commit atomic batch write and wait for completion
    // await batch.commit();

    // @todo store which fire station it is taken from
    await fs.collection("events").add({
      item,
      quantity,
      user,

      // Store time item was taken in unix seconds (this is the time of the server executing the code)
      time: unixseconds(),

      // Strip white spaces from both end of reason string
      // reason: reason.trim(),
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
              // @todo Might add user's contact info
              `Checked out by: ${user}<br />` +
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
