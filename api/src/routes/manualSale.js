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
    const { items, paymentMethod, totalPrice } = req.body;

    // Create account if does not exists and get back customer/user object
    const customer =
      await require("../utils/createUserAccount").createUserAccountIfDoesNotExist(
        req.body.userID,
        req.body.customer
      );

    // Receipt data is the data needed to generate the actual receipt,
    // while whats stored in the manualSaleReceipts document may contain more data and metadata about the transaction

    // All the data needed to generate the receipt except the `receiptNumber`
    // Receipt number will be generated using the firestore's doc ID
    const receiptData = {
      customer: {
        name: `${customer.lname} ${customer.fname}`,
        address: customer.address,
        postal_code: customer.postalCode,
      },

      // Total price of sale in cents
      totalPrice,

      // Note that all amount/currency must be in cents
      items,
    };

    // Store receipt data and time of generation in unix seconds (this is the time of the server executing the code)
    const { id } = await fs.collection("manualSaleReceipts").add({
      ...receiptData,
      userID: customer.id,
      paymentMethod,
      time: unixseconds(),
    });

    // Generate the receipt using the newly created doc's doc ID to generate receipt number
    const receipt = await require("../utils/receipt").generateReceipt(
      id,
      receiptData
    );

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
