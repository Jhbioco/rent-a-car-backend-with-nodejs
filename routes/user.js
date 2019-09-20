const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user");
const { Category } = require("../models/category");

router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    res.send(users);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const category = await Category.findById(req.body.categoryId);
    if (!category) {
      return res.status(400).send("Invalid Category!");
    }
    let user = new User({
      name: req.body.name,
      surname: req.body.surname,
      category: {
        name: category.name
      },
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      vat: req.body.vat,
      email: req.body.email,
      password: req.body.password
    });
    // Encrypt password with bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    res.send(await user.save());
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid user!");
    }
    const category = await Category.findById(req.body.categoryId);
    if (!category) {
      return res.status(400).send("Invalid Category!");
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        surname: req.body.surname,
        category: {
          name: category.name
        },
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        vat: req.body.vat,
        email: req.body.email,
        password: req.body.password
      },
      { new: true }
    );
    res.send(await user.save());
  } catch (error) {}
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid user!");
    }
    res.send(await User.findByIdAndRemove(req.params.id));
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid user!");
    }
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

// Get user by vat
router.get("/vat/:vat", async (req, res) => {
  try {
    const user = await User.find({ vat: req.params.vat });
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

// Get users by surname

router.get("/surname/:surname", async (req, res) => {
  try {
    const users = await User.find({
      surname: { $regex: new RegExp(req.params.surname, "i") }
    });
    res.send(users);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
