/**
 * Receipt number is a string made up of year, month and day of issuing receipt plus a random identifier
 * Receipt ID is a randomly generated 6 character alphanumeric string
 *
 * To get the current date in the YYMMDD format
 * 1. Create a new date in SGT and format it into a string from 21 Oct, 2021 to 21/10/21
 * 2. Split the string by the '/' seperator into an array
 * 3. Reverse the array so the year comes before the month
 * 4. Join back the array into a string without any seperators
 *
 * @notice This is the same code as the one used in the API server
 */
export default (receiptID = Math.random().toString(36).slice(2, 8)) =>
  `MOP-REC-${new Intl.DateTimeFormat("en-SG", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Singapore",
  })
    .format(new Date())
    .split("/")
    .reverse()
    .join("")}-${receiptID}`;
