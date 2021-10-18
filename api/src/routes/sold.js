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

const emailReceipt = async ({ email, userFname, receipt }) =>
  sendMail.send({
    // to: "z1981r@gmail.com",
    // to: "jimuzu@hotmail.com",
    // to: "jaimeloeuf@gmail.com",

    // @todo Make HTML, or make template in sendgrid, then they can also edit without changing code and deploying new version
    // @todo Make the phone number click to call? add the +65

    to: email,
    from: process.env.notificationEmailSender,
    subject: "Ministry Of Pup: Receipt",

    text: `Hey ${userFname}!
Thank you so much for being our valued partner. Please find the attached receipt for your purchase!
If you have any concerns regarding this receipt, please call 8802,2177 between 11am - 8pm, alternatively you can reply to this email.

We can't wait to see you create happy memories with your puppy!

Sincerely,
The Ministry of Pup team`,

    attachments: [
      {
        // content: require("fs").readFileSync("./invoice.pdf").toString("base64"),
        // content: require("fs").readFileSync("./invoice.txt").toString("base64"),
        // WORKING!!!
        // content: require("fs").readFileSync("./invoice.txt").toString(),

        content: receipt,
        filename: "Invoice.pdf",
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
 * Map a pet to a new owner after being sold and sent receipt to customer
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

      // @todo Fix address and postal code
      customer: {
        name: user.name,
        address: customer.address,
        postal_code: customer.postalCode,
      },

      // @todo Use the data passed to API
      // amount/currency is in cents
      totalPrice: 1000000,

      // Note that all amount/currency must be in cents
      items,

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
    });

    // Generate and Email receipt
    await emailReceipt({
      email: user.email,
      userFname: user.fname,
      receipt,
    });

    res.status(200).json({ ok: true });
  })
);

module.exports = router;
