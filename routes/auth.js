const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid email or password");
  }
  res.send(
    generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
      category: user.category.name
    })
  );
});

function validateAuth(req) {
  const schema = {
    email: Joi.string()
      .email()
      .min(6)
      .max(255)
      .required(),
    password: Joi.string()
      .min(6)
      .max(255)
      .required()
  };
  return Joi.validate(req, schema);
}

// Generate token
function generateToken(params = {}) {
  const token = jwt.sign(params, config.get("jwtPrivateKey"));
  return token;
}
module.exports = router;
