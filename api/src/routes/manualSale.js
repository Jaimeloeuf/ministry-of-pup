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
const emailReceipt = async ({ email, userFname, receiptLink }) =>
  sendMail.send({
    to: email,
    from: process.env.notificationEmailSender,
    subject: "Ministry Of Pup: Receipt",

    text: `Hey ${userFname}!

Thank you so much for being our valued partner. <a href="${receiptLink}">Here is your purchase receipt!</a>

If you have any concerns regarding this receipt, please call <a href="tel:+65 88022177">8802,2177</a> between 11am - 8pm.
Alternatively you can reply to this email directly.


Sincerely,
The Ministry of Pup team`,
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

    // Get the current time in unix seconds to use in both receiptData and manualSale documents
    const currentTime = unixseconds();

    // Generate receipt number if not passed in
    const receiptNumber =
      req.body.receiptNumber ||
      require("../utils/receipt").generateReceiptNumber();

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

    // Only email customer about the transaction with the receipt link if they have an account with a valid email
    if (customer?.email)
      await emailReceipt({
        email: customer.email,
        userFname: customer.fname,
        // Return link for user to access receipt anytime again
        receiptLink: `https://api.ministryofpup.com/receipt/number/${receiptNumber}`,
      });

    res.status(200).json({});
  })
);

module.exports = router;
