const express = require("express");
const jwt = require("jsonwebtoken");
const secret = require("../secret");
const User = require("../models/User");

const router = express.Router();

const normalDuration = 10; // seconds
const longDuration = 365 * 24 * 60 * 60; // seconds
let expiryTime;

const createToken = (userId, rememberMe) => {
  expiryTime = rememberMe ? longDuration : normalDuration;
  return jwt.sign({ userId }, secret, {
    expiresIn: expiryTime,
  });
};

const parseErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message.includes("user validation failed")) {
    // Extract Validation error message from "err" object
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  } else if (err.code === 11000) {
    // Duplication of email address
    errors.email = "Email address is already registered";
  }

  return errors;
};

router.post("/signup", async (req, res, next) => {
  const { email, password, rememberMe } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id, rememberMe);
    res.status(200).json({ userId: user._id, token, expiryTime });
  } catch (err) {
    const errors = parseErrors(err);
    res.status(400).json({ errors });
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password, rememberMe } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id, rememberMe);
    res.status(200).json({ userId: user._id, token, expiryTime });
  } catch (err) {
    res.status(400).json({ errors: { message: err.message } });
  }
});

module.exports = router;
