const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { User } = require("../models/user");
const auth = require("../controllers/auth");

router.post("/", auth);

module.exports = router;
