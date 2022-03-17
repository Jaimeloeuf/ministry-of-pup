/*
  Might migrate to gen2 cloud functions in the future
  https://cloud.google.com/functions/docs/2nd-gen/2nd-gen-differences
*/

import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

export const getDogs = functions
  /* Run function in Singapore only */
  .region("asia-southeast1")
  /* Modify the runtime constraints and behaviour of the cloud function */
  .runWith({
    // Default timeout of firebase function is 60 seconds
    // However this function does not need that long since it is just a FS call
    // Thus reducing timeout to ensure that it will not accidentally run too long
    timeoutSeconds: 10,

    // To prevent cost from exceeding
    // However this becomes vulnerable to DDoS, but at least DB wont get hit with recaptcha protection
    maxInstances: 20,
  })
  .https.onRequest((_, r) => {
    r.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    });
    getFirestore()
      .collection("dogs")
      .where("show", "==", true)
      .get()
      .then(({ docs }) => docs.map((doc) => doc.data()))
      .then((dogs) => r.status(200).json({ dogs }))
      .catch((_: Error) => r.status(500).json({ error: "Failed" }));
  });
