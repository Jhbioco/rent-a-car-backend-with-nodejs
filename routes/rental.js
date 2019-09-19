const express = require("express");
const router = express.Router();
const { Car, validateCar } = require("../models/car");
const { User, validateUser } = require("../models/user");
const { Rental, validateRental } = require("../models/rental");

router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find().sort({ _id: -1 });
    res.send(rentals);
  } catch (error) {
    console.log(error);
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
      return res.status(400).send("Inalid car");
    }
    if (!car.available) {
      return res.status(400).send("Car not available!");
    }
    const rental = new Rental({
      user: {
        name: user.name,
        surname: user.surname,
        category: {
          name: user.category.name
        },
        phoneNumber: user.phoneNumber,
        address: user.address,
        vat: user.vat,
        email: user.email,
        password: user.password
      },
      car: {
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
    if (rental) {
      car.available = false;
      await car.save();
    }
  } catch (error) {
    console.log(error);
  }
});
function rentalFee(price, days) {
  return price * days;
}

module.exports = router;
