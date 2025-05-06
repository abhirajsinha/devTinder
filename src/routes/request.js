const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();

// Send Connection Req
requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      res.status(400).json({
        message: "Invalid Status Type",
      });
    }

    // check if already existing connection between these users
    const isAlreadyConnected = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if(isAlreadyConnected){
      res.status(400).json({
        message: "Connection Request already exist",
      });
    }

    const connnectionRequestData = await ConnectionRequest.create({
      fromUserId,
      toUserId,
      status,
    });

    res.json({
      message: "Connection Request send successfully",
      data: connnectionRequestData,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = requestRouter;
