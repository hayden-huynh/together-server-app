const express = require("express");
const jwt = require("jsonwebtoken");
const secret = require("../secret");
const User = require("../models/User");
const AuthenticationCode = require("../models/AuthenticationCode");

const router = express.Router();

let expiryTime = 365 * 24 * 60 * 60; // a year in seconds

const createToken = (authCode) => {
  return jwt.sign({ authCode }, secret, {
    expiresIn: expiryTime,
  });
};

router.post("/login", async (req, res, next) => {
  const { code, timezone } = req.body;
  try {
    const validCode = await AuthenticationCode.findOne({ code });
    if (validCode) {
      let user;
      if (validCode.inUsage) {
        // Find existing user
        user = await User.findOne({ authenticationCode: code });
      } else {
        // Set inUsage of the code to true
        validCode.inUsage = true;
        await validCode.save();
        // Create a new User document
        user = await User.create({
          authenticationCode: code,
          timezone: timezone,
          questionnaireResponses: [],
          locations: [],
        });
      }
      // Create token and respond with {user._id, token, expiryTime}
      const token = createToken(user.authenticationCode);
      res.status(200).json({ userId: user._id, token, expiryTime });
    } else {
      throw Error("Invalid Authentication Code");
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
