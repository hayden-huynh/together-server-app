const mongoose = require("mongoose");

const questionnaireSchema = require("./Questionnaire");
const locationSchema = require("./Location");

const userSchema = new mongoose.Schema({
  authenticationCode: {
    type: String,
  },
  timezone: {
    type: String,
  },
  questionnaireResponses: {
    type: [questionnaireSchema],
  },
  locations: {
    type: [locationSchema],
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
