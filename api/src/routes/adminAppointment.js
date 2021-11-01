/**
 * Express Router for admin to's create and cancel appointments
 * Mounted on /admin/appointment
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
  "/book",
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
 * @name POST /admin/appointment/cancel/:appointmentID
 * @returns Sucess indicator
 */
router.post(
  "/cancel",
  express.json(),
  asyncWrap(async (req, res) =>
    require("../utils/cancelAppointment.js")(req.params.appointmentID).then(
      () => res.status(200).json({})
    )
  )
);

module.exports = router;
