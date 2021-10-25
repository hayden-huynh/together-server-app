const express = require("express");

const { User } = require("../models/User");
const verify_access = require("../utilities/authMiddleware");

const router = express.Router();

router.post("/save-response", verify_access, async (req, res, next) => {
  if (!req.body.userId || !req.body.responses || !req.body.locations) {
    res.status(400).json({ error: "Missing body attributes" });
  }
  const { userId, responses, locations } = req.body;

  try {
    const user = await User.findById(userId);
    responses.forEach((res) => {
      user.questionnaireResponses.push({
        timestamp: res.timestamp,
        entries: res.entries,
      });
    });
    locations.forEach((loc) => {
      user.locations.push(loc);
    });
    await user.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
  res.status(200).json({ success: "Your responses were successfully saved" });
});

module.exports = router;
