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

// Export only the items that will be used
export { auth, onAuthStateChanged };
