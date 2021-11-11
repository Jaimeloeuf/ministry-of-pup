/**
 * Script to set opening hours for the store
 */

async function addOpeningHours() {
  // Units in Milliseconds
  const weekdayOpeningSecond = 14 * 60 * 60 * 1000; // 1400 hours
  const weekendOpeningSecond = 11 * 60 * 60 * 1000; // 1100 hours

  // last appointment slot is 7 to 8 pm
  const closingSecond = 20 * 60 * 60 * 1000; // 2000 hours

  return require("../src/utils/fs.js")
    .collection("openingHours")
    .doc("openingHours")
    .set({
      1: [{ start: weekdayOpeningSecond, end: closingSecond }],
      2: [{ start: weekdayOpeningSecond, end: closingSecond }],
      3: [{ start: weekdayOpeningSecond, end: closingSecond }],
      4: [{ start: weekdayOpeningSecond, end: closingSecond }],
      5: [{ start: weekdayOpeningSecond, end: closingSecond }],
      6: [{ start: weekendOpeningSecond, end: closingSecond }],
      7: [{ start: weekendOpeningSecond, end: closingSecond }],
    });
}

addOpeningHours();
