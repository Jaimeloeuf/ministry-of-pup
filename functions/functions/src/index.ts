import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

export const getDogs = functions
  .region("asia-southeast1")
  .https.onRequest(
    (_, r) =>
      getFirestore()
        .collection("dogs")
        .where("show", "==", true)
        .get()
        .then(({ docs }) => docs.map((doc) => doc.data()))
        .then((dogs) => r.status(200).json({ dogs }))
        .catch((_: Error) => r.status(500).json({ error: "Failed" })) as any
  );
