const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

// Send Connection Req
requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    // check the status type, this api only accepts below status types
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid Status Type",
      });
    }

    // check if the other user exist or not before sending connection req
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({
        message: "User Doesn't exist",
      });
    }

    // check if already existing connection between these users
    const isAlreadyConnected = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (isAlreadyConnected) {
      return res.status(400).json({
        message: "Connection Request already exist",
      });
    }

    const connnectionRequestData = await ConnectionRequest.create({
      fromUserId,
      toUserId,
      status,
    });

    return res.status(200).json({
      message:
        status === "interested"
          ? req.user.firstName + " is intrested in " + toUser.firstName
          : req.user.firstName + " is not intrested in " + toUser.firstName,
      data: connnectionRequestData,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = requestRouter;
