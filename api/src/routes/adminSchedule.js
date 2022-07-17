/**
 * Express Router to handle requests for reading and updating store's opening time and blocked dates
 * Mounted on /admin/schedule
 * @author JJ
 * @module Admin schedule routes
 */

const express = require("express");
const router = express.Router();
const fs = require("../utils/fs");
const { asyncWrap } = require("express-error-middlewares");

/**
 * Get opening hours and blocked dates if any
 * @name GET /admin/schedule
 * @returns Sucess indicator and a list of opening times and a list of blocked dates
 */
router.get(
  "/",
  asyncWrap(async (req, res) => {
    // Get the opening and closing time from DB as Milliseconds offset from 0 where 0 is start of day
    // This only gets and reads a single Doc from DB as all the opening time for the entire week,
    // is stored in a single doc to make it cheaper to access repeatedly as Firestore charge by docs read
    // Day of the weeks are Mon to Sun, mapped to 1 to 7
    const openingTime = await fs
      .collection("openingHours")
      .doc("openingHours")
      .get()
      .then((snapshot) => snapshot.data());

    // Get the blocked dates along with the doc IDs so that the admin can use them for deletion if needed later.
    const getBlockedDates = require("../utils/getBlockedDates.js");
    const blockedDates = await getBlockedDates(true).then((docs) =>
      docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );

    res.status(200).json({ openingTime, blockedDates });
  })
);

/**
 * Set opening time
 * @name POST /admin/schedule/opening
 * @returns Sucess indicator
 */
router.post(
  "/opening",
  express.json(),
  asyncWrap(async (req, res) => {
    // NEED TO SET THE FULL ARRAY back if not will get overwritten
    // Because firebase update will replace an entire existing array
    await fs.collection("openingHours").doc("openingHours").update(req.body);

    res.status(200).json({});
  })
);

/**
 * Add blocked dates
 * @name POST /admin/schedule/block
 * @returns Sucess indicator
 */
router.post(
  "/block",
  express.json(),
  asyncWrap(async (req, res) => {
    // @todo When setting blocked dates, must ensure that the date is not already booked

    // Simple check for request body value type
    if (!Array.isArray(req.body.dates))
      return res
        .status(400)
        .json({ error: "Invalid 'dates' array field in req body" });

    const colRef = fs.collection("blockedDates");
    const { DateTime } = require("luxon");

    req.body.dates.map((date) =>
      colRef.add({
        startOfDay:
          // Take date in the format of "2022-06-23", ensure that it is set to SGT,
          // and reset it to start of day and get it in milliseconds to store
          DateTime.fromISO(date)
            .setZone("Asia/Singapore")
            .startOf("day")
            .toMillis(),
      })
    );

    res.status(200).json({});
  })
);

/**
 * Delete a single blocked date with the given firestore docID.
 * Using POST method to get around CORS requirements.
 * @name POST /admin/schedule/blocked-date/delete/:docID
 * @returns Sucess indicator
 */
router.post(
  "/blocked-dates/delete/:docID",
  asyncWrap(async (req, res) =>
    fs
      .collection("blockedDates")
      .doc(req.params.docID)
      .delete()
      .then(() => res.status(200).json({}))
      .catch((error) => res.status(500).json({ error }))
  )
);

module.exports = router;
