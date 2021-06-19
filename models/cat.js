const mongoose = require("mongoose");
const { Schema } = mongoose;

const catSchema = new Schema(
  {
    name: String,
    color: String,
    gender: String,
  },
  {
    timestamps: true,
  }
);

const Cat = mongoose.model('Cat', catSchema);

module.exports = Cat;
