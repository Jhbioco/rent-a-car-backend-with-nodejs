const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Car, validateCar } = require("../models/car");
const { User, validateUser } = require("../models/user");
const { Rental, validateRental } = require("../models/rental");

router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find().sort({ _id: -1 });
    res.send(rentals);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateRental(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(400).send("Invalid user");
    }
    const car = await Car.findById(req.body.carId);
    if (!car) {
      return res.status(400).send("Invalid car");
    }
    if (!car.available) {
      return res.status(400).send("Car not available!");
    }
    const rental = new Rental({
      user: {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        category: {
          _id: user.category._id,
          name: user.category.name
        },
        phoneNumber: user.phoneNumber,
        address: user.address,
        vat: user.vat,
        email: user.email,
        password: user.password
      },
      car: {
        _id: car._id,
        brand: car.brand,
        model: car.model,
        color: car.color,
        seats: car.seats,
        year: car.year,
        fuel: car.fuel,
        valueDay: car.valueDay
      },
      days: req.body.days,
      rentalFee: rentalFee(car.valueDay, req.body.days)
    });
    res.send(await rental.save());

    car.available = false;
    await car.save();
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateRental(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Ivalid rental!");
    }
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(400).send("Invalid user");
    }
    const car = await Car.findById(req.body.carId);
    if (!car) {
      return res.status(400).send("Invalid car");
    }

    const rental = await Rental.findByIdAndUpdate(
      req.params.id,
      {
        user: {
          _id: user._id,
          name: user.name,
          surname: user.surname,
          category: {
            _id: user.category._id,
            name: user.category.name
          },
          phoneNumber: user.phoneNumber,
          address: user.address,
          vat: user.vat,
          email: user.email,
          password: user.password
        },
        car: {
          _id: car._id,
          brand: car.brand,
          model: car.model,
          color: car.color,
          seats: car.seats,
          year: car.year,
          fuel: car.fuel,
          valueDay: car.valueDay
        },
        days: req.body.days,
        rentalFee: rentalFee(car.valueDay, req.body.days)
      },
      { new: true }
    );
    res.send(await rental.save());

    car.available = false;
    await car.save();
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Ivalid rental!");
    }
    const rental = await Rental.findById(req.params.id);
    res.send(rental);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid rental!");
    }
    const rental = await Rental.findByIdAndRemove(req.params.id);
    res.send(rental);
  } catch (error) {
    res.send(error.message);
  }
});

// Calculate rental fee
function rentalFee(price, days) {
  return price * days;
}

module.exports = router;
