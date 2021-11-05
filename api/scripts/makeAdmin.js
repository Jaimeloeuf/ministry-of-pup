const auth = require("@enkeldigital/firebase-admin").auth();
const getUser = (userEmail) => auth.getUserByEmail(userEmail);

async function makeAdmin(username) {
  try {
    const { uid } = await getUser(`${username}@ministryofpup.com`);

    await auth.setCustomUserClaims(uid, { admin: true });

    const userRecord = await auth.getUser(uid);

    console.log(userRecord, userRecord.customClaims.admin);
  } catch (error) {
    console.error(error);
  }
}

// Expected sample input from CLI: node .\scripts\makeAdmin.js api_tester user1 user2
// Set all of these usernames to be admin accounts with their isAdmin custom claim
Promise.all(process.argv.splice(2).map(makeAdmin)).then(() =>
  console.log("complete")
);
