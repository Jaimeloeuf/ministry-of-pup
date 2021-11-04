/**
 * Script to set opening hours for the store and blocked off timing if any
 */

async function addOpeningHours() {
  // Units in Milliseconds
  // last appointment allowed is 7 to 730pm
  const openingSecond = 11 * 60 * 60 * 1000; // 1100 hours
  const closingSecond = (19 * 60 * 60 + 30 * 60) * 1000; // 1930 hours

  return require("../src/utils/fs.js")
    .collection("openingHours")
    .doc("openingHours")
    .set({
      1: [{ start: openingSecond, end: closingSecond }],
      2: [{ start: openingSecond, end: closingSecond }],
      3: [{ start: openingSecond, end: closingSecond }],
      4: [{ start: openingSecond, end: closingSecond }],
      5: [{ start: openingSecond, end: closingSecond }],
      6: [{ start: openingSecond, end: closingSecond }],
      7: [{ start: openingSecond, end: closingSecond }],
    });
}

addOpeningHours();
