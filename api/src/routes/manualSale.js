/**
 * Express Router for handling manual sales transactions.
 * Mounted on /admin/sale/manual
 * @author JJ
 * @module Manual sales transaction routes
 */

const express = require("express");
const router = express.Router();
const sendMail = require("../utils/sendMail");
const fs = require("../utils/fs");
const unixseconds = require("unixseconds");
const { asyncWrap } = require("express-error-middlewares");

const emailReceipt = async ({ email, userFname, receipt }) =>
  sendMail.send({
    // @todo Make HTML, or make template in sendgrid, then they can also edit without changing code and deploying new version
    // @todo Make the phone number click to call? add the +65

    to: email,
    from: process.env.notificationEmailSender,
    subject: "Ministry Of Pup: Receipt",

    text: `Hey ${userFname}!
Thank you so much for being our valued partner. Please find the attached receipt for your purchase!
If you have any concerns regarding this receipt, please call 8802,2177 between 11am - 8pm, alternatively you can reply to this email.

Sincerely,
The Ministry of Pup team`,

    attachments: [
      {
        content: receipt,
        filename: "Receipt.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  });

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
 * Add a manual sale transaction into the system and send receipt to customer
 * @name POST /admin/sale/manual
 * @returns Sucess indicator
 */
router.post(
  "/",
  express.json(),
  asyncWrap(async (req, res) => {
    const { customer, items, totalPrice } = req.body;

    // @todo Might not want to add the entire req.body in, but for now is fine
    await fs.collection("manualSale").add({
      ...req.body,

      // Store time manual sale transaction is created in unix seconds (this is the time of the server executing the code)
      time: unixseconds(),
    });

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

    // @todo How to generate this? Do they have a tax num or smth?
    // If not just create a new receipt data collection in firestore and use the doc id?
    const receiptNumber = `MOP-REC-${receiptYYMM()}-f83j`;

    const receipt = await generateReceiptString({
      receiptNumber,

      customer: {
        name: `${customer.lname} ${customer.fname}`,
        address: customer.address,
        postal_code: customer.postalCode,
      },

      // Total price of sale in cents
      totalPrice,

      // Note that all amount/currency must be in cents
      items,
    });

    // Generate and Email receipt
    await emailReceipt({
      email: customer.email,
      userFname: customer.fname,
      receipt,
    });

    res.status(200).json({ ok: true });
  })
);

module.exports = router;
