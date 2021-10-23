/** @typedef {String} DocumentID Alphanumeric ID of a firestore document */

/**
 * Get user document data directly because if userID exists, then the document must exists too
 * @param {DocumentID} userID User's Document ID
 * @returns {FirebaseFirestore.DocumentData} Account data
 */
// const getUserAccount = async (userID) =>
//   (await fs.collection("users").doc(userID).get()).data();
async function getUserAccount(userID) {
  const userDoc = await fs.collection("users").doc(userID).get();
  return { id: userDoc.id, ...userDoc.data() };
}

/**
 * Checks if user already have an account, if true, return account data, else undefined
 * @param {Number} phoneNumber User's SG phone number
 * @returns {FirebaseFirestore.DocumentData | undefined} Account data if exists, else undefined
 */
async function getUserAccountIfExists(phoneNumber) {
  const snapshot = await fs
    .collection("users")
    .where("number", "==", phoneNumber)
    .get();

  // If the snapshot is empty, return undefined to specify user does not have an account
  // Else assume only 1 document for that user, and return the first user document data
  if (snapshot.empty) return undefined;
  else return snapshot.docs[0].data();
}

/**
 * Checks if user already have an account, if true, return user ID, else undefined
 * @param {Number} phoneNumber User's SG phone number
 * @returns {DocumentID | undefined} User ID if exists, else undefined
 */
const getUserAccountIdIfExists = async (phoneNumber) =>
  (await getUserAccountIdIfExists(phoneNumber))?.id;

module.exports = {
  getUserAccount,
  getUserAccountIdIfExists,
  getUserAccountIfExists,
};
