const mongoose = require("mongoose");
const Joi = require("joi");

// Schema
const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  color: { type: String, required: true },
  seats: { type: Number, required: true },
  year: { type: Number, required: true },
  fuel: { type: String, required: true },
  available: { type: Boolean, default: true },
  valueDay: { type: Number, required: true }
});

// Model
const Car = mongoose.model("Car", carSchema);

// Fields validation with Joi
function validateCar(car) {
  const schema = {
    brand: Joi.string()
      .lowercase()
      .required(),
    model: Joi.string().required(),
    color: Joi.string()
      .lowercase()
      .required(),
    seats: Joi.number().required(),
    year: Joi.number().required(),
    fuel: Joi.string()
      .lowercase()
      .required(),
    available: Joi.boolean(),
    valueDay: Joi.number().required()
  };
  return Joi.validate(car, schema);
}

module.exports.Car = Car;
module.exports.validateCar = validateCar;
module.exports.carSchema = carSchema;
