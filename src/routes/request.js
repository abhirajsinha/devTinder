const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

// Send Connection Req
requestRouter.post("/send-connection", userAuth, async (req, res) => {
  try {
  } catch (error) {
    res.status(404).message({});
  }
});

module.exports = requestRouter;
