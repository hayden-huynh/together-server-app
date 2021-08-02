const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  timestamp: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
});

module.exports = locationSchema;
