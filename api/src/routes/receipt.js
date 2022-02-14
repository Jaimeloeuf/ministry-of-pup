/**
 * API to request server to handle receipts
 * Mounted on /receipt
 * @author JJ
 * @module Receipt routes
 */

const express = require("express");
const router = express.Router();
const fs = require("../utils/fs");
const { asyncWrap } = require("express-error-middlewares");

/** Set content headers, generate receipt, pipe it back to client and end connection */
async function generateAndSendReceipt(res, receiptData) {
  // Set content header first before generating receipt sending it to the client
  res.setHeader("Content-Type", "application/pdf");

  // No matter what the browser uses the last part of the URI rather than the filename as the page title...
  // So 1 way is to always redirect to /receipt/number/:receiptNumber to have it named correctly
  // The second way is just ignore it, then when user downloads the file, default that filename to receiptNumber
  res.setHeader(
    "Content-disposition",
    `inline; filename=${receiptData.receiptNumber}.pdf`
  );

  // Alternative header to use to make browser auto trigger save file action when link is opened
  // res.setHeader(
  //   "Content-disposition",
  //   `attachment; filename=${receiptData.receiptNumber}.pdf`
  // );

  // Generate receipt, pipe it back to the client and end the connection
  return require("../utils/receipt")
    .generateReceiptString(receiptData, res)
    .then(res.status(200).end);
}

/**
 * API to request server to generate the receipt for the given receipt ID
 * @name GET /receipt/:receiptID
 * @returns Receipt
 */
router.get(
  "/:receiptID",
  asyncWrap(async (req, res) =>
    fs
      .collection("receipts")
      .doc(req.params.receiptID)
      .get()
      .then((snapshot) =>
        snapshot.exists
          ? generateAndSendReceipt(res, snapshot.data())
          : res.status(404).json({ error: "Receipt not found" })
      )
  )
);

/**
 * API to request server to generate the receipt for the given receipt number
 * @name GET /receipt/number/:receiptNumber
 * @returns Receipt
 */
router.get(
  "/number/:receiptNumber",
  asyncWrap(async (req, res) =>
    fs
      .collection("receipts")
      .where("receiptNumber", "==", req.params.receiptNumber)
      .get()
      .then((snapshot) =>
        snapshot.empty
          ? res.status(404).json({ error: "Receipt not found" })
          : generateAndSendReceipt(res, snapshot.docs[0].data())
      )
  )
);

/**
 * API to request server to generate the receipt for the given transaction ID
 * @name GET /receipt/transaction/:transactionID
 * @returns Receipt
 */
router.get(
  "/transaction/:transactionID",
  asyncWrap(async (req, res) =>
    fs
      .collection("receipts")
      .where("transactionID", "==", req.params.transactionID)
      .get()
      .then((snapshot) =>
        snapshot.empty
          ? res.status(404).json({ error: "Receipt not found" })
          : generateAndSendReceipt(res, snapshot.docs[0].data())
      )
  )
);

module.exports = router;
