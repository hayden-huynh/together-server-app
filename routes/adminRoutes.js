const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { User } = require("../models/User");
const Timezone = require("../models/Timezone");
const AuthenticationCode = require("../models/AuthenticationCode");
const Admin = require("../models/Admin");
const Archive = require("../models/Archive");
const secret = require("../secret");

const router = express.Router();

const sessionDuration = 60 * 60; // 1 hour in seconds
const createToken = (userId) => {
  return jwt.sign({ userId }, secret, {
    expiresIn: sessionDuration,
  });
};

const verifyAdmin = (req, res, next) => {
  const token = req.cookies.adminToken;
  if (token) {
    jwt.verify(token, secret, (err) => {
      if (err) {
        res.redirect("/admin");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/admin");
  }
};

router.get("/admin", (req, res) => {
  const token = req.cookies.adminToken;
  if (token) {
    jwt.verify(token, secret, (err) => {
      if (err) {
        res.render("admin");
      } else {
        res.redirect("/statistics-overview");
      }
    });
  } else {
    res.render("admin");
  }
});

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUser = await Admin.findOne({ username }).exec();
    if (adminUser) {
      const correctPassword = await bcrypt.compare(
        password,
        adminUser.password
      );
      if (correctPassword) {
        const token = createToken(adminUser._id);
        res.cookie("adminToken", token, {
          httpOnly: true,
          maxAge: sessionDuration * 1000,
        });
        res.status(200).json({ success: "Admin Authenticated" });
      } else {
        res.status(400).json({ error: "Incorrect username or password" });
      }
    } else {
      res.status(400).json({ error: "Incorrect username or password" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
});

router.get("/admin-signout", (req, res) => {
  res.cookie("adminToken", "", { maxAge: 1 });
  res.redirect("/admin");
});

router.get("/statistics-overview", verifyAdmin, async (req, res) => {
  const allUsers = await User.find().select("-timezone -locations").exec();

  const participantCount = allUsers.length;

  let submissionCount = 0;
  allUsers.forEach((user) => {
    submissionCount += user.questionnaireResponses.length;
  });

  let stats = {
    q3: {
      question:
        "How would you rate your sense of connection to the people around you right now?",
      counts: [0, 0, 0, 0, 0],
    },
    q4: {
      question: "How would you rate your physical health right now?",
      counts: [0, 0, 0, 0, 0],
    },
    q5: {
      question: "How would you rate your mental health right now?",
      counts: [0, 0, 0, 0, 0],
    },
    q6: {
      question: "How would you rate your learning capacity right now?",
      counts: [0, 0, 0, 0, 0],
    },
    q7: {
      question:
        "How would you rate your sense of identification with The University of Queensland right now?",
      counts: [0, 0, 0, 0, 0],
    },
    q8: {
      question:
        "How would you rate your feeling on being in control right now?",
      counts: [0, 0, 0, 0, 0],
    },
  };
  allUsers.forEach((user) => {
    user.questionnaireResponses.forEach((response) => {
      for (let i = 2; i < 8; i++) {
        const ans = response.entries[i].answer;
        if (ans == "Terrible") {
          stats[`q${i + 1}`]["counts"][0] += 1;
        } else if (ans == "Not Good") {
          stats[`q${i + 1}`]["counts"][1] += 1;
        } else if (ans == "Average") {
          stats[`q${i + 1}`]["counts"][2] += 1;
        } else if (ans == "Good") {
          stats[`q${i + 1}`]["counts"][3] += 1;
        } else {
          stats[`q${i + 1}`]["counts"][4] += 1;
        }
      }
    });
  });

  res.render("statistics_overview", {
    allUsers,
    participantCount,
    submissionCount,
    stats: Object.values(stats),
  });
});

router.get("/download-all", verifyAdmin, async (req, res) => {
  const allData = await User.find().select("-__v").exec();
  const allDataJson = JSON.stringify(allData);
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=CheckIn-All-Data.json"
  );
  res.setHeader("Content-Type", "application/json");
  res.write(allDataJson, (err) => {
    res.end();
  });
});

router.get("/statistics-participant/:id", verifyAdmin, async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).select("-locations").exec();

  const usersCode = user.authenticationCode;
  const timezone = user.timezone;
  const submissionCount = user.questionnaireResponses.length;

  let stats = {
    q3: {
      question:
        "How would you rate your sense of connection to the people around you right now?",
      counts: [0, 0, 0, 0, 0],
    },
    q4: {
      question: "How would you rate your physical health right now?",
      counts: [0, 0, 0, 0, 0],
    },
    q5: {
      question: "How would you rate your mental health right now?",
      counts: [0, 0, 0, 0, 0],
    },
    q6: {
      question: "How would you rate your learning capacity right now?",
      counts: [0, 0, 0, 0, 0],
    },
    q7: {
      question:
        "How would you rate your sense of identification with The University of Queensland right now?",
      counts: [0, 0, 0, 0, 0],
    },
    q8: {
      question:
        "How would you rate your feeling on being in control right now?",
      counts: [0, 0, 0, 0, 0],
    },
  };
  user.questionnaireResponses.forEach((response) => {
    for (let i = 2; i < 8; i++) {
      const ans = response.entries[i].answer;
      if (ans == "Terrible") {
        stats[`q${i + 1}`]["counts"][0] += 1;
      } else if (ans == "Not Good") {
        stats[`q${i + 1}`]["counts"][1] += 1;
      } else if (ans == "Average") {
        stats[`q${i + 1}`]["counts"][2] += 1;
      } else if (ans == "Good") {
        stats[`q${i + 1}`]["counts"][3] += 1;
      } else {
        stats[`q${i + 1}`]["counts"][4] += 1;
      }
    }
  });

  res.render("statistics_participant", {
    userId: id,
    usersCode,
    timezone,
    submissionCount,
    stats: Object.values(stats),
    responses: user.questionnaireResponses,
  });
});

router.get("/download-participant/:id", verifyAdmin, async (req, res) => {
  const id = req.params.id;
  const participantData = await User.findById(id).select("-__v").exec();
  const participantDataJson = JSON.stringify(participantData);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=CheckIn-Participant-${participantData.authenticationCode}.json`
  );
  res.setHeader("Content-Type", "application/json");
  res.write(participantDataJson, (err) => {
    res.end();
  });
});

router.get("/auth-codes", verifyAdmin, async (req, res) => {
  const codes = await AuthenticationCode.find().exec();
  res.render("auth_codes", { codes });
});

router.post("/auth-codes", verifyAdmin, async (req, res) => {
  const { newCodes } = req.body;
  try {
    const codeArr = newCodes.split("\n");

    const allData = await User.find().select("-_id -__v").exec();
    if (allData.length != 0) {
      await Archive.create({
        timestamp: new Date().toLocaleString(),
        data: allData,
      });
      await User.deleteMany({}).exec();
      await Timezone.deleteMany({}).exec();
    }
    await AuthenticationCode.deleteMany({}).exec();

    let createNewCodes = [];
    codeArr.forEach((code) => {
      createNewCodes.push(
        AuthenticationCode.create({
          code: code,
          inUsage: false,
        })
      );
    });
    await Promise.all(createNewCodes);

    res.json({ success: "New Batch of Codes Applied" });
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
});

router.get("/archives", verifyAdmin, async (req, res) => {
  const archives = await Archive.find().select("-__v").exec();
  res.render("archive", { archives });
});

router.get("/download-archive/:id", verifyAdmin, async (req, res) => {
  const id = req.params.id;
  const archive = await Archive.findById(id).select("-__v").exec();
  const date = archive.timestamp.split(", ")[0];
  const hyphenDate = date.replaceAll("/", "-");
  const archiveData = archive.data;
  const archiveDataJson = JSON.stringify(archiveData);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=CheckIn_Archive_${hyphenDate}.json`
  );
  res.setHeader("Content-Type", "application/json");
  res.write(archiveDataJson, (err) => {
    res.end();
  });
});

module.exports = router;
