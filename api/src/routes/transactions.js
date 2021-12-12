/**
 * Express Router to let admin get transaction data
 * Mounted on /admin/transactions
 * @author JJ
 * @module Transaction APIs
 */

const express = require("express");
const router = express.Router();
const fs = require("../utils/fs");
const { asyncWrap } = require("express-error-middlewares");

/**
 * @todo Might make this directly accessible from client instead to have 1 less API
 * Get all transactions
 * @name GET /admin/transactions/all
 * @returns All transaction data
 */
router.get(
  "/all",
  asyncWrap(async (req, res) => {
    // @todo how to paginate data?
    // @todo Might not point to manualSale anymore in the future
    // @todo Maybe I should load from receipts instead??? Yea right??? Then this API should be receipts and not transactions..?
    // Actually no, a collection for transactions, and a collection for receipts...!
    fs.collection("receipts")
      .orderBy("createdAt", "desc")
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      )
      .then((transactions) => res.status(200).json({ transactions }));

    // @todo Alternative method
    // fs.collection("transactions")
    //   .listDocuments()
    //   .then((docRef) => docRef.map((doc) => doc.id))
    //   .then((transactions) => res.status(200).json({ transactions }));
  })
);

module.exports = router;
