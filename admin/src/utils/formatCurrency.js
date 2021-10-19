/**
 * Format a dollar amount to a string in dollars, e.g. 10.9 to $10.90, e.g. 10000 $10,000.00
 *
 * References
 * - https://stackoverflow.com/a/17663871
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString#using_options
 * @param {Number} dollars Dollar amount in dollars
 * @returns {String} Dollar amount in dollars unit
 */
export default (dollars) =>
  "$" +
  dollars.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
