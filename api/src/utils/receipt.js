/**
 * Generate the PDF receipt and convert it to base64 string before returning
 * @param {object} receiptData All the data required by mop-invoice.receipt to generate the receipt
 * @param {Stream} streamTarget A target for the document chunks to be streamed to, if not set, default to base64 encoded string
 * @returns Promise<String | undefined> Resolves to a string only if no streamTarget is set
 */
async function generateReceiptString(
  receiptData,
  // Need to have bracket around Base64Encode to ensure new is used on that class rather than on the require function call
  streamTarget = new (require("base64-stream").Base64Encode)()
) {
  // Lazily import dependencies to keep serverless container start up time fast as this is not always used
  let stream = require("mop-invoice")
    .receipt(require("pdfkit"), receiptData)
    .pipe(streamTarget);

  // Contains the final base64 string after concatenation
  let string = "";

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => (string += chunk));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(string));
  });
}

/**
 * To get the current date in the YYMMDD format
 * 1. Create a new date in SGT and format it into a string from 21 Oct, 2021 to 21/10/21
 * 2. Split the string by the '/' seperator into an array
 * 3. Reverse the array so the year comes before the month
 * 4. Join back the array into a string without any seperators
 * @returns Current date in the YYMM format
 */
const receiptYYMMDD = () =>
  new Intl.DateTimeFormat("en-SG", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Singapore",
  })
    .format(new Date())
    .split("/")
    .reverse()
    .join("");

// Receipt number is a string made up of year, month and day of issuing receipt plus a random identifier
// Receipt ID is a randomly generated 6 character alphanumeric string
const generateReceiptNumber = (
  receiptID = Math.random().toString(36).slice(2, 8)
) => `MOP-REC-${receiptYYMMDD()}-${receiptID}`;

// @todo Delete after updating sold.js to stop using this
const generateReceipt = (docID, receiptData) =>
  generateReceiptString({
    receiptNumber: generateReceiptNumber(docID),
    ...receiptData,
  });

module.exports = {
  generateReceipt,
  generateReceiptNumber,
  generateReceiptString,
};
