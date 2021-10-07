const { google } = require("googleapis");

function getConfig() {
  // @todo Might not need this anymore
  require("dotenv").config();

  // @todo Fix this before deployment, see if can use ADC somehow?
  // Alternatively, just store client_email and private_key value from service account in env instead of the whole service acc key
  // See the logic in ekd/fs-admin to see how to get the ADC out

  // Get credentials from service account file
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
// Returns google calendar event ID if succeeded and throws error if failed
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

    // Returns the google calendar ID
    // Instead of letting user pass in their own IDs as its hard to generate IDs of this format
    // https://developers.google.com/calendar/api/v3/reference/events#id
    return res.data.id;
  } catch (error) {
    console.error(`Error at insertEvent --> ${error}`);

    // Rethrow error to let API server handle it
    throw error;
  }
}

// Event for Google Calendar
// End datetime can be left blank to be auto set to 1 hour or 30 mins from start time
function createEvent({ summary, description, start, end }) {
  /* Ensure both start and end time are valid */
  // Start time accepts either a date object or a Unix time stamp in seconds
  start = start instanceof Date ? start : new Date(start * 1000);

  // Default time of an appointment is 30 minutes
  // end = new Date(end || new Date(start).setHours(start.getHours() + 1));
  end = new Date(end || new Date(start).setMinutes(start.getMinutes() + 30));

  return {
    summary,
    description,

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

const createAndInsertEvent = async ({ summary, description, start, end }) =>
  insertEvent(createEvent({ summary, description, start, end }));

// Delete the event with id of `eventID`
// Returns true if succeeded and throws error if failed
async function deleteEvent(eventId) {
  try {
    const res = await google.calendar({ version: "v3" }).events.delete({
      ...getConfig(),

      eventId: eventId,
    });

    if (res.data === "") return true;

    throw new Error(`Google calendar event is not deleted: ${res.data}`);
  } catch (error) {
    console.error(`Error at deleteEvent --> ${error}`);

    // Rethrow error to let API server handle it
    throw error;
  }
}

module.exports = {
  createAndInsertEvent,
  createEvent,
  insertEvent,
  deleteEvent,
};

// @todo UNUSED, just left here in case next time can use
// Get all the events between two dates
// async function getEvents(
//   dateTimeStart = "2021-11-03T00:00:00.000Z",
//   dateTimeEnd = "2021-11-04T00:00:00.000Z"
// ) {
//   const res = await google.calendar({ version: "v3" }).events.list({
//     ...getConfig(),

//     timeMin: dateTimeStart,
//     timeMax: dateTimeEnd,
//   });

//   return res["data"]["items"];
// }
