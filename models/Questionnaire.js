const mongoose = require("mongoose");

const questionnaireEntrySchema = mongoose.Schema({
  question: {
    type: String,
  },
  answer: {
    type: String,
  },
});

const questionnaireSchema = mongoose.Schema({
  timestamp: {
    type: String,
  },
  entries: {
    type: [questionnaireEntrySchema],
  },
});

module.exports = questionnaireSchema;
