const mongoose = require("mongoose");

const { userSchema } = require("./User");

const archiveSchema = new mongoose.Schema({
  timestamp: {
    type: String,
    unique: true,
  },
  data: {
    type: [userSchema],
  },
});

const Archive = mongoose.model("archive", archiveSchema);

module.exports = Archive;
