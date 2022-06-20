/**
 * Script to set blocked dates manually
 */

const fs = require("../src/utils/fs.js");
const { DateTime } = require("luxon");

async function addBlockedDates() {
  // When adding dates, NOTE THAT THIS ADDS TO DB it does not delete or override old data
  // These values must be in SGT because the filtering uses SGT in available.js
  const dates = [
    DateTime.now()
      .setZone("Asia/Singapore")
      .startOf("day")
      .plus({ days: 2 })
      .toMillis(),
    DateTime.now()
      .setZone("Asia/Singapore")
      .startOf("day")
      .plus({ days: 3 })
      .toMillis(),
    DateTime.now()
      .setZone("Asia/Singapore")
      .startOf("day")
      .plus({ days: 4 })
      .toMillis(),
  ];

  for (const date of dates)
    fs.collection("blockedDates").add({ startOfDay: date });
}

addBlockedDates();
