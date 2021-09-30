const { google } = require("googleapis");

function getConfig() {
  // @todo Might not need this anymore
  require("dotenv").config();

  // Get credentials from service account file
  const CREDENTIALS = require("../../serviceAccountKey.jsonjson");

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
async function insertEvent(event) {
  try {
    const response = await google.calendar({ version: "v3" }).events.insert({
      ...getConfig(),

      resource: event,
    });

    if (response["status"] == 200 && response["statusText"] === "OK")
      return true;
    else return false;
  } catch (error) {
    console.log(`Error at insertEvent --> ${error}`);
    return false;
  }
}

// Event for Google Calendar
// End datetime can be left blank to be auto set to 1 hour or 30 mins from start time
const createEvent = ({ appointmentID, userFname, start, end }) => ({
  summary: `Appointment #${appointmentID} with ${userFname}`,
  description: `Attach the portal's link over here`,

  // Time zone must be included to ensure it appears in calendar correctly
  start: {
    dateTime: start,
    timeZone: "Asia/Singapore",
  },
  end: {
    // dateTime: new Date(end || new Date(start).setHours(start.getHours() + 1)),
    dateTime: new Date(
      end || new Date(start).setMinutes(start.getMinutes() + 30)
    ),
    timeZone: "Asia/Singapore",
  },
});

const createAndInsertEvent = async ({ appointmentID, userFname, start, end }) =>
  insertEvent(createEvent({ appointmentID, userFname, start, end }));

module.exports = { createAndInsertEvent, createEvent, insertEvent };
