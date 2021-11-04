/**
 * API to request server to generate sales receipt and send to inbox to print
 * Mounted on /admin/sale/manual/print
 * @author JJ
 * @module Manual sales transaction routes
 */

const express = require("express");
const router = express.Router();
const sendMail = require("../utils/sendMail");
const { asyncWrap } = require("express-error-middlewares");

/**
 * Add a manual sale transaction into the system and send receipt to customer
 * @name POST /admin/sale/manual/print
 * @returns Sucess indicator
 */
router.post(
  "/",
  express.json(),
  asyncWrap(async (req, res) => {
    const { customer, items, paymentMethod, totalPrice } = req.body;

    const {
      generateReceiptNumber,
      generateReceiptString,
    } = require("../utils/receipt");

    // Generate and Email receipt
    await generateReceiptString({
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
    }).then(async (receipt) =>
      sendMail.send({
        to: "ministryofpup@gmail.com",
        from: process.env.notificationEmailSender,
        subject: "Ministry Of Pup: Receipt to print",
        text: `Receipt request`,

        attachments: [
          {
            content: receipt,
            filename: "Receipt.pdf",
            type: "application/pdf",
            disposition: "attachment",
          },
        ],
      })
    );

    res.status(200).json({ ok: true });
  })
);

module.exports = router;
