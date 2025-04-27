require("dotenv").config();
const connectToDatabase = require("./config/databases");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validations");

// Middleware
app.use(express.json());
app.use(cookieParser());

// POST endpoint for user signup
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = await jwt.sign({ _id: user._id }, "SECRET@KEY");
    res.cookie("token", token);

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

// Profile`
app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    const decodedMessage = await jwt.verify(token, "SECRET@KEY");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);    
    res.send("Reading Cookie");
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
});

// Delete user endpoint
app.delete("/delete-user", async (req, res) => {});

// Update user endpoint
app.patch("/update-user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    // API level validations
    const ALLOWED_UPDATES = ["userId", "photoUrl", "about", "skills"];
    const userData = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!userData) {
      throw new Error("This update is not allowed");
    }

    // Update User Data
    const user = await User.findByIdAndUpdate(userId, data, {
      // validators - [optional]
      returnDocument: "after",
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
});

// Connect to database and start server
connectToDatabase()
  .then(() => {
    console.log("Connected to database");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server is listening on port: " + (process.env.PORT || 3000));
    });
  })
  .catch((err) => {
    console.log("Error connecting to database");
    console.log(err);
  });
