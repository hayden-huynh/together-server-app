const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Admin = require("../models/Admin");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

mongoose
  .connect("mongodb://127.0.0.1:27017/check-in-data", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true,
  })
  .then(async () => {
    try {
      const username = "admin4811";
      const password = "4811LonelinessDetectionProject";
      const hashedPassword = await hashPassword(password);
      await Admin.create({
        username,
        password: hashedPassword,
      });
      console.log("New Admin Created");
      process.exit(0);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  });
