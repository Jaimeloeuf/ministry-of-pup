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

// @todo Make HTML, or make template in sendgrid, then they can also edit without changing code and deploying new version
// @todo Make the phone number click to call? add the +65
const emailReceipt = async ({ email, userFname, receipt }) =>
  sendMail.send({
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
        content: receipt,
        filename: "Invoice.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  });

/** @typedef {Number} Price Price of everything is stored in SGD cents */
/** @typedef {String} DocumentID Alphanumeric ID of a firestore document */

/**
 * Update user data and get back updated data. User account MUST be created first before calling this else will fail.
 * @param {DocumentID} userID
 * @param {DocumentID} dogID
 * @returns {FirebaseFirestore.DocumentData} Returns the user document data
 */
async function updateUser(userID, dogID) {
  const docRef = await fs.collection("users").doc(userID);

  // https://googleapis.dev/nodejs/firestore/latest/FieldValue.html#.arrayUnion
  // Will create an array for `dogs` field if it is not an array already
  await docRef.update(
    "dogs",

    // Store dogID and time dog was purchased in unix seconds (this is the time of the server executing the code)
    Firestore.FieldValue.arrayUnion({ dogID, time: unixseconds() })
  );

  return docRef.get().then((snapshot) => snapshot.data());
}

/**
 * Update dog data and get back updated data
 * @param {DocumentID} dogID
 * @param {DocumentID} userID
 * @param {Price} salePrice
 * @returns {FirebaseFirestore.DocumentData} Returns the dog document data with ID included
 */
async function updateDog(dogID, userID, salePrice) {
  const docRef = fs.collection("dogs").doc(dogID);

  // Storing owner's userID into dog document because in certain cases we might want to get owner after looking at a dog.
  // It is hard to find dog's owner starting from Dog collection without a direct userID reference,
  // because you have to filter the user collection for a user with dog of dogID,
  // while easy to find the dog the owner owns from the user collection since user doc stores dogID.
  //
  // Update the dog's document to indicate that is has been sold and is no longer available
  // Sale Price is added in too to use for data analytics in the future
  await docRef.update({ sold: true, owner: userID, salePrice });

  const dogDoc = await docRef.get();
  return { id: dogDoc.id, ...dogDoc.data() };
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
    const { dogID, userID, salePrice } = req.body;

    const user = await updateUser(userID, dogID);
    const dog = await updateDog(dogID, userID, salePrice);

    // TMP: Must ensure that user have address and postal code added before running this

    // All the data needed to generate the receipt except the `receiptNumber`
    // Receipt number will be generated using firestore's `dogSaleReceipts` doc ID
    const receiptData = {
      customer: {
        name: `${user.lname} ${user.fname}`,
        address: user.address,
        postal_code: user.postalCode,
      },

      // Sale Price is in cents
      totalPrice: salePrice,

      // Note that all amount/currency is in cents
      items: [
        {
          item: dog.breed,
          // @todo Replace with dog sex and dog color
          description: dog.description,
          quantity: 1,
          price: salePrice,
        },

        {
          item: "Starter pack",
          description: "Free $500 Pawrent kick starter gift pack",
          quantity: 1,
          price: 0,
        },
      ],
    };

    // Store receipt data and time of generation in unix seconds (this is the time of the server executing the code)
    const { id } = await fs
      .collection("dogSaleReceipts")
      .add({ ...receiptData, dogID, time: unixseconds() });

    // Generate the receipt using the newly created doc's doc ID to generate receipt number
    const receipt = await require("../utils/receipt").generateReceipt(
      id,
      receiptData
    );

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
