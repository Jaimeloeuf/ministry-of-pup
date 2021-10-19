import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// firebaseConfig auto generated in project settings
const firebaseApp = initializeApp({
  apiKey: "AIzaSyDjnXdzvj9hAwMnNfb6ogHbAPuMIx-q8uM",
  authDomain: "ministryofpup-ekd.firebaseapp.com",
  projectId: "ministryofpup-ekd",
  storageBucket: "ministryofpup-ekd.appspot.com",
  messagingSenderId: "33972741345",
  appId: "1:33972741345:web:dadff7677f0fa9398043a0",
});

const auth = getAuth(firebaseApp);

// Make firebase auth use browser's default language
auth.useDeviceLanguage();

/**
 * Only returns authentication header object if user is authenticated.
 * If user is unauthenticated, this does not throw and just returns undefined.
 * @function getAuthHeader
 * @returns {object | undefined} Authentication header object or nothing.
 */
async function getAuthHeader() {
  if (auth.currentUser)
    return { Authorization: `Bearer ${await auth.currentUser.getIdToken()}` };
}

// Export only the items that will be used
export { firebaseApp, auth, onAuthStateChanged, getAuthHeader };
