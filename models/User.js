const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const questionnaireSchema = require("./Questionnaire");
const locationSchema = require("./Location");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email address is missing"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Provided email address is invalid"],
  },
  password: {
    type: String,
    required: [true, "Password is missing"],
    minLength: [6, "Password length must be at least 6 characters"],
  },
  questionnaireResponses: {
    type: [questionnaireSchema],
  },
  locations: {
    type: [locationSchema],
  },
});

userSchema.methods.hashPassword = async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
};

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const correctPassword = await bcrypt.compare(password, user.password);
    if (correctPassword) {
      return user;
    }
  }
  throw Error("Incorrect email or password");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
