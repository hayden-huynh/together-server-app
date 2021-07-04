const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRoutes");

const app = express();

const dbURI = "mongodb://127.0.0.1:27017/dev";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((_) => {
    console.log("Connected to database!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));

app.use(express.json({ extended: true }));

app.get("/", (req, res, next) => {
  res.send("Hello there!");
});

app.use(authRouter);
