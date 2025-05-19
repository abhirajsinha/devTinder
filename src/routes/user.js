const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { statusTypes } = require("../utils/statusTypes");

const userSafeData = [
  "firstName",
  "lastName",
  "photoUrl",
  "about",
  "skills",
  "age",
  "gender",
];

// Router
const userRouter = express.Router();

// fetch user all pending connection requests
userRouter.get("/pending-connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: statusTypes.interested,
    }).populate("fromUserId", userSafeData);
    // you can also populate data with it, so here instead of [] we will use string and seperate with " "
    // "firstName lastName"

    return res.json({
      message: "Pending Requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    res.status(400).send({
      message: `Error: ${error.message}`,
    });
  }
});

// fetch all the users who are intrested in you
userRouter.get("/matches", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const matches = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: statusTypes.accepted },
        { fromUserId: loggedInUser._id, status: statusTypes.accepted },
      ],
    })
      .populate("fromUserId", userSafeData)
      .populate("toUserId", userSafeData);

    const data = matches.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    return res.json({
      data,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error " + error.message,
    });
  }
});

// user feed
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const interestedUsers = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: statusTypes.interested },
        { fromUserId: loggedInUser._id, status: statusTypes.interested },
      ],
    })
      .populate("fromUserId", userSafeData)
      .populate("toUserId", userSafeData);

    return res.json({
      data: interestedUsers,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error " + error.message,
    });
  }
});

module.exports = userRouter;
