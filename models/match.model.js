import mongoose from "mongoose";
import constants from "../utils/constants.js";
const matchSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "users",
      required: true,
    },
    like:{
      type: Boolean,
      default: false,
    },
    wink:{
      type: Boolean,
      default: false,
    },
    superLike:{
      type: Boolean,
      default: false,
    },
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        constants.CONST_STATUS_ACTIVE,
        constants.CONST_STATUS_INACTIVE,
        constants.CONST_STATUS_DELETED,
      ],
      default: constants.CONST_STATUS_INACTIVE,
    },
    request: {
      type: Boolean,
      default: true,
    },
    requestStatus: {
      type: String,
      enum: [
        constants.CONST_STATUS_PENDING,
        constants.CONST_STATUS_ACCEPT,
        constants.CONST_STATUS_IGNORE,
      ],
      default: constants.CONST_STATUS_PENDING,
    },
  },
  {
    timestamps: true,
    collection: "matches",
    versionKey: false,
  }
);
const matchModel = mongoose.model("matchSchema", matchSchema);

export default matchModel;
