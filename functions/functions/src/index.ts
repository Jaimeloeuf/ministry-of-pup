/*
  Might migrate to gen2 cloud functions in the future
  https://cloud.google.com/functions/docs/2nd-gen/2nd-gen-differences
*/

import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { request } from "https";
import type { https } from "firebase-functions";

initializeApp();

/**
 * verifyRecaptcha function resolves if recaptcha token is valid,
 * else it rejects with an Error
 */
const verifyRecaptcha = async ({ headers, socket }: https.Request) =>
  new Promise((resolve, reject) => {
    // Get the recaptcha token passed in as a header, note that headers are all lowercased by express
    const token = headers["x-recaptcha-token"];
    if (!token) return reject(new Error("Missing recaptcha token"));

    const req = request(
      {
        protocol: "https:",
        host: "www.google.com",
        method: "POST",

        path: `/recaptcha/api/siteverify?secret=${
          process.env.RECAPTCHA_SECRET
        }&response=${token}&remoteip=${
          headers["x-forwarded-for"] || socket.remoteAddress
        }`,
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`Recaptcha API failed: ${res.statusCode}`));
        }

        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("close", () => {
          const resp = JSON.parse(data);

          if (!resp.success) return reject(new Error(resp["error-codes"]));
          if (resp.score < 0.7)
            return reject(new Error(`Recaptcha score too low: ${resp.score}`));

          return resolve(resp);
        });
      }
    );

    req.on("error", reject);
    req.end();
  });

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
  .https.onRequest(async (req, r): Promise<any> => {
    // Set CORS header for all types of requests so that only requests from ministryofpup.com is allowed
    r.set("Access-Control-Allow-Origin", "https://ministryofpup.com");

    // For development use when on different localhost ports
    // r.set("Access-Control-Allow-Origin", "*");

    switch (req.method) {
      case "OPTIONS":
        // Set headers for CORS preflight request
        r.set({
          // Cache the response of this preflight request for 2 hours (Chromium max only 2 hours)
          "Access-Control-Max-Age": "7200",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "x-recaptcha-token",
        });
        return r.status(204).end();

      case "GET":
        // Verify recaptcha before returning users the data
        return verifyRecaptcha(req)
          .then(() =>
            getFirestore()
              .collection("dogs")
              .where("show", "==", true)
              .get()
              .then(({ docs }) => docs.map((doc) => doc.data()))
              .then((dogs) => r.status(200).json({ dogs }))
              .catch((_) => r.status(500).json({ error: "DB Failed" }))
          )
          .catch((e) => {
            console.error(e);
            r.status(403).json({ error: "Bad captcha" });
          });

      default:
        r.status(400).json({ error: "Invalid HTTP method" });
    }
  });
