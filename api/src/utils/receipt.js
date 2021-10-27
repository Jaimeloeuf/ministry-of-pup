// Generate the PDF receipt and convert it to base64 string before returning
async function generateReceiptString(receiptData) {
  // Lazily import this to keep serverless container start up time fast as this is not always used
  const create = require("mop-invoice").receipt;
  const PDFDocument = require("pdfkit");
  const { Base64Encode } = require("base64-stream");

  let string = ""; // Contains the final base64 string after concatenation
  let stream = create(PDFDocument, receiptData).pipe(new Base64Encode());

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => (string += chunk));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(string));
  });
}

/**
 * 1. Create a new date in SGT and format it into a string from 21 Oct, 2021 to 10/21
 * 2. Split the string by the '/' seperator into an array
 * 3. Reverse the array so the year comes before the month
 * 4. Join back the array into a string without any seperators
 * @returns Current date in the YYMM format
 */
const receiptYYMM = () =>
  new Intl.DateTimeFormat("en-SG", {
    year: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Singapore",
  })
    .format(new Date())
    .split("/")
    .reverse()
    .join("");

// Receipt number is a string that stores year and month of receipt and a random identifier
// Receipt ID is a randomly generated 6 character alphanumeric string
const generateReceiptNumber = (
  receiptID = Math.random().toString(36).slice(2, 8)
) => `MOP-REC-${receiptYYMM()}-${receiptID}`;

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
