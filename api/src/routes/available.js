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

/**
 * Date in milliseconds since unix epoch time.
 * @typedef {Number} DateInMilliseconds
 */

/**
 * Hours and minutes of a day represented in Milliseconds without date,
 * effectively being an offset to add to a date in milliseconds,
 * to get the actual DateInMilliseconds with hour and minutes included.
 *
 * Number of milliseconds offset to add to a DateInMilliseconds representing start of day,
 * to get the same hour and minute regardless of the date itself.
 *
 * @typedef {Number} DateOffsetInMilliseconds
 */

/**
 * @todo Since this is called next available date, this should actually check the DB to see if date is blocked and if the day is open?
 * @todo Needs to ensure that the dates are not already blocked off by admin,
 * @todo Needs to ensure that the store is even open on that day. Actually dont need because availableTimeSlots takes care of this
 *
 * If a date cursor is given, it means that:
 *
 * 1.
 *    The client has called the API before,
 *    getting back an array of date milliseconds. So if more timeslots is needed,
 *    the client will take the last date milliseconds from the array to call the API
 *    with the value as the `after` value. Which means that we have to increment the
 *    date by 1 to ensure that we only get timeslots "after" that date.
 * 2.
 *    The API logic is calling this function again with the DateTime object it got
 *    back previously to get the next DateTime object, thus the value passed in
 *    will be a DateTime object instead of date in Milliseconds
 *
 *
 * If none is given, the next available date is today with a next available time cursor
 *
 * Returns:
 * where each element is an object with a start and end luxon DateTime object
 *
 * @todo How does setting the zone here makes sense?
 *
 * @param {DateTime | DateInMilliseconds} [afterThisDate]
 * @returns
 */
function nextAvailableDate(afterThisDate) {
  if (afterThisDate) {
    // If a DateTime object date cursor is provided, use it
    // Else if a millisecond date cursor is provided, convert it to a DateTime object
    //
    // Add 1 day to the DateTime object cursor because as the name suggests, it is "after this date"
    const date = (
      DateTime.isDateTime(afterThisDate)
        ? afterThisDate
        : DateTime.fromMillis(afterThisDate).setZone("Asia/Singapore")
    ).plus({ days: 1 });

    // Return an object of the start and end of the date without a cursor
    return { start: date.startOf("day"), end: date.endOf("day") };
  } else {
    // If no date cursor provided, create new date of current time in SGT,
    // To get first timeslot of date cursor, first round it up to the nearest hour (since timeslots are hourly intervals),
    // Then add a 1 hour buffer to current time so that the earliest available booking time is at least 1 hour away
    // Reset seconds and milliseconds to 0 to ensure that it will be a Hour/Minute only representation
    const dt = DateTime.now().setZone("Asia/Singapore");
    const remainder = 60 - (dt.minute % 60);
    const date = dt
      .plus({ hours: 1, minutes: remainder })
      .set({ second: 0, millisecond: 0 });

    // Add datetime as the cursor so that available timeslots of given date can be calculated correctly
    return { start: date.startOf("day"), end: date.endOf("day"), cursor: date };
  }
}

/**
 * Function that generates all the possible time slots for a given day
 *
 * Since opening hours are stored as Milliseconds offset from 0 where 0 is the start of a day,
 * the first timeslot is the milliseconds representing the start of the given date plus the opening milliseconds offset.
 *
 * @param {Array<{ start: DateOffsetInMilliseconds, end: DateOffsetInMilliseconds }>} openingTimeArray
 * @param {DateInMilliseconds} currentDateStart
 * @param {DateInMilliseconds} [customStart] An optional datetime to use in lieu of the opening millisecond, offset calculated with `customStart - currentDateStart`
 * @returns {Array<DateInMilliseconds>} Returns a list of available date time in milliseconds
 */
function allTimeSlots(openingTimeArray, currentDateStart, customStart) {
  const timeslots = [];

  for (const openingTimes of openingTimeArray) {
    const { start: openingSecond, end: closingSecond } = openingTimes;

    // Inner recursive function that recurses with a `1 hour` increment until
    // The `currentSecondOfCurrentDay` matches the closing second of the same day.
    // To return an array of all the time slots in between them
    function _allTimeSlots(currentSecondOfCurrentDay) {
      // Checking if current second exceeds closingSecond rather than checking for exact equality,
      // because if custom start time is used, it may already start after the closing second.
      if (currentSecondOfCurrentDay >= closingSecond) return [];
      else {
        // Call itself with increment of 1 hour in seconds
        // 60 * 60 * 1000 = 3600000 Milliseconds in a 1 hour interval
        const timeSlots = _allTimeSlots(currentSecondOfCurrentDay + 3600000);

        // Storing the available timeslot in Milliseconds
        // Unshift is more efficient than calling spread operator to create new array
        timeSlots.unshift(currentDateStart + currentSecondOfCurrentDay);
        return timeSlots;
      }
    }

    /**
     * Calculate the startingMillisecond
     * startingMillisecond can either be the opening second following the openingHours of the store,
     * or it can be a custom offset calculated from a customStart time passed in.
     *
     * How startingMillisecond is calculated
     *
     * // If customStart is passed into function
     * //    Calculate offset with `customStart - currentDateStart`
     * //      If offset is bigger than opening second, use offset
     * //      If offset is smaller than opening second, use opening second
     * // Else if nothing is passed in, use opening second
     *
     * const startingMillisecond = customStart
     *   ? customStart - currentDateStart > openingSecond
     *     ? customStart - currentDateStart
     *     : openingSecond
     *   : openingSecond;
     *
     * // Start the recursive call with startingMillisecond as the first `currentSecondOfCurrentDay`
     * timeslots.push(..._allTimeSlots(startingMillisecond));
     */

    // A more readable way to do the startingMillisecond calculation like above
    if (customStart) {
      const offset = customStart - currentDateStart;
      timeslots.push(
        ..._allTimeSlots(offset > openingSecond ? offset : openingSecond)
      );
    } else {
      timeslots.push(..._allTimeSlots(openingSecond));
    }
  }

  return timeslots;
}

/**
 * Query DB for appointments that within the given time constraints.
 * The given time constraints are the start and end of the day in Milliseconds.
 * Always returns an Array, regardless if there are any appointments in it.
 * Appointments timestamps are stored as unix time Milliseconds.
 *
 * @param {DateInMilliseconds} currentDateStartInMilliseconds
 * @param {DateInMilliseconds} currentDateEndInMilliseconds
 * @returns {Promise<Array<DateInMilliseconds>>}
 */
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

/**
 * Function takes an array of available time slots and an array of appointments for the same exact day,
 * to filter out appointment timeslots from available timeslots as they are now unavailable.
 *
 * In order words, for every timeslot in allTimeSlots, keep only if it appears exclusively in allTimeSlots array.
 *
 * @param {Array<DateInMilliseconds>} allTimeSlots
 * @param {Array<DateInMilliseconds>} appointments
 * @returns {Array<DateInMilliseconds>} Returns a list of available timeslots
 */
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

/**
 * Get the opening time from DB.
 * Day of the weeks are Mon to Sun, mapped to 1 to 7
 *
 * This only gets and reads a single Doc from DB as all the opening time for the entire week,
 * is stored in a single doc to make it cheaper to access repeatedly as Firestore charge by docs read
 *
 * @returns {Promise<{
 *    1: Array<{ start: DateOffsetInMilliseconds, end: DateOffsetInMilliseconds }>
 *    2: Array<{ start: DateOffsetInMilliseconds, end: DateOffsetInMilliseconds }>
 *    3: Array<{ start: DateOffsetInMilliseconds, end: DateOffsetInMilliseconds }>
 *    4: Array<{ start: DateOffsetInMilliseconds, end: DateOffsetInMilliseconds }>
 *    5: Array<{ start: DateOffsetInMilliseconds, end: DateOffsetInMilliseconds }>
 *    6: Array<{ start: DateOffsetInMilliseconds, end: DateOffsetInMilliseconds }>
 *    7: Array<{ start: DateOffsetInMilliseconds, end: DateOffsetInMilliseconds }>
 * }>} The opening hours object of the entire week
 */
async function openingTimeInMilliseconds() {
  const doc = await fs.collection("openingHours").doc("openingHours").get();
  return doc.data();
}

/**
 * Gets the next 5 available dates and their timeslots, where date is start of date in milliseconds.
 * @param {DateInMilliseconds} after A date cursor in Milliseconds
 * @returns {Promise<Array<{ date: DateInMilliseconds, timeslots: Array<DateInMilliseconds> }>>}
 */
async function nextFiveAvailableDates(after) {
  // Get the opening and closing milis from DB
  const openingTime = await openingTimeInMilliseconds();

  // Create the array to hold timeslots first before filling it up with the for loop
  const timeslots = [];

  // Can only book up to 3 weeks in advance
  const maxDateAllowed = DateTime.now()
    .setZone("Asia/Singapore")
    .startOf("day")
    .plus({ days: 21 });

  // Start on the first available date, and keep looping until there is 5 timeslots or till maxDateAllowed is exceeded.
  // On every loop, get the next available date using the start of current date as the date cursor
  for (
    let date = nextAvailableDate(after);
    timeslots.length < 5 && date.start < maxDateAllowed;
    date = nextAvailableDate(date.start)
  ) {
    // Use the weekday value and start of day to get list of available timeslots of the given date
    const allTimeSlotsOfDate = allTimeSlots(
      openingTime[date.start.weekday],
      date.start.toMillis(),
      date.cursor?.toMillis()
    );

    // If there are no timeslots for the current date, then skip this loop iteration to get next date
    if (allTimeSlotsOfDate.length === 0) continue;

    // Get available time slots of the current date
    const avail = availableTimeSlots(
      allTimeSlotsOfDate,

      // Get the appointments of the current date
      await appointments(date.start.toMillis(), date.end.toMillis())
    );

    // Ensures that an empty array will not be returned if that day is fully booked,
    // by only adding timeslots of current date if there is any available timeslots left
    if (avail.length > 0)
      timeslots.push({
        // Return date as milliseconds to allow client to easily instantiate a Date object
        date: date.start.toMillis(),
        timeslots: avail,
      });
  }

  // For client UI:
  // The only time when the for loop will stop is if the array is filled or if date exceeded `maxDateAllowed`
  // Empty timeslot array means that user requested for timeslots after a date that has exceeded `maxDateAllowed`
  // if (timeslots.length === 0) return alert("No more available timeslots");

  return timeslots;
}

/**
 * Get up to the first 5 available dates through the booking app
 * An available date is defined as a date from the earliest available booking date that includes at least 1 free time slot
 * @name GET /appointment/available/date
 * @returns Sucess indicator and a list of up to 5 unix seconds time stamp denoting start of a date (00:00), note this has timezone of +0
 */
router.get(
  "/date",
  asyncWrap(async (req, res) =>
    // Generate an array of the next 5 dates, where each element is an obj with start and end timestamp of that date
    // If the "after" query param is used, parse it from String to Int first before passing it to function
    nextFiveAvailableDates(req.query.after && parseInt(req.query.after)).then(
      (timeslots) => res.status(200).json({ timeslots })
    )
  )
);

module.exports = router;
