const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
module.exports = async function auth(req, res, next) {
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
  res.send("User Autheticated!");
};

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