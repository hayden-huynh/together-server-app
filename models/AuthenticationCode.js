const mongoose = require("mongoose");

const authenticationCodeSchema = mongoose.Schema({
  code: {
    type: String,
    unique: true,
    minLength: 6,
    maxLength: 6,
  },
  inUsage: {
    type: Boolean,
    default: false,
  },
});

const AuthenticationCode = mongoose.model("code", authenticationCodeSchema);

module.exports = AuthenticationCode;
