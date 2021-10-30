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

module.exports = router;
