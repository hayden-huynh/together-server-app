const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoutes");
const timezoneRouter = require("./routes/timezoneRoutes");
const dataRouter = require("./routes/dataRoutes");
const adminRouter = require("./routes/adminRoutes");
const { startupSchedule } = require("./utilities/scheduleCloudMessaging");

const app = express();

app.set("trust proxy", "loopback");

app.use(express.urlencoded({ extended: true }));

app.use(express.json({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(cookieParser());

const dbURI = "mongodb://127.0.0.1:27017/check-in-data";
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

app.use(authRouter);

app.use(timezoneRouter);

app.use(dataRouter);

app.use(adminRouter);

app.get("/", (req, res, next) => {
  res.send("It works!");
});

// app.get("/", verify_access, (req, res, next) => {
//   res.send("Hello there!");
// });

// app.post("/", (req, res, next) => {
//   console.log(req.body);
//   res.status(200).send("OK");
// });
