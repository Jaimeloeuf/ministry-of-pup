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
 * Updates appointment time of an existing appointment
 * @name POST /appointment/reschedule/:appointmentID
 * @returns Sucess indicator
 */
router.post(
  "/reschedule/:appointmentID",
  verifyRecaptcha,
  express.json(),
  asyncWrap(async (req, res) => {
    const appointmentID = req.params.appointmentID;
    const newTimeslot = req.body.time;

    const docRef = await fs.collection("appointments").doc(appointmentID);

    // Update the time and add a prop to denote that this appointment has been rescheduled before
    await docRef.update({ time: newTimeslot, rescheduled: true });

    const doc = await docRef.get().then((snapshot) => snapshot.data());

    // Update google calendar event
    await require("../utils/GoogleCalendar.js").updateEvent(
      doc.googleCalendarEventID,
      newTimeslot
    );

    // Notify admins about new appointment using the telegram notification bot
    require("../utils/tAdminNotification.js")(`<b>Appointment Rescheduled</b>

${require("../utils/getTimeString.js")(newTimeslot)}
User: <b>${doc.fname}</b>
ID: <i>${appointmentID}</i>`);

    res.status(200).json({});
  })
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
