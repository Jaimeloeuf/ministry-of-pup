/**
 * Express Router for mapping a pet to a new owner after being sold
 * Mounted on /admin/pet/sold
 * @author JJ
 * @module Sold route
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
If you have any concerns regarding this invoice, please call 88022177 between 11am - 7pm to discuss or alternatively reply to this email.

Ministry of Pup thanks you for your fast response and payment!
The Ministry of Pup team`,

    attachments: [
      {
        // content: require("fs").readFileSync("./invoice.pdf").toString("base64"),
        // content: require("fs").readFileSync("./invoice.txt").toString("base64"),
        // WORKING!!!
        // content: require("fs").readFileSync("./invoice.txt").toString(),

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
 * Map a pet to a new owner after being sold
 * @name POST /admin/pet/sold
 * @returns Sucess indicator
 */
router.post(
  "/",
  express.json(),
  asyncWrap(async (req, res) => {
    const { dogID, userID } = req.body;

    const userDoc = await fs.collection("users").doc(userID).get();

    if (!userDoc.exists) throw new Error(`User '${userID}' does not exist`);
    const user = userDoc.data();

    await fs
      .collection("users")
      .doc(userID)
      .update({
        dogs: [
          // @todo See if there is a better way to append to the array
          ...(user.dogs || []),

          {
            dogID,

            // Store time dog was purchased in unix seconds (this is the time of the server executing the code)
            time: unixseconds(),
          },
        ],
      });

    // Storing owner's userID into dog document because in certain cases we might want to get owner after looking at a dog.
    // It is hard to find dog's owner starting from Dog collection without a direct userID reference,
    // because you have to filter the user collection for a user with dog of dogID,
    // while easy to find the dog the owner owns from the user collection since user doc stores dogID.
    //
    // Update the dog's document to indicate that is has been sold and is no longer available
    await fs
      .collection("dogs")
      .doc(dogID)
      .update({ sold: true, owner: userID });

    const invoiceData = {
      // @todo How to generate this? Do they have a tax num or smth?
      // If not just create a new invoice data collection in firestore and use the doc id?
      invoiceNumber: 1,

      shipping: {
        name: user.name,

        // @todo To discuss with ZR how to handle this customer flow?
        address: "12 Amazing Condo",
        postal_code: 123456,

        // These will always be the same
        country: "Singapore",
        city: "SG",
      },
      items: [
        // Note that all amount/currency is in cents
        {
          item: "French Bulldog",
          description: "3 month old French Bulldog",
          quantity: 1,
          amount: 1000000,
        },

        // @todo How to add this into the flow?
        {
          item: "Dog house",
          description: "Free gift",
          quantity: 1,
          amount: 0,
        },
      ],
      subtotal: 1000000,
      paid: 1000000,
    };

    // Generate and Email invoice
    await emailInvoice({
      email: user.email,
      userFname: user.fname,
      invoice: await generateInvoiceString(invoiceData),
    });

    res.status(200).json({ ok: true });
  })
);

module.exports = router;
