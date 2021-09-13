const jwt = require("jsonwebtoken");
const secret = require("../secret");

const verify_access = (req, res, next) => {
  const authHeaderContent = req.header("Authorization");
  if (authHeaderContent && authHeaderContent.startsWith("Bearer ")) {
    const authArr = authHeaderContent.split(" ");
    const token = authArr[1];
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.status(401).json({ error: "Please log in then try again" });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ error: "Please log in then try again" });
  }
};

module.exports = verify_access;
