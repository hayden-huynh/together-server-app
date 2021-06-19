const express = require("express");
const mongoose = require("mongoose");
const Cat = require("./models/cat");

const app = express();

const dbURI = "mongodb://127.0.0.1:27017/cat";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((_) => {
    console.log("Connected to database!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));

app.use(express.json({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>Hello Hayden!</h1>");
});

app.post("/new-cat", (req, res) => {
  const cat = new Cat(req.body);

  cat
    .save()
    .then((result) => {
      res.send("<h1>Successfully Added New Catte!</h1>");
    })
    .catch((err) => {
      console.log(err);
    });
});
