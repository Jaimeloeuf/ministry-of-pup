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

    const blockedDates = await fs
      .collection("openingHours")
      .doc("blockedDates")
      .get()
      .then((snapshot) => snapshot.data());

    res.status(200).json({ ok: true, openingTime, blockedDates });
  })
);

module.exports = router;
