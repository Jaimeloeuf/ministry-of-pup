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

const emailString = (newsletterDocID) =>
  `Hello,

Thank you for subscribing to our newsletter, our Puppy Minister will be sending important updates on puppies every now and then!

-----

Contact Details:
Whatsapp us through https://wa.me/6588022177
Email us at ministryofpup@gmail.com
Or call us at 8802,2177 daily between 11am - 8pm for help
Unsubscribe https://ministryofpup.com/#/unsubscribe/${newsletterDocID}`;

/**
 * Save subscription, assuming src is LP (Landing Page) and send them a email to confirm it
 * @todo Update to use sendgrid dynamic template
 *
 * @name POST /newsletter/subscribe
 * @returns Sucess indicator
 */
router.post(
  "/subscribe",
  verifyRecaptcha,
  express.json(),
  asyncWrap(async (req, res) =>
    fs
      .collection("newsletter")
      .add({ email, src: "LP", time: unixseconds() })
      .then(({ id }) => ({
        to: req.body.email,
        from: process.env.notificationEmailSender,
        subject: `Ministry Of Pup: You are now Subscribed to cuteness!`,
        text: emailString(id),
      }))
      .then(sendMail.send)
      .then(() => res.status(200).json({ ok: true }))
  )
);

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
      .catch(() => res.status(400).json({ ok: true, error: "Cancel failed" }))
  )
);

module.exports = router;
