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
  asyncWrap(async (req, res) => {
    const { receiptID } = req.params;

    // @todo Support getting either via receiptID or receiptNumber
    const snapshot = await fs.collection("receipts").doc(receiptID).get();
    if (!snapshot.exists)
      return res.status(404).json({ error: "Receipt not found" });

    generateAndSendReceipt(res, snapshot.data());
  })
);

/**
 * API to request server to generate the receipt for the given receipt number
 * @name GET /receipt/number/:receiptNumber
 * @returns Receipt
 */
router.get(
  "/number/:receiptNumber",
  asyncWrap(async (req, res) => {
    const { receiptNumber } = req.params;

    const snapshot = await fs
      .collection("receipts")
      .where("receiptNumber", "==", receiptNumber)
      .get();
    if (snapshot.empty)
      return res.status(404).json({ error: "Receipt not found" });

    generateAndSendReceipt(res, snapshot.docs[0].data());
  })
);

module.exports = router;
