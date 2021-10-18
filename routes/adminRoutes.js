const express = require("express");

const User = require("../models/User");
const AuthenticationCode = require("../models/AuthenticationCode");

const router = express.Router();

router.get("/auth-codes", async (req, res) => {
  const codes = await AuthenticationCode.find().exec();
  res.render("auth_codes", { codes });
});

router.post("/auth-codes", async (req, res) => {
  const { newCodes } = req.body;
  try {
    const codeArr = newCodes.split("\n");

    await AuthenticationCode.deleteMany({}).exec();

    let createNewCodes = [];
    codeArr.forEach((code) => {
      createNewCodes.push(
        AuthenticationCode.create({
          code: code,
          inUsage: false,
        })
      );
    });
    await Promise.all(createNewCodes);

    res.json({ success: "New Batch of Codes Applied" });
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
});

module.exports = router;
