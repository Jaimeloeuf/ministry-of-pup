/**
 * Express Router for handling appointments
 * Mounted on /appointment
 * @author JJ
 * @module take routes
 */

const express = require("express");
const router = express.Router();
const sendMail = require("../utils/sendMail");
const fs = require("../utils/fs");
const verifyRecaptcha = require("../utils/verifyRecaptcha");
const unixseconds = require("unixseconds");
const { asyncWrap } = require("express-error-middlewares");

const { getUserAccountIdIfExists } = require("../utils/getUserAccount");
const { createUserAccount } = require("../utils/createUserAccount");

const emailString = (name, timeString, appointmentID) =>
  `Hey ${name}!

Your appointment has been scheduled successfully, and our puppies can't wait to see you on ${timeString}!

Location
https://goo.gl/maps/Jw9MpEPx9cuuGVGDA

Carpark slots are available! Here is a map of the carpark slot and how to get to us from there.
https://goo.gl/maps/UAcHeKbps4EyH4by7

Nearest MRT is Outram Park (EW16 / NE3)

Public transport from Outram Park
https://goo.gl/maps/zB2oUzyMxFnAoBABA

Walking over from Outram Park
https://goo.gl/maps/WQe1cVQo5d8Ztgz76

-----

In the event where your schedule got blocked up and you need to cancel your appointment. Click on the link below!
https://booking.ministryofpup.com/#/cancel/${appointmentID}

-----

Whatsapp us through https://wa.me/6588022177

Email us at ministryofpup@gmail.com

Or call us at 8802,2177 daily between 10am - 8pm for help`;

const getTimeString = (time) =>
  new Intl.DateTimeFormat("en-SG", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Singapore",
  }).format(new Date(time));

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
    const { time, fname, lname, email, preference } = req.body;

    // Remove all white space from phone number
    const number = req.body.number.replace(" ", "");

    // Get the user ID either from an existing account, or from a newly created account
    const userID =
      (await getUserAccountIdIfExists(number)) ||
      (await createUserAccount({ fname, lname, number, email }));

    // Lazily import this to keep serverless container start up time fast as this is not always used
    const { createAndInsertEvent } = require("../utils/GoogleCalendar");

    // @todo Handle on failure and still store appointment into DB + notify developer
    // Get the event ID back and store it to programmatically delete or modify it later on if needed
    // Add appointment event to google cal first to get back the event ID to store in appointment doc
    // However by doing this first, means that the appointment ID cannot be added into the description
    // https://developers.google.com/calendar/api/v3/reference/events#id
    const googleCalendarEventID = await createAndInsertEvent({
      start: time,

      summary: `Appointment with ${fname}`,
      description: "Checkout this appointment in the admin portal",
      // Cannot do the below now because, the appointmentID is not generated before google cal insert....
      // description: `Checkout this appointment in the admin portal\nhttps://admin.ministryofpup.com/#/appointment/${appointmentID}`,
      // description: `AppointmentID: ${appointmentID}\nPortal's link`,
    });

    const { id: appointmentID } = await fs.collection("appointments").add({
      user: userID,

      // Although the `googleCalendarEventID` can be used as the doc ID for appointments, it is safer because,
      // 1. If google calendar API call failed, the appointment data should still be stored
      // 2. If there is ever a time to store appointment directly into the DB its easier to let firestore auto generate
      // 3. It is better to keep these 2 seperate and not have our appointments DB rely on google cal for doc ID
      googleCalendarEventID,

      time,
      fname,
      lname,
      number,
      email,
      preference,

      // Store time appointment was created in unix seconds (this is the time of the server executing the code)
      createdAt: unixseconds(),
    });

    const timeString = getTimeString(time);

    // Send user a email to confirm with them that their appointment has been scheduled successfully
    // @todo Copy over the stuff from whats added into the user's google calendar
    await sendMail.send({
      to: email,
      from: process.env.notificationEmailSender,
      subject: `Ministry Of Pup: Appointment booked for ${timeString}!`,
      text: emailString(fname, timeString, appointmentID),
    });

    // await sendMail.send({
    //   to: email,
    //   from: process.env.notificationEmailSender,
    //   templateId: "d-a9b0fbf8e5004f76955df83d36efcab3",
    //   dynamicTemplateData: { timeString },
    // });

    // Notify admins about new appointment using the telegram notification bot
    const notifyAdmin = require("../utils/tAdminNotification.js");
    notifyAdmin(`<b>New appointment</b>
   
${timeString}
User: <b>${fname}</b>
ID: <i>${appointmentID}</i>`);

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

    // Lazily import this to keep serverless container start up time fast as this is not always used
    const { deleteEvent } = require("../utils/GoogleCalendar");

    const docData = doc.data();
    await deleteEvent(docData.googleCalendarEventID);

    // Notify admins about new appointment using the telegram notification bot
    const notifyAdmin = require("../utils/tAdminNotification.js");
    notifyAdmin(`<b>Appointment cancelled</b>
   
${getTimeString(docData.time)}
User: <b>${docData.fname}</b>
ID: <i>${doc.id}</i>`);

    res.status(200).json({ ok: true });
  })
);

module.exports = router;
