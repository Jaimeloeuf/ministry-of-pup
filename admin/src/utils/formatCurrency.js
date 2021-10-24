/**
 * Format a dollar amount in cents to a string in dollars, e.g. 1090 to $10.90, e.g. 1000000 $10,000.00
 *
 * References
 * - https://stackoverflow.com/a/17663871
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString#using_options
 * @param {Number} cents Dollar amount in cents
 * @returns {String} Dollar amount in dollars unit
 */
export default (cents) =>
  "$" +
  (cents / 100).toLocaleString("en-SG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
