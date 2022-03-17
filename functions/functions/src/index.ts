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
