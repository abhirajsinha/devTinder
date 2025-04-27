const validator = require("validator");

const validateSignUpData = (req) => {
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

  // Basic validation
  if (!firstName || !lastName) {
    throw new Error("Please Enter Your First Name and Last Name");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Please Enter Correct Email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a Strong Password");
  }

  if (!age) {
    throw new Error("Please Enter Your Age");
  }

  if (!gender) {
    throw new Error("Please Enter Your Gender");
  }

  if (skills.length > 10) {
    throw new Error("You can Add Upto 10 Skills.");
  }
};

module.exports = { validateSignUpData };
