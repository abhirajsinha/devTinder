const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "ignored", "accepted", "rejected", "interested"],
        message: `Incorrect status type`,
      },
      default: "peding",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexing, because here we will have multiple api calls for the connection request and there we have to use these two fields { fromUserId, toUserId} so in that case it will make complex searches to optimise it we will provide index to both of them, so its called compound indexing
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequest;
