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
 * @name POST /appointment/book
 * @returns Sucess indicator
 */
router.post(
  "/book",
  verifyRecaptcha,
  express.json(),
  asyncWrap(async (req, res) => {
    // Remove all white space from phone number
    req.body.number = req.body.number.replace(" ", "");

    const appointmentID = await require("../utils/bookAppointment")(req.body);

    // appointmentID is returned so that the booking app can generate the calendar event,
    // with a link for cancelling appointment using this appointmentID
    res.status(200).json({ ok: true, appointmentID });
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
  asyncWrap(async (req, res) => {
    const { appointmentID } = req.params;

    const docRef = fs.collection("appointments").doc(appointmentID);

    // Keeping user data for future use and analytics, just adding a cancelled field
    await docRef.update({ cancelled: true });

    // Get the `googleCalendarEventID` from doc to delete the event from google calendar
    const doc = await docRef.get();
    if (!doc.exists) throw new Error("Appointment does not exist in DB");

    const docData = doc.data();

    // Lazily import this to keep serverless container start up time fast as this is not always used
    await require("../utils/GoogleCalendar").deleteEvent(
      docData.googleCalendarEventID
    );

    // Notify admins about new appointment using the telegram notification bot
    const notifyAdmin = require("../utils/tAdminNotification.js");
    notifyAdmin(`<b>Appointment cancelled</b>
   
${require("../utils/getTimeString.js")(docData.time)}
User: <b>${docData.fname}</b>
ID: <i>${doc.id}</i>`);

    res.status(200).json({ ok: true });
  })
);

module.exports = router;
