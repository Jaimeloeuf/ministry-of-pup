const fs = require("../utils/fs");
const { deleteEvent } = require("../utils/GoogleCalendar");
const notifyAdmin = require("../utils/tAdminNotification.js");

/**
 * Cancel an existing appointment and delete the event in google calendar.
 */
module.exports = async function (appointmentID) {
  const docRef = fs.collection("appointments").doc(appointmentID);

  // Keeping user data for future use and analytics, just adding a cancelled field
  await docRef.update({ cancelled: true });

  // Get the `googleCalendarEventID` from doc to delete the event from google calendar
  const doc = await docRef.get();
  if (!doc.exists) throw new Error("Appointment does not exist in DB");

  const docData = doc.data();

  // Lazily import this to keep serverless container start up time fast as this is not always used
  await deleteEvent(docData.googleCalendarEventID);

  // Notify admins about new appointment using the telegram notification bot
  notifyAdmin(`<b>Appointment cancelled</b>
  
${require("../utils/getTimeString.js")(docData.time)}
User: <b>${docData.fname}</b>
ID: <i>${doc.id}</i>`);
};
