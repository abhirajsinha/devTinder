require('dotenv').config();
const express = require("express");
const connectToDatabase = require("./config/databases");
const app = express();
const User = require("./models/user");

// Middleware
app.use(express.json());

// POST endpoint for user signup
app.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender } = req.body;
    
    // Basic validation
    if (!firstName || !lastName || !email || !password || !age || !gender) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      age,
      gender
    });

    // Send success response
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        gender: user.gender
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
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
