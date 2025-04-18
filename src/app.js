require("dotenv").config();
const connectToDatabase = require("./config/databases");
const express = require("express");
const app = express();
const User = require("./models/user");

// Middleware
app.use(express.json());

// POST endpoint for user signup
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password || !age || !gender) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
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
    console.error("Signup error:", error);

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid email or password",
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
