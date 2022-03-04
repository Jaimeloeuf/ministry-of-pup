/**
 * Script to set opening hours for the store
 * Run script by updating the values in code and running `node .\scripts\setOpeningSchedule.js`
 * All Units are in Milliseconds
 */
async function addOpeningHours() {
  const weekdayOpeningSecond = 13 * 60 * 60 * 1000; // 1300 hours
  const weekendOpeningSecond = 12 * 60 * 60 * 1000; // 1200 hours

  // On mondays to thursdays night, last appointment slot is 6 to 7 pm
  const weekdayClosingSecond = 19 * 60 * 60 * 1000; // 1900 hours

  // last appointment slot is 7 to 8 pm
  const closingSecond = 20 * 60 * 60 * 1000; // 2000 hours

  return require("../src/utils/fs.js")
    .collection("openingHours")
    .doc("openingHours")
    .set({
      1: [{ start: weekdayOpeningSecond, end: weekdayClosingSecond }],
      2: [{ start: weekdayOpeningSecond, end: weekdayClosingSecond }],
      3: [{ start: weekdayOpeningSecond, end: weekdayClosingSecond }],
      4: [{ start: weekdayOpeningSecond, end: weekdayClosingSecond }],
      5: [{ start: weekdayOpeningSecond, end: closingSecond }],
      6: [{ start: weekendOpeningSecond, end: closingSecond }],
      7: [{ start: weekendOpeningSecond, end: closingSecond }],
    });
}

addOpeningHours();
