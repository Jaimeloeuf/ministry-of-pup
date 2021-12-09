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

/**
 * API to request server to generate the receipt for the given receipt ID
 * @name GET /receipt/:receiptID
 * @returns Sucess indicator and receipt
 */
router.get(
  "/:receiptID",
  asyncWrap(async (req, res) => {
    const { receiptID } = req.params;

    // @todo Support getting either via receiptID or receiptNumber
    const snapshot = await fs.collection("manualSale").doc(receiptID).get();
    if (!snapshot.exists)
      return res.status(404).json({ error: "Receipt not found" });

    // Set content header first before generating receipt sending it to the client
    res.setHeader("Content-Type", "application/pdf");

    // Generate receipt, pipe it back to the client and end the connection
    await require("../utils/receipt")
      .generateReceiptString(snapshot.data().receiptData, res)
      .then(res.status(200).end);
  })
);

module.exports = router;
