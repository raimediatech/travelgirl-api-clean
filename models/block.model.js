import mongoose from "mongoose";
import constants from "../utils/constants.js";
const blockUserSchema = mongoose.Schema(
  {
    blockBy: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "users",
      required: true,
    },
    blockTo: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      enum: [constants.CONST_STATUS_BLOCK, constants.CONST_STATUS_UNBLOCK],
      default: constants.CONST_STATUS_BLOCK,
    },
  },
  {
    timestamps: true,
    collection: "blocks",
    versionKey: false,
  }
);
const blockUserModel = mongoose.model("blockUserSchema", blockUserSchema);

export default blockUserModel;
