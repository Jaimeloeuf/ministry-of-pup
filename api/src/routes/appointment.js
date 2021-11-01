/**
 * Express Router for handling appointments
 * Mounted on /appointment
 * @author JJ
 * @module take routes
 */

const express = require("express");
const router = express.Router();
const fs = require("../utils/fs");
const verifyRecaptcha = require("../utils/verifyRecaptcha");
const { asyncWrap } = require("express-error-middlewares");

/**
 * Creates an account for the user if it does not already exists, and book a appointment
 *
 * appointmentID is returned so that the booking app can generate the calendar event,
 * with a link for cancelling appointment using this appointmentID
 *
 * @name POST /appointment/book
 * @returns Sucess indicator and appointmentID
 */
router.post(
  "/book",
  verifyRecaptcha,
  express.json(),
  asyncWrap(async (req, res) =>
    require("../utils/bookAppointment.js")(req.body).then((appointmentID) =>
      res.status(200).json({ ok: true, appointmentID })
    )
  )
);

/**
 * Cancel an existing appointment and delete the event in google calendar.
 * This is a POST request instead of a DELETE request to not deal with handling CORS preflight request for DELETE methods.
 * @name POST /appointment/cancel/:appointmentID
 * @returns Sucess indicator
 */
router.post(
  "/cancel/:appointmentID",
  verifyRecaptcha,
  asyncWrap(async (req, res) =>
    require("../utils/cancelAppointment.js")(req.params.appointmentID).then(
      () => res.status(200).json({})
    )
  )
);

module.exports = router;
