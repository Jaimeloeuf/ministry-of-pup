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

const emailInvoice = async ({ email, userFname, invoice }) =>
  sendMail.send({
    // @todo Make HTML, or make template in sendgrid, then they can also edit without changing code and deploying new version
    // @todo Make the phone number click to call? add the +65

    to: email,
    from: process.env.notificationEmailSender,
    subject: "Ministry Of Pup: Invoice",

    text: `Hey ${userFname}!
Thank you so much for being our valued partner. Please find attached the invoice for your purchase!
If you have any concerns regarding this invoice, please call 88022177 between 11am - 8pm, alternatively you can reply to this email.

Ministry of Pup thanks you for your fast response and payment!
The Ministry of Pup team`,

    attachments: [
      {
        content: invoice,
        filename: "Invoice.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  });

// Generate the PDF invoice and convert it to base64 string before returning
async function generateInvoiceString(invoiceData) {
  // Lazily import this to keep serverless container start up time fast as this is not always used
  const createInvoice = require("mop-invoice");
  const PDFDocument = require("pdfkit");
  const { Base64Encode } = require("base64-stream");

  let string = ""; // Contains the final base64 string after concatenation
  let stream = createInvoice(PDFDocument, invoiceData).pipe(new Base64Encode());

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => (string += chunk));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(string));
  });
}

/**
 * Add a manual sale transaction into the system and send invoice to customer
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

    const invoiceData = {
      // @todo How to generate this? Do they have a tax num or smth?
      // If not just create a new invoice data collection in firestore and use the doc id?
      invoiceNumber: 1,

      subtotal: totalPrice * 100,
      paid: totalPrice * 100,

      shipping: {
        name: `${customer.lname} ${customer.fname}`,
        address: customer.address,
        postal_code: customer.postalCode,

        // These will always be the same
        country: "Singapore",
        city: "SG",
      },
      // Note that all amount/currency must be in cents
      items,
    };

    // Generate and Email invoice
    await emailInvoice({
      email: customer.email,
      userFname: customer.fname,
      invoice: await generateInvoiceString(invoiceData),
    });

    res.status(200).json({ ok: true });
  })
);

module.exports = router;
