/**
 * Express Router to let admin get user data of all users
 * Mounted on /admin/user/all
 * @author JJ
 * @module All User data routes
 */

const express = require("express");
const router = express.Router();
const fs = require("../utils/fs");
const { asyncWrap } = require("express-error-middlewares");

/**
 * @todo Might make this directly accessible from client instead to have 1 less API
 * @todo If not moved to client, might move this into user.js API and add the adminOnly middleware there
 * Get all users
 * @name GET /admin/user/all
 * @returns Sucess indicator and all user data
 */
router.get(
  "/",
  asyncWrap(async (req, res) => {
    // @todo how to paginate data?
    fs.collection("users")
      .orderBy("createdAt", "desc")
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      )
      .then((users) => res.status(200).json({ users }));

    // @todo Alternative method
    // fs.collection("users")
    //   .listDocuments()
    //   .then((docRef) => docRef.map((doc) => doc.id))
    //   .then((users) => res.status(200).json({ users }));
  })
);

module.exports = router;
