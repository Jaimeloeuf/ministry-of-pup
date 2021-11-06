/**
 * Express Router to handle requests for reading and modifying user data
 * Mounted on /user
 * @author JJ
 * @module User routes
 */

const express = require("express");
const router = express.Router();
const fs = require("../utils/fs");
const { asyncWrap } = require("express-error-middlewares");

// @todo Might make this directly accessible from client instead

/**
 * Get user
 * @name GET /user/:userID
 * @returns Sucess indicator and the user's data
 */
router.get(
  "/:userID",
  asyncWrap(async (req, res) =>
    require("../utils/getUserAccount.js")
      .getUserAccount(req.params.userID)
      .then((user) => res.status(200).json({ user }))
  )
);

/**
 * Get user from phone number
 * @name GET /user/number/:number
 * @returns Sucess indicator and the user's data
 */
router.get(
  "/number/:number",
  asyncWrap(async (req, res) =>
    require("../utils/getUserAccount.js")
      .getUserAccountIfExists(req.params.number)
      .then((user) => res.status(user ? 200 : 404).json(user ? { user } : {}))
  )
);

/**
 * Create a new user in user collection
 * @name POST /user/new/:userID
 * @returns Sucess indicator
 */
router.post(
  "/new/:userID",
  express.json(),
  asyncWrap(async (req, res) =>
    require("../utils/createUserAccount")
      .createUserAccount(req.body)
      .then((userID) => res.status(200).json({ ok: true, userID }))
  )
);

/**
 * Update user data by spreading given request body into user doc
 * @name PUT /user/update/:userID
 * @returns Sucess indicator
 */
router.put(
  "/update/:userID",
  express.json(),
  asyncWrap(async (req, res) =>
    fs
      .collection("users")
      .doc(req.params.userID)
      .update(req.body)
      .then(() => res.status(200).json({ ok: true }))
  )
);

module.exports = router;
