import mongoose from "mongoose";
import constants from "../utils/constants.js";
const userSubscriptionSchema = mongoose.Schema(
  {
    productId: {
      type: String,
      default: "",
    },
    response: {
      type: String,
    },
    paymentType: {
      type: String,
    },
    validTill: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      enum: [constants.CONST_STATUS_ACTIVE, constants.CONST_STATUS_DELETED],
      default: constants.CONST_STATUS_ACTIVE,
    },
  },
  {
    timestamps: true,
    collection: "userSubscriptions",
    versionKey: false,
  }
);
const userSubscriptionModel = mongoose.model(
  "userSubscriptionSchema",
  userSubscriptionSchema
);

export default userSubscriptionModel;
