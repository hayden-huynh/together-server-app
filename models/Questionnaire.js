const mongoose = require("mongoose");

const questionnaireEntrySchema = mongoose.Schema({
  question: {
    type: String,
  },
  answer: {
    type: String,
  },
});

const questionnaireSchema = mongoose.Schema(
  {
    entries: {
      type: [questionnaireEntrySchema],
    },
  },
  { timestamps: true }
);

module.exports = questionnaireSchema;
