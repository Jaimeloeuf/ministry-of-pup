const { google } = require("googleapis");

function getConfig() {
  // @todo Might not need this anymore
  require("dotenv").config();

  // @todo Fix this before deployment, see if can use ADC somehow?
  // Alternatively, just store client_email and private_key value from service account in env instead of the whole service acc key
  // See the logic in ekd/fs-admin to see how to get the ADC out

  // Get credentials from service account file
  const { client_email, private_key } = require("../../serviceAccountKey.json");

  // @todo To migrate to use env var instead of having the file inside the docker container directly
  // const { client_email, private_key } = process.env;

  return {
    calendarId: "ministryofpup@gmail.com",

    auth: new google.auth.JWT(
      client_email,
      null,
      private_key,
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
  // Start needs to be a Unix time stamp in Milliseconds
  start = new Date(start);

  // End defaults to 1 hour after start datetime or a Unix time stamp in Milliseconds should be used
  // Wrapped in a new Date to ensure that 'end' is in this format 2021-11-25T07:00:00.000Z
  end = new Date(end || new Date(start).setHours(start.getHours() + 1));

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

// Update the event with id of `eventID`
// Returns true if succeeded and throws error if failed
async function updateEvent(eventId, newTimeslot) {
  try {
    const res = await google.calendar({ version: "v3" }).events.patch({
      ...getConfig(),

      eventId,
      resource: createEvent({ start: newTimeslot }),
    });

    if (res.status !== 200)
      throw new Error(`Update event status code: ${res.status}`);
    if (res.statusText !== "OK")
      throw new Error(`Update event status: ${res.statusText}`);

    return true;
  } catch (error) {
    console.error(`Error at updateEvent --> ${error}`);

    // Rethrow error to let API server handle it
    throw error;
  }
}

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
  updateEvent,
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
