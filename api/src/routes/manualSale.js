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
    const { items, paymentMethod, totalPrice } = req.body;

    // @todo Fix and remove the tmp solution below
    // Always ensure that the customer account is updated and all, so that when the customer object is loaded, all details will be in

    // Create account if does not exists and get back customer/user object
    const customer = {
      ...(await require("../utils/createUserAccount").createUserAccountIfDoesNotExist(
        req.body.userID,
        req.body.customer
      )),

      // In case there is missing data, this at least prevent missing data from being passed to receipt data
      ...req.body.customer,
    };

    // Receipt data is the data needed to generate the actual receipt,
    // while whats stored in the 'manualSale' collection document contains other meta data about the transaction too

    const {
      generateReceiptNumber,
      generateReceiptString,
    } = require("../utils/receipt");

    const receiptData = {
      // Generate receipt number if not passed in
      receiptNumber: req.body.receiptNumber || generateReceiptNumber(),

      paymentMethod,

      customer: {
        name: `${customer.lname} ${customer.fname}`,
        address: customer.address,
        postal_code: customer.postalCode,
      },

      // Total price of sale in cents
      totalPrice,

      // Note that all price must be in cents
      items,
    };

    // Store receipt data and meta data about this transaction
    const { id } = await fs.collection("manualSale").add({
      receiptData,

      paymentMethod,
      userID: customer.id,
      time: unixseconds(),
    });

    // Generate the receipt
    const receipt = await generateReceiptString(receiptData);

    // @todo Generate a reference link so that user can look up this
    // receipt.ministryofpup.com/#/view/${id}

    // Generate and Email receipt
    await emailReceipt({
      email: customer.email,
      userFname: customer.fname,
      receipt,
    });

    res.status(200).json({});
  })
);

module.exports = router;
