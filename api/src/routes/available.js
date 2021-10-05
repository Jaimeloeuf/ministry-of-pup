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
function nextFiveAvailableDates(startingDate) {
  // Create a starting date that defaults to start of the current day in SGT
  const start = startingDate
    ? DateTime.fromMillis(startingDate)
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
function allTimeSlots(openingTimeArray, currentDateStart, currentDateEnd) {
  const timeslots = [];

  for (const openingTimes of openingTimeArray) {
    const { start: openingSecond, end: closingSecond } = openingTimes;

    // Inner recursive function that takes in closing time in seconds where 0 is start of day
    // AND opening time in seconds where 0 is start of day
    // To return an array of all the time slots in between them
    function _allTimeSlots(currentIncrement = 0) {
      const currentSecondOfCurrentDay = openingSecond + currentIncrement;

      // if (currentSecondOfCurrentDay >= closingSecond) return [];
      if (currentSecondOfCurrentDay === closingSecond) return [];
      else {
        // Call itself with increment of 30 minutes in seconds
        // 30 * 60 = 1800 seconds in a 30 minute interval
        const timeSlots = _allTimeSlots(currentIncrement + 1800000);
        // Unshift is more efficient than calling spread operator to create new array
        timeSlots.unshift(
          new Date(currentDateStart + currentSecondOfCurrentDay)
        );
        return timeSlots;
      }
    }

    timeslots.push(..._allTimeSlots());
  }

  return timeslots;
}

// Query DB for appointments that within the given time constraints
// The given time constraints should be the start and end of the day in Seconds
// Always returns an Array, regardless if there are any appointments in it
// Appointments timestamps are stored as unix seconds
async function appointments(
  currentDateStartInSeconds,
  currentDateEndInSeconds
) {
  const snapshot = await fs
    .collection("appointments")
    .where("time", ">=", currentDateStartInSeconds)
    .where("time", "<=", currentDateEndInSeconds)
    .get();

  // If snapshot is empty, return an empty array to specify that no slots are taken for the given day
  if (snapshot.empty) return [];
  else return snapshot.docs.map((doc) => doc.data().time);
}

// Function takes an array of available time slots and an array of appointments for the same exact day
// It then filters out appointment timeslots from available timeslots as they are now unavailable
function availableTimeSlots(allTimeSlots, appointments) {
  // It is faster to loop through appointments instead of timeslots here,
  // number of appointment will always either be less or equals to number of timeslots
  for (const appointment of appointments) {
    // Because appointment is stored as seconds,
    // Need to convert it to milliseconds first before comparing with timeslots
    appointmentInMilliseconds = appointment * 1000;

    // Filter out the timeslot taken by the current appointment from allTimeSlots
    // And reassign the filtered array back to itself to reuse this variable to return
    allTimeSlots = allTimeSlots.filter(
      (slot) => slot.getTime() !== appointmentInMilliseconds
    );
  }

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

// IIFE to test logic first
(async function () {
  const dates = nextFiveAvailableDates();

  // Get the opening and closing milis from DB
  const timestamps = await openingTimeInMilliseconds();

  // To generate possible time slots of a given date
  // You need to have the
  // 1. startMilis of date
  // 2. endMilis of date
  // 3. store opening milis
  // 4. store closing milis

  const fin = dates.map(async (date) => ({
    // Return date as milliseconds to allow client to easily instantiate a Date object
    date: date.start.toMillis(),

    timeslots: availableTimeSlots(
      allTimeSlots(
        timestamps[date.start.weekday],
        date.start.toMillis(),
        date.end.toMillis()
      ),
      await appointments(date.start.toSeconds(), date.end.toSeconds())
    ),
  }));

  console.log("fin", await Promise.all(fin));
})();

/**
 * Get up to the first 5 available dates through the booking app
 * An available date is defined as a date from the earliest available booking date that includes at least 1 free time slot
 * @name GET /appointment/available/date
 * @returns Sucess indicator and a list of up to 5 unix seconds time stamp denoting start of a date (00:00), note this has timezone of +0
 */
router.get(
  "/date",
  asyncWrap(async (req, res) => {

    res.status(200).json({ ok: true });
  })
);

module.exports = router;
