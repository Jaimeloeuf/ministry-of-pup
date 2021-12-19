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

// @todo Use sendgrid dynamic template to edit without requiring deploying new API version
// @todo Make the phone number click to call? add the +65
const emailReceipt = async ({ email, userFname, receipt }) =>
  sendMail.send({
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

/**
 * Add a manual sale transaction into the system and send receipt to customer
 * @name POST /admin/sale/manual
 * @returns Sucess indicator
 */
router.post(
  "/",
  express.json(),
  asyncWrap(async (req, res) => {
    const { userID, items, paymentMethod, totalPrice } = req.body;

    const {
      generateReceiptNumber,
      generateReceiptString,
    } = require("../utils/receipt");

    // Get the current time in unix seconds to use in both receiptData and manualSale documents
    const currentTime = unixseconds();

    // Generate receipt number if not passed in
    const receiptNumber = req.body.receiptNumber || generateReceiptNumber();

    const receiptData = {
      createdAt: currentTime,

      receiptNumber,

      paymentMethod,

      // Total price of sale in cents
      totalPrice,

      // Note that all price must be in cents
      items,
    };
    // If a userID is given, get the customer object back, else customer will be undefined
    const customer =
      userID &&
      (await require("../utils/getUserAccount.js").getUserAccount(userID));
    if (customer)
      receiptData.customer = {
        name: `${customer.lname} ${customer.fname}`,
        address: customer.address,
        postal_code: customer.postalCode,
      };

    // Store receipt data
    await fs.collection("receipts").add(receiptData);

    // Create a new transaction in the system
    const transaction = {
      time: currentTime,
      value: totalPrice,
      items,
      paymentMethod,
      receiptNumber,

      // Defaults to null to indicate it was an anonymous customer
      buyer: userID || null,
    };
    if (customer) transaction.buyer_name = receiptData.customer.name;
    await require("../DL/createTransaction.js")(transaction);

    // Return link for user to access receipt anytime again
    // `https://api.ministryofpup.com/receipt/number/${receiptNumber}`;

    // Only generate and email customer the receipt if they have an account with a valid email
    if (customer?.email)
      await generateReceiptString(receiptData).then((receipt) =>
        emailReceipt({
          email: customer.email,
          userFname: customer.fname,
          receipt,
        })
      );

    res.status(200).json({});
  })
);

module.exports = router;
