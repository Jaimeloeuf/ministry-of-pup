/**
 * Function to return a list of dates that are blocked off by the admin.
 * @returns {Promise<Array<DateInMilliseconds>>}
 */
module.exports = async function getBlockedDates(sortByAscending = false) {
  const { DateTime } = require("luxon");

  // Use the current start DateInMilliseconds of the current date in SG as the filter
  const currentDateStartInMilliseconds = DateTime.now()
    .setZone("Asia/Singapore")
    .startOf("day")
    .toMillis();

  // Filter by ">=" to check for blockedDates that are after the current day,
  // and also if today itself is a blocked date, since blockedDates are set as start of day,
  // and if it just filters by ">", it will miss today if today is a blocked date.
  const query = require("./fs")
    .collection("blockedDates")
    .where("startOfDay", ">=", currentDateStartInMilliseconds);

  // Modify the query if function caller requests to sort the dates
  const snapshot = sortByAscending
    ? await query.orderBy("startOfDay", "asc").get()
    : await query.get();

  // If snapshot is empty, return an empty array to specify that there are no dates after given time that is blocked
  if (snapshot.empty) return [];

  // Map the array of doc references to an array of start time in milliseconds of the blocked dates
  return snapshot.docs.map((doc) => doc.data().startOfDay);
};
