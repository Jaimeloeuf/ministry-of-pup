/**
 * Express Router for admin to enter a new appointment into the system
 * Mounted on /admin/appointment/book
 * @author JJ
 * @module Admin appointment routes
 */

const express = require("express");
const router = express.Router();
const { asyncWrap } = require("express-error-middlewares");

/**
 * Creates an account for the user if it does not already exists, and book a appointment
 * @name POST /admin/appointment/book
 * @returns Sucess indicator
 */
router.post(
  "/",
  express.json(),
  asyncWrap(async (req, res) =>
    require("../utils/bookAppointment")(req.body).then((appointmentID) =>
      res.status(200).json({ ok: true, appointmentID })
    )
  )
);

module.exports = router;
