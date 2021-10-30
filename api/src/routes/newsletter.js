/**
 * Express Router for handling newsletter subscriptions
 * Mounted on /newsletter
 * @author JJ
 * @module Newsletter routes
 */

const express = require("express");
const router = express.Router();
const sendMail = require("../utils/sendMail");
const fs = require("../utils/fs");
const verifyRecaptcha = require("../utils/verifyRecaptcha");
const unixseconds = require("unixseconds");
const { asyncWrap } = require("express-error-middlewares");

const emailString = (newsletterDocID) => `
Hello,
<br />
<br />
Thank you for subscribing to our newsletter, our Puppy Minister will be sending important updates on puppies every now and then!
<br />
<br />
<hr />
<br />
Contact Details:
<br />
Whatsapp us through https://wa.me/6588022177
<br />
Email us at ministryofpup@gmail.com
<br />
Or call us at 8802,2177 daily between 11am - 8pm for help.
<br />
<br />
Unsubscribe <a href="https://ministryofpup.com/#/unsubscribe/${newsletterDocID}">here</a>`;

/**
 * Save subscription, assuming src is LP (Landing Page) and send them a email to confirm it
 * @todo Update to use sendgrid dynamic template
 *
 * @name POST /newsletter/subscribe
 * @returns Sucess indicator
 */
router.post("/subscribe", verifyRecaptcha, express.json(), async (req, res) => {
  try {
    const { email } = req.body;

    const snapshot = await fs
      .collection("newsletter")
      .where("email", "==", email)
      .get();

    // If the snapshot is empty, return false to specify user is not subscribed
    // Else if user has an account but the subscription was previously cancelled, resubscribe
    // Else assume only 1 document for that user, and return the first user document data
    if (snapshot.empty)
      await fs
        .collection("newsletter")
        .add({ email, src: "LP", time: unixseconds() })
        .then(({ id }) =>
          sendMail.send({
            to: email,
            from: process.env.notificationEmailSender,
            subject: `Ministry Of Pup: You are now Subscribed to cuteness!`,
            html: emailString(id),
          })
        );
    else if (snapshot.docs[0].data().cancelled)
      await fs
        .collection("newsletter")
        .doc(snapshot.docs[0].id)
        .update({
          cancelled: require("firebase-admin").firestore.FieldValue.delete(),
        });

    res.status(200).json({ ok: true });
  } catch (error) {
    res
      .status(400)
      .json({ ok: false, error: `Failed to subscribe\n${error.message}` });
  }
});

/**
 * Cancel a subscription but keeping data for future use/analytics, just adding a cancelled field
 * @name POST /newsletter/cancel/:newsletterDocID
 * @returns Sucess indicator
 */
router.post(
  "/cancel/:newsletterDocID",
  verifyRecaptcha,
  asyncWrap(async (req, res) =>
    fs
      .collection("newsletter")
      .doc(req.params.newsletterDocID)
      .update({ cancelled: true })
      .then(() => res.status(200).json({ ok: true }))
      .catch(() => res.status(400).json({ ok: false, error: "Cancel failed" }))
  )
);

module.exports = router;
