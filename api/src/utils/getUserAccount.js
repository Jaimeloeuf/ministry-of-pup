const fs = require("./fs");

/** @typedef {String} DocumentID Alphanumeric ID of a firestore document */

/**
 * Get user document data directly because if userID exists, then the document must exists too
 * @param {DocumentID} userID User's Document ID
 * @returns {Promise<FirebaseFirestore.DocumentData | False>} Returns Account data if exists, else false
 */
const getUserAccount = async (userID) =>
  fs
    .collection("users")
    .doc(userID)
    .get()
    .then((doc) => doc.exists && { id: doc.id, ...doc.data() });

/**
 * Checks if user already have an account, if true, return account data, else undefined
 * @param {Number} phoneNumber User's SG phone number
 * @returns {Promise<FirebaseFirestore.DocumentData | false>} Account data if exists, else false
 */
const getUserAccountIfExists = (phoneNumber) =>
  fs
    .collection("users")
    .where("number", "==", phoneNumber)
    .get()
    .then((snapshot) =>
      snapshot.empty
        ? false
        : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
    );

/**
 * Checks if user already have an account, if true, return user ID, else undefined
 * @param {Number} phoneNumber User's SG phone number
 * @returns {Promise<DocumentID | undefined>} User ID if exists, else undefined
 */
const getUserAccountIdIfExists = async (phoneNumber) =>
  (await getUserAccountIfExists(phoneNumber))?.id;

module.exports = {
  getUserAccount,
  getUserAccountIdIfExists,
  getUserAccountIfExists,
};
