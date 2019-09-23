const jwt = require("jsonwebtoken");
const config = require("config");

function authToken(req, res, next) {
  const token = req.headers["auth-token"];
  if (!token) {
    return res.status(400).send("No token provided!");
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = authToken;
