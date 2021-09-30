const { google } = require("googleapis");

function getConfig() {
  // @todo Might not need this anymore
  require("dotenv").config();

  // Get credentials from service account file
  // @todo Fix this before deployment, see if can use ADC somehow?
  const CREDENTIALS = require("../../serviceAccountKey.json");

  return {
    calendarId: "ministryofpup@gmail.com",

    auth: new google.auth.JWT(
      CREDENTIALS.client_email,
      null,
      CREDENTIALS.private_key,
      "https://www.googleapis.com/auth/calendar"
    ),
  };
}

// Insert new event to Google Calendar
// Returns nothing if succeeded and throws error if failed
async function insertEvent(event) {
  try {
    const res = await google.calendar({ version: "v3" }).events.insert({
      ...getConfig(),

      resource: event,
    });

    if (res.status !== 200)
      throw new Error(`Insert event status code: ${res.status}`);
    if (res.statusText !== "OK")
      throw new Error(`Insert event status: ${res.statusText}`);
  } catch (error) {
    console.log(`Error at insertEvent --> ${error}`);

    // Rethrow error to let API server handle it
    throw error;
  }
}

// Event for Google Calendar
// End datetime can be left blank to be auto set to 1 hour or 30 mins from start time
function createEvent({ appointmentID, userFname, start, end }) {
  /* Ensure both start and end time are valid */
  // Start time accepts either a date object or a Unix time stamp in seconds
  start = start instanceof Date ? start : new Date(start * 1000);

  // end = new Date(end || new Date(start).setHours(start.getHours() + 1));
  end = new Date(end || new Date(start).setMinutes(start.getMinutes() + 30));

  return {
    summary: `Appointment with ${userFname}`,
    description: `AppointmentID: ${appointmentID}\n Portal's link`,

    // Time zone is fixed to SGT and included to ensure events appear in calendar correctly
    start: {
      dateTime: start,
      timeZone: "Asia/Singapore",
    },
    end: {
      dateTime: end,
      timeZone: "Asia/Singapore",
    },
  };
}

const createAndInsertEvent = async ({ appointmentID, userFname, start, end }) =>
  insertEvent(createEvent({ appointmentID, userFname, start, end }));

module.exports = { createAndInsertEvent, createEvent, insertEvent };
