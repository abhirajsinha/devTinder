const validator = require("validator");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxLength: [20, "First name must be less than 20 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxLength: [20, "Last name must be less than 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email: " + value);
        }
      },
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "Must be at least 18 years old"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    about: {
      type: String,
      trim: true,
      default: "about me",
    },
    photoUrl: {
      type: String,
      trim: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Please Enter a valid URL: " + value);
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "SECRET@KEY", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordEnteredByUser) {
  const user = this;
  const hashedPasswordInDb = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordEnteredByUser,
    hashedPasswordInDb
  );
  if (!isPasswordValid) {
    return false;
  }
  return true;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
