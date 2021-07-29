const express = require("express");

const Timezone = require("../models/Timezone");
const verify_access = require("../utilities/authMiddleware");

const router = express.Router();

router.post("/add-timezone", verify_access, async (req, res, next) => {
  if (!req.body.timezone || !req.body.topic) {
    res.status(400).json({ message: 'Missing "timezone" or "topic" property' });
  }
  const { timezone, topic } = req.body;

  try {
    await Timezone.create({ timezone, topic });
    res.status(201).json({ message: "Timezone Added" });
  } catch (err) {
    if (err.code === 11000) {
      res.status(202).json({ message: "Timezone Already Added" });
    } else {
      console.log(err);
      res.status(500).json({ message: "Unknown Error" });
    }
  }
});

module.exports = router;
