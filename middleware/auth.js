const jwt = require("jsonwebtoken");
const config = require("config");

//check if token is correct go to next otherwise send error
module.exports = function (req, res, next) {
  //get token from header
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decode = jwt.verify(token, config.get("jwtSecret"));
    req.user = decode.user;
    next();
  } catch (err) {
    res.status(401).json(err);
  }
};
