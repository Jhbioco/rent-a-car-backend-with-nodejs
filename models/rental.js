const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { carSchema } = require("./car");
const { userSchema } = require("./user");

// Schema

const rentalSchema = new mongoose.Schema({
  user: { type: userSchema, required: true },
  car: { type: carSchema, required: true },
  date: { type: Date, default: Date.now },
  days: { type: Number, required: true },
  rentalFee: { type: Number }
});

// Model
const Rental = mongoose.model("Rental", rentalSchema);

// Field validation with Joi

function validateRental(rental) {
  const schema = {
    userId: Joi.objectId().required(),
    carId: Joi.objectId().required(),
    days: Joi.number().required(),
    rentalFee: Joi.number()
  };
  return Joi.validate(rental, schema);
}

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;
