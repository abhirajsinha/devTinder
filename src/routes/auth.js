const express = require("express");
require("dotenv").config();
const bcrypt = require('bcrypt');
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validations");
const User = require("../models/user");

// POST endpoint for user signup
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate Signup Data
    validateSignUpData(req);

    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      photoUrl,
      skills,
    } = req.body;

    // Encrypt Password before saving to database
    const saltRounds = process.env.SALT_ROUNDS
      ? parseInt(process.env.SALT_ROUNDS)
      : 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      age,
      gender,
      photoUrl,
      skills,
    });

    // Send success response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        gender: user.gender,
      },
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Handle other errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }

    // Other Errors
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Login endpoint
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // get JWT Token
    const token = await user.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 900000) });

    res.status(200).json({
      message: "Login Succesfull",
      success: true,
      user: user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }
});

module.exports = authRouter;
