/**
 * Express Router for analytics
 * Mounted on /analytics
 * @author JJ
 * @module analytics routes
 */

const express = require("express");
const router = express.Router();
const { asyncWrap } = require("express-error-middlewares");

/**
 * Get number of appointment for each appointment source type
 * @name GET /analytics/appointment/source
 * @returns Sucess indicator and appointment source breakdown
 */
router.get(
  "/appointment/source",
  asyncWrap(async (req, res) => {
    const sources = { ...require("mop-appointment-src") };
    for (const key in sources) sources[key] = 0;

    await require("../../utils/fs")
      .collection("appointments")
      .get()
      .then((snapshot) => snapshot.docs.map((doc) => doc.data().src))
      .then((srcs) => srcs.forEach((src) => (sources[src] += 1)));

    res.status(200).json({ sources });
  })
);

module.exports = router;
