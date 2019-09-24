const express = require("express");
const router = express.Router();
const { Category, validateCategory } = require("../models/category");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ _id: -1 });
    res.send(categories);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateCategory(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const category = new Category(req.body);
    res.send(await category.save());
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid category!");
    }
    const { error } = validateCategory(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name
      },
      { new: true }
    );
    res.send(await category.save());
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid category");
    }
    res.send(await Category.findByIdAndRemove(req.params.id));
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid category");
    }
    const category = await Category.findById(req.params.id);
    res.send(category);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
