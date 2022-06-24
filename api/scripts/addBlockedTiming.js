/**
 * Script to set blocked time slots manually
 */

const fs = require("../src/utils/fs.js");
const { DateTime } = require("luxon");

async function addBlockedDates() {
  const openingSecond = 11 * 60 * 60 * 1000; // 1100 hours

  const startOfDay = DateTime.now()
    .setZone("Asia/Singapore")
    .startOf("day")
    .plus({ days: 2 })
    .toMillis();

  // When adding dates, NOTE THAT THIS ADDS TO DB it does not delete or override old data
  // These values must be in SGT because the filtering uses SGT in available.js
  const timeslots = [
    {
      start: startOfDay + openingSecond,
      end: startOfDay + 15 * 60 * 60 * 1000,
    },
  ];

  for (const timeslot of timeslots)
    fs.collection("blockedTimeslots").add(timeslot);
}

addBlockedDates();
