/**
 * PDFDocument Class
 * @typedef {object} PDFDocument
 */

/**
 * Add header with logo and company information to the given document
 * @param {PDFDocument} doc
 */
const generateHeader = (doc) =>
  doc
    .image("logo.jpg", 50, 40, { height: 50 })
    .fillColor("#444444")
    .fontSize(10)
    .text("Ministry Of Pup LLP", 200, 50, { align: "right" })
    .text("43 Kampong Bahru", 200, 65, { align: "right" })
    .text("Singapore, 169359", 200, 80, { align: "right" })
    .moveDown();

/**
 * Generate a new row in a table
 * @param {PDFDocument} doc
 * @param {Number} y Positional height
 * @param {String} item
 * @param {String} description
 * @param {String|Number} unitCost
 * @param {String|Number} quantity
 * @param {String|Number} lineTotal
 */
const generateTableRow = (
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) =>
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 320, y, { width: 90, align: "right" })
    .text(quantity, 384, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });

/**
 * Function to generate hr HTML seperator tag
 * @param {PDFDocument} doc
 * @param {Number} y Positional height
 */
const generateHr = (doc, y) =>
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();

/**
 * Add a footer string
 * @param {PDFDocument} doc
 * @param {String} string Text to show in the footer
 */
const generateFooter = (doc, string) =>
  doc.fontSize(10).text(string, 50, 780, { align: "center", width: 500 });

/**
 * Format a dollar amount in cents to a string in dollars, e.g. 1090 to $10.90, e.g. 1000000 $10,000.00
 *
 * References
 * - https://stackoverflow.com/a/17663871
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString#using_options
 * @param {Number} cents Dollar amount in cents
 * @returns {String} Dollar amount in dollars unit
 */
const formatCurrency = (cents) =>
  "$" +
  (cents / 100).toLocaleString("en-SG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * Takes a date object and returns a string in the format of e.g. 'Monday, 18 October 2021'
 * @param {Date} date
 * @returns {String} Formatted date string
 */
const formatDate = (date) =>
  new Intl.DateTimeFormat("en-SG", {
    dateStyle: "full",
    timeZone: "Asia/Singapore",
  }).format(date);

module.exports = {
  //   create,
  generateHeader,
  generateFooter,
  generateTableRow,
  generateHr,
  formatCurrency,
  formatDate,
};
