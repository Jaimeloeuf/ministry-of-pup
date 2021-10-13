/**
 * Express Router for adding a new pet into the system
 * Mounted on /admin/pet/new
 * @author JJ
 * @module New pet route
 */

const express = require("express");
const router = express.Router();
const fs = require("../utils/fs");
const unixseconds = require("unixseconds");
const { asyncWrap } = require("express-error-middlewares");

/**
 * Add new a pet into the system
 * @name POST /admin/pet/new
 * @returns Sucess indicator
 */
router.post(
  "/",
  express.json(),
  asyncWrap(async (req, res) => {
    const {
      availablityDate,
      dob,
      dogSexID,
      name,
      copyWriting,
      mcNumber,
      pedigree,
      dogTypeID,
    } = req.body;

    const { id: dogID } = await fs.collection("dogs").add({
      availablityDate,
      dob,
      dogSexID,
      name,
      copyWriting,
      mcNumber,
      pedigree,
      dogTypeID,

      // The dog is not sold by default
      // Needs to have a sold: false field because cannot filter for != if the field does not exists
      // Thus need to have a sold: false field to indicate that it is not sold yet when filtering for available dogs
      sold: false,

      // Store time dog is added into the system in unix seconds (this is the time of the server executing the code)
      createdAt: unixseconds(),
    });

    res.status(200).json({ ok: true, dogID });
  })
);

module.exports = router;
