/**
 * Express Router for handling appointments
 * Mounted on /appointment
 * @author JJ
 * @module take routes
 */

const express = require("express");
const router = express.Router();
const fs = require("../utils/fs");
const { asyncWrap } = require("express-error-middlewares");
const { DateTime } = require("luxon");

/**
 * Creates an account for the user if it does not already exists, and book a appointment
 * @name GET /appointment/scheduled
 * @returns Sucess indicator
 */
router.get(
  "/",
  asyncWrap(async (req, res) => {
    // Query DB for appointments that end after a given time (defaults to current time in SGT)
    // Always returns an Array, regardless if there are any appointments in it
    // Appointments timestamps are stored as unix time Milliseconds
    const after = req.query.after
      ? DateTime.fromMillis(parseInt(req.query.after)).setZone("Asia/Singapore")
      : DateTime.now().setZone("Asia/Singapore");

    // https://cloud.google.com/firestore/docs/query-data/queries#limitations
    // Because of the limitations of the != operator, we cannot filter out
    // cancelled appointments directly using the query, thus need to filter out after getting back the document
    // It isn't too bad since there will probably not be so many cancelled appointments within the timeframe
    const snapshot = await fs
      .collection("appointments")
      .where("time", ">=", after.toMillis())
      .get();

    res.status(200).json({
      ok: true,

      // If snapshot is empty, return an empty array, else,
      // Map the array of doc references to an array of doc data and doc ID
      // Filter out cancelled appointments
      // Reduce into a single object keyed by appointment ID
      appointments: snapshot.empty
        ? {}
        : snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((doc) => doc.cancelled !== true)
            // Possibly faster implementation?
            // .reduce((acc, curr) => {
            //   acc[curr.id] = curr;
            //   return acc;
            // }, {})
            .reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
    });
  })
);

module.exports = router;
