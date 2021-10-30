/**
 * Module for booking appointments. Shared by both the API for booking app and admin's new appointment API.
 */

const sendMail = require("./sendMail");
const fs = require("./fs");
const unixseconds = require("unixseconds");

const { getUserAccountIdIfExists } = require("./getUserAccount");
const { createUserAccount } = require("./createUserAccount");

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

// Creates an account for the user if it does not already exists, and book a appointment
module.exports = async function bookAppointment({
  time,
  fname,
  lname,
  number,
  email,
  ref,
  src = "BK",
  preference = null,
}) {
  // Get the user ID either from an existing account, or from a newly created account
  const userID =
    (await getUserAccountIdIfExists(number)) ||
    (await createUserAccount({ fname, lname, number, email }));

  // Lazily import this to keep serverless container start up time fast as this is not always used
  const { createAndInsertEvent } = require("./GoogleCalendar");

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
    src,

    // Store time appointment was created in unix seconds (this is the time of the server executing the code)
    createdAt: unixseconds(),
  });

  const timeString = require("./getTimeString.js")(time);

  // Send user a email to confirm with them that their appointment has been scheduled successfully
  await sendMail.send({
    to: email,
    from: process.env.notificationEmailSender,
    subject: `Ministry Of Pup: Appointment booked for ${timeString}!`,
    text: emailString(fname, timeString, appointmentID),
  });

  // @todo Use sendgrid's dynamic template
  // await sendMail.send({
  //   to: email,
  //   from: process.env.notificationEmailSender,
  //   templateId: "d-a9b0fbf8e5004f76955df83d36efcab3",
  //   dynamicTemplateData: { timeString },
  // });

  // Notify admins about new appointment using the telegram notification bot
  const notifyAdmin = require("./tAdminNotification.js");
  notifyAdmin(`<b>New appointment</b>

${timeString}
User: <b>${fname}</b>
ID: <i>${appointmentID}</i>`);

  return appointmentID;
};
