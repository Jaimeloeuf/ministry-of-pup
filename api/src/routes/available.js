/**
 * Express Router for dealing with appointment availability
 * Mounted on /appointment/available
 * @author JJ
 * @module Appointment availability routes
 */

const express = require("express");
const router = express.Router();
const fs = require("../utils/fs");
const { asyncWrap } = require("express-error-middlewares");
const { DateTime } = require("luxon");

// Function that returns the next 5 available dates in an array,
// where each element is an object with a start and end luxon DateTime object
// Accepts a startingDate that defaults to today
function nextFiveAvailableDates(startingDate) {
  // Create a starting date that defaults to start of the current day in SGT
  // If a startingDate is given, it means that the client has called the API before,
  // getting back an array of date milliseconds. So if more timeslots is needed,
  // the client will take the last date milliseconds from the array to call the API
  // with the value as the `after` value. Which means that we have to increment the
  // date by 1 to ensure that we only get timeslots "after" that date.
  const start = startingDate
    ? DateTime.fromMillis(startingDate).plus({ days: 1 })
    : DateTime.now().setZone("Asia/Singapore").startOf("day");

  // Create an empty array of [0, 0, 0, 0, 0] and map to create 5 object with start and end datetimes
  return Array(5)
    .fill(0)
    .map((_, index) => {
      const currentDate = start.plus({ days: index });
      return {
        start: currentDate.startOf("day"),
        end: currentDate.endOf("day"),
      };
    });
}

// Function that generates all the possible time slots for a given day
function allTimeSlots(openingTimeArray, currentDateStart) {
  const timeslots = [];

  for (const openingTimes of openingTimeArray) {
    const { start: openingSecond, end: closingSecond } = openingTimes;

    // Inner recursive function that recurses with a `30 mins` increment until
    // The `currentSecondOfCurrentDay` matches the closing second of the same day.
    // To return an array of all the time slots in between them
    function _allTimeSlots(currentSecondOfCurrentDay) {
      if (currentSecondOfCurrentDay === closingSecond) return [];
      else {
        // Call itself with increment of 30 minutes in seconds
        // 30 * 60 * 1000 = 1800000 Milliseconds in a 30 minute interval
        const timeSlots = _allTimeSlots(currentSecondOfCurrentDay + 1800000);

        // Storing the available timeslot in Milliseconds
        // Unshift is more efficient than calling spread operator to create new array
        timeSlots.unshift(currentDateStart + currentSecondOfCurrentDay);
        return timeSlots;
      }
    }

    // Start the recursive call with openingSecond as the first `currentSecondOfCurrentDay`
    timeslots.push(..._allTimeSlots(openingSecond));
  }

  return timeslots;
}

// Query DB for appointments that within the given time constraints
// The given time constraints should be the start and end of the day in Milliseconds
// Always returns an Array, regardless if there are any appointments in it
// Appointments timestamps are stored as unix time Milliseconds
async function appointments(
  currentDateStartInMilliseconds,
  currentDateEndInMilliseconds
) {
  // https://cloud.google.com/firestore/docs/query-data/queries#limitations
  // Because of the limitations of the != operator, we cannot filter out
  // cancelled appointments directly using the query, thus need to filter out after getting back the document
  // It isn't too bad since there will probably not be so many cancelled appointments within the timeframe
  const snapshot = await fs
    .collection("appointments")
    .where("time", ">=", currentDateStartInMilliseconds)
    .where("time", "<=", currentDateEndInMilliseconds)
    .get();

  // If snapshot is empty, return an empty array to specify that no slots are taken for the given day
  if (snapshot.empty) return [];

  // Map the array of doc references to an array of doc data
  // Filter out cancelled appointments
  // Map the arary of doc data to an array of just the time of the appointments
  return snapshot.docs
    .map((doc) => doc.data())
    .filter((doc) => doc.cancelled !== true)
    .map((doc) => doc.time);
}

// Function takes an array of available time slots and an array of appointments for the same exact day
// It then filters out appointment timeslots from available timeslots as they are now unavailable
function availableTimeSlots(allTimeSlots, appointments) {
  // It is faster to loop through appointments instead of timeslots here,
  // number of appointment will always either be less or equals to number of timeslots
  //
  // Filter out the timeslot taken by the current appointment from allTimeSlots
  // And reassign the filtered array back to itself to reuse this variable to return
  for (const appointmentInMilliseconds of appointments)
    allTimeSlots = allTimeSlots.filter(
      (slot) => slot !== appointmentInMilliseconds
    );

  // Return timeslots after current appointments have been filtered out from it
  return allTimeSlots;
}

//  Maybe instead of hard caching do a TTL type caching?

// Function that gets the opening time from the DB
// This only gets and reads a single Doc from DB as all the opening time for the entire week,
// is stored in a single doc to make it cheaper to access repeatedly as Firestore charge by docs read
// Day of the weeks are Mon to Sun, mapped to 1 to 7
async function openingTimeInMilliseconds() {
  const doc = await fs.collection("openingHours").doc("openingHours").get();
  return doc.data();
}

/**
 * Get up to the first 5 available dates through the booking app
 * An available date is defined as a date from the earliest available booking date that includes at least 1 free time slot
 * @name GET /appointment/available/date
 * @returns Sucess indicator and a list of up to 5 unix seconds time stamp denoting start of a date (00:00), note this has timezone of +0
 */
router.get(
  "/date",
  asyncWrap(async (req, res) => {
    // Generate an array of the next 5 dates, where each element is an obj with start and end timestamp of that date
    // If the "after" query param is used, parse it from String to Int first before passing it to function
    const dates = await nextFiveAvailableDates(
      req.query.after && parseInt(req.query.after)
    );

    // Get the opening and closing milis from DB
    const openingTime = await openingTimeInMilliseconds();

    // Map the dates into an array of objects, where each object contains the start timestamp of that date,
    // And a timeslots array of available time slots
    const timeslots = dates.map(async (date) => ({
      // Return date as milliseconds to allow client to easily instantiate a Date object
      date: date.start.toMillis(),

      timeslots: availableTimeSlots(
        allTimeSlots(openingTime[date.start.weekday], date.start.toMillis()),

        await appointments(date.start.toMillis(), date.end.toMillis())
      ),
    }));

    res.status(200).json({ ok: true, timeslots: await Promise.all(timeslots) });
  })
);

module.exports = router;
