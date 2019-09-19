const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Car, validateCar } = require("../models/car");

router.get("/", async (req, res) => {
  try {
    const cars = await Car.find().sort({ _id: -1 });
    res.send(cars);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateCar(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const car = new Car(req.body);
    res.send(await car.save());
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateCar(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).send("Invalid car!");
    }
    const car = await Car.findById(req.params.id, req.body, { new: true });
    res.send(await car.save());
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid car!");
    }
    res.send(await Car.findByIdAndRemove(req.params.id));
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid car!");
    }
    const cars = await Car.findById(req.params.id);
    res.send(cars);
  } catch (error) {
    console.log(error);
  }
});

// Get by brand

router.get("/brand/:brand", async (req, res) => {
  try {
    const cars = await Car.find({
      brand: { $regex: new RegExp(req.params.brand, "i") }
    });
    res.send(cars);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
