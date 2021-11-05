/**
 * Script to set blocked off timing manually
 */

async function addBlockedDates() {
  const { DateTime } = require("luxon");

  const openingSecond = 11 * 60 * 60 * 1000; // 1100 hours

  const startOfDay = DateTime.utc().startOf("day").plus({ days: 7 }).toMillis();
  const startOfDay2 = DateTime.utc()
    .startOf("day")
    .plus({ days: 10 })
    .toMillis();

  return require("../src/utils/fs.js")
    .collection("openingHours")
    .doc("blockedDates")
    .set({
      [startOfDay]: {
        start: startOfDay + openingSecond,
        end: startOfDay + 15 * 60 * 60 * 1000,
      },
      [startOfDay2]: {
        start: startOfDay2 + openingSecond,
        end: startOfDay2 + (11 * 60 + 30) * 60 * 1000,
      },
    });
}

addBlockedDates();
