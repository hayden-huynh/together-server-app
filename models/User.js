const mongoose = require("mongoose");

const questionnaireSchema = require("./Questionnaire");
const locationSchema = require("./Location");

const userSchema = new mongoose.Schema({
  authenticationCode: {
    type: String
  },
  questionnaireResponses: {
    type: [questionnaireSchema],
  },
  locations: {
    type: [locationSchema],
  },
});

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
