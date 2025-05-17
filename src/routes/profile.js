const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");

// Router
const profileRouter = express.Router();

// Profile
profileRouter.get("/user-profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      data: user,
    });
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
});

profileRouter.patch("/profile-edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedinUser = req.user;
    Object.keys(req.body).forEach(
      (field) => (loggedinUser[field] = req.body[field])
    );
    // save data in db
    await loggedinUser.save();
    res.json({
      message: `Hey ${loggedinUser.firstName}, your profile has been updated!`,
      data: loggedinUser,
    });
  } catch (error) {
    console.log("Error: ", error.message);
  }
});

module.exports = profileRouter;
