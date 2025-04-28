const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();

// Profile
profileRouter.get("/user-profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
});

module.exports = profileRouter;
