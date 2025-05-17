const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { statusTypes } = require("../utils/statusTypes");

// Router
const userRouter = express.Router();

// fetch user all pending connection requests
userRouter.get("/pending-connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: statusTypes.interested,
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "about",
      "skills",
    ]);
    // you can also populate data with it, so here instead of [] we will use string and seperate with " "
    // "firstName lastName"

    res.json({
      message: "Pending Requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    res.status(400).send({
      message: `Error: ${error.message}`,
    });
  }
});

module.exports = userRouter;
