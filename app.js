const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./routes/authRoutes");
const timezoneRouter = require("./routes/timezoneRoutes");
const User = require("./models/User");
const verify_access = require("./utilities/authMiddleware");
const { startupSchedule } = require("./utilities/scheduleCloudMessaging");

const app = express();

app.set("trust proxy", "loopback");

const dbURI = "mongodb://127.0.0.1:27017/dev";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true,
  })
  .then(async (_) => {
    // console.log("Connected to database!");
    await startupSchedule();
    app.listen(8081);
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));

app.use(express.json({ extended: true }));

app.use(authRouter);

app.use(timezoneRouter);

app.get("/", (req, res, next) => {
  res.send("It works!");
});

// app.post("/", (req, res, next) => {
//   console.log(req.body);
//   res.status(200).send("OK");
// });

app.post("/save-response", verify_access, async (req, res, next) => {
  if (!req.body.userId || !req.body.responses || !req.body.locations) {
    res.status(400).json({ error: "Missing body attributes" });
  }
  const { userId, responses, locations } = req.body;

  try {
    const user = await User.findById(userId);
    responses.forEach((res) => {
      user.questionnaireResponses.push({
        timestamp: res.timestamp,
        entries: res.entries,
      });
    });
    locations.forEach((loc) => {
      user.locations.push(loc);
    });
    await user.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
  res.status(200).json({ success: "Your responses were successfully saved" });
});
