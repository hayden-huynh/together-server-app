const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./routes/authRoutes");
const User = require("./models/User");
const verify_access = require("./authMiddleware");

const app = express();

const dbURI = "mongodb://127.0.0.1:27017/dev";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true,
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

app.use(authRouter);

// app.get("/", (req, res, next) => {
//   res.send("Hello there!");
// });

// app.post("/", (req, res, next) => {
//   console.log(req.body);
//   res.status(200).send("OK");
// });

app.post("/save-response", verify_access, async (req, res, next) => {
  if (!req.body.userId || !req.body.entries || !req.body.locations) {
    res.status(400).json({ error: "Missing body attributes" });
  }
  const { userId, entries, locations } = req.body;

  try {
    const user = await User.findById(userId);
    user.questionnaireResponses.push({ entries });
    locations.forEach(loc => {
      user.locations.push(loc);
    });
    await user.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
  res.status(200).json({ success: "Your responses were successfully saved" });
});
