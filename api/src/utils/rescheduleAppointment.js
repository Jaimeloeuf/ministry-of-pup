const fs = require("./fs");
const { updateEvent } = require("./GoogleCalendar.js");
const sendMail = require("./sendMail");
const getTimeString = require("./getTimeString.js");
const notifyAdmin = require("./tAdminNotification.js");

const emailString = (name, time, timeString, appointmentID) =>
  `Hey ${name}!

Your appointment has been rescheduled successfully, and our puppies can't wait to see you on ${timeString}!

Location
https://goo.gl/maps/Jw9MpEPx9cuuGVGDA

Carpark slots are available! Here is a map of the carpark slot and how to get to us from there.
https://goo.gl/maps/tC2LnVXhAQ1dYSWE8

Nearest MRT is Outram Park (EW16 / NE3)

Public transport from Outram Park
https://goo.gl/maps/zB2oUzyMxFnAoBABA

Walking over from Outram Park
https://goo.gl/maps/WQe1cVQo5d8Ztgz76

-----

In the event where your schedule got blocked up and you need to reschedule your appointment. Click on the link below!
https://booking.ministryofpup.com/#/reschedule/${appointmentID}/${time}

-----

If you need to cancel your appointment. Click on the link below!
https://booking.ministryofpup.com/#/cancel/${appointmentID}

-----

Whatsapp us through https://wa.me/6588022177

Email us at ministryofpup@gmail.com

Or call us at 8802,2177 daily between 10am - 8pm for help`;

// Creates an account for the user if it does not already exists, and book a appointment
module.exports = async function rescheduleAppointment({
  appointmentID,
  newTimeslot,
}) {
  const docRef = await fs.collection("appointments").doc(appointmentID);

  // Update the time and add a prop to denote that this appointment has been rescheduled before
  await docRef.update({ time: newTimeslot, rescheduled: true });

  const doc = await docRef.get().then((snapshot) => snapshot.data());

  // Update google calendar event
  await updateEvent(doc.googleCalendarEventID, newTimeslot);

  const timeString = getTimeString(newTimeslot);

  // Notify admins about new appointment using the telegram notification bot
  notifyAdmin(`<b>Appointment Rescheduled</b>

${timeString}
User: <b>${doc.fname}</b>
ID: <i>${appointmentID}</i>`);

  // Send user a email to confirm with them that their appointment has been rescheduled successfully
  await sendMail.send({
    to: doc.email,
    from: process.env.notificationEmailSender,
    subject: `Ministry Of Pup: Appointment rescheduled to ${timeString}!`,
    text: emailString(doc.fname, newTimeslot, timeString, appointmentID),
  });

  // @todo Use sendgrid's dynamic template
  // await sendMail.send({
  //   to: email,
  //   from: process.env.notificationEmailSender,
  //   templateId: "d-a9b0fbf8e5004f76955df83d36efcab3",
  //   dynamicTemplateData: { timeString },
  // });
};
