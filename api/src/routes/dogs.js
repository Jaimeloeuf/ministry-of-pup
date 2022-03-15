/**
 * Express Router for getting all the pets from system
 * Mounted on /admin/pet
 * @author JJ
 * @module Get pet routes
 */

const express = require("express");
const router = express.Router();
const fs = require("../utils/fs");
const { asyncWrap } = require("express-error-middlewares");

// @todo A /sold API for all dogs that are already sold
// These routes can be replaced, by making admin app access these data from firestore directly,
// as no processing is needed just data access and is only for admin, to reduce load on cloud run.

/**
 * Get all available pets from the system
 * @name GET /admin/pet/available
 * @returns An array of pets
 */
router.get(
  "/available",
  asyncWrap(async (req, res) => {
    const snapshot = await fs
      .collection("dogs")
      // Needs to have a sold: false field because cannot filter for != if the field does not exists
      // Thus need to have a sold: false field to indicate that it is not sold yet
      .where("sold", "==", false)
      .get();

    // Map the array of docs into an array of doc data with the doc ID included
    // Reduce the array of objects into a single object keyed by the doc IDs
    const dogs = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {});

    // Alternatively send back id only and get frontend to load the dogs 1 by 1
    // However unlike classexpress, there isn't alot of dogs, which means that
    // it might actually be better to just load all at once through this API.
    // const dogs = snapshot.docs.map((doc) => doc.id);

    res.status(200).json({ dogs });
  })
);

/**
 * Get a pet from the system
 * @name GET /admin/pet/:dogID
 * @returns An array of pets
 */
router.get(
  "/:dogID",
  asyncWrap(async (req, res) =>
    fs
      .collection("dogs")
      .doc(req.params.dogID)
      .get()
      .then((doc) =>
        res.status(200).json({ dog: { id: doc.id, ...doc.data() } })
      )
  )
);

/**
 * Update a pet's details
 * @name POST /admin/pet/update/:dogID
 */
router.post(
  "/update/:dogID",
  express.json(),
  asyncWrap(async (req, res) =>
    fs
      .collection("dogs")
      .doc(req.params.dogID)
      .update(req.body)
      .then(() => res.status(200).json({}))
  )
);

module.exports = router;
