const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { categorySchema } = require("./category");

// Create the user Schema
const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 6, required: true },
  surname: { type: String, minlength: 3, required: true },
  category: { type: categorySchema, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, minlength: 6, required: true },
  vat: { type: String, maxlength: 9, required: true },
  email: { type: String, minlength: 6, maxlength: 255, required: true },
  password: { type: String, minlength: 6, maxlength: 255, required: true }
});

// Create the model
const User = mongoose.model("User", userSchema);

// Field alidation with Joi
function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(6)
      .required(),
    surname: Joi.string()
      .min(3)
      .required(),
    categoryId: Joi.objectId().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string()
      .min(6)
      .required(),
    vat: Joi.string()
      .max(9)
      .required(),
    email: Joi.string()
      .email()
      .min(6)
      .max(40)
      .required(),
    password: Joi.string()
      .min(6)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.validateUser = validateUser;
