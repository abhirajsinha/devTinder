const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decodedObj = await jwt.verify(token, "SECRET@KEY");
    const { _id } = decodedObj;

    // find user
    const user = await User.findById(_id);    
    if (!user) {
      throw new Error("User not found");
    }

    // attach the user into request
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = {
  userAuth,
};