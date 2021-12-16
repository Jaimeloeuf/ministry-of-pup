/**
 * Function to create a new transaction in the system
 * @module Transaction DB interface
 */

const fs = require("../utils/fs");
const unixseconds = require("unixseconds");

/**
 * Simple validation function for an item object
 * @returns {boolean} Returns a boolean indicating if the item object is invalid
 */
const isItemInvalid = (item) =>
  !(
    item.name &&
    typeof item.name === "string" &&
    item.price &&
    typeof item.price === "number" &&
    item.quantity &&
    typeof item.quantity === "number" &&
    // Description is an optional string, only check type if it is there
    // Else defaults to true, to let the previous boolean expression pass through in the && conditional
    (item.description ? typeof item.description === "string" : true)
  );

/**
 * Creates a transaction from parameters and insert into the database
 * @returns {Promise<TransactionID>} Resolves to the transaction ID of the newly added transaction
 */
module.exports = async function createTransaction({
  time = unixseconds(),
  value,
  items,
  paymentMethod,
  buyer,

  // Seller defaults to MOP
  seller = "MOP",

  // Optional parameters, stored in a transaction object only for UI/Analytics
  receiptNumber,
  buyer_name,
  seller_name,
}) {
  /* Run checks for all the required fields */

  if (typeof value !== "number")
    throw new Error(
      `Add transaction failed: Invalid 'value', expects number, found ${value}`
    );

  if (!["Paynow", "Credit Card", "Cash", "Others"].includes(paymentMethod))
    throw new Error(
      `Add transaction failed: Invalid 'payment method, found ${paymentMethod}`
    );

  if (!Array.isArray(items))
    throw new Error(
      `Add transaction failed: Invalid 'items', expects array, found ${items}`
    );

  if (items.filter(isItemInvalid).length !== 0)
    throw new Error(`Add transaction failed: Invalid 'item' object in 'items`);

  // Checking type only and not checking if buyer's userID actually exists as that costs an extra read
  // Buyer can be a string ID or null to denote a transaction with an anonymous customer
  if (typeof buyer !== "string" && buyer !== null)
    throw new Error(
      `Add transaction failed: Invalid 'buyer', expects string, found ${buyer}`
    );

  // Checking type only and not checking if seller's userID actually exists as that costs an extra read
  if (typeof seller !== "string")
    throw new Error(
      `Add transaction failed: Invalid 'seller', expects string, found ${seller}`
    );

  // Create the default transaction with all the required fields
  const transaction = {
    time,
    value,

    // Not needed for now since by default all transactions should be in SGD
    // Only have to set this if we are ever dealing with other currencies
    // currency:"SGD",

    paymentMethod,
    buyer,
    seller,
    items,
  };

  // Only set these optional properties onto the transaction object if they are passed in
  // This is neccessary since our firestore config does not ignore undefined properties, and throws an error if undefined.
  if (receiptNumber) transaction.receiptNumber = receiptNumber;
  if (buyer_name) transaction.buyer_name = buyer_name;
  if (seller_name) transaction.seller_name = seller_name;

  // Returns Promise<TransactionID>
  return fs
    .collection("transactions")
    .add(transaction)
    .then(({ id }) => id);
};
