const mongoose = require("mongoose");
const Joi = require("joi");

// Model Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }
});

// Create the Model
const Category = mongoose.model("Category", categorySchema);

// Validation with joi
function validateCategory(category) {
  const schema = { name: Joi.string().required() };
  return Joi.validate(category, schema);
}

module.exports.Category = Category;
module.exports.categorySchema = categorySchema;
module.exports.validateCategory = validateCategory;
