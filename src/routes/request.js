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
    res.status(400).message({
      message: error.message,
    });
  }
});

module.exports = requestRouter;
