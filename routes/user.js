const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, isSeller } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(403).json({ err: "User already exists" });
    }
    if (!validateName(name)) {
      return res.status(400).json({ err: "Name validate failed" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ err: "Name validate failed" });
    }
    if (!validatePassword(name)) {
      return res.status(400).json({ err: "Name validate failed" });
    }
    const hashedPassword = await bcrypt.hash(password);
    const user = {
      email,
      name,
      isSeller,
      password: hashedPassword,
    };
    const createdUser = await User.create(user);

    return res.status(201).json({
      message: `Welcome ${createdUser.name}`,
    });
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
