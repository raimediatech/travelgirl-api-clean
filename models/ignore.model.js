import mongoose from "mongoose";
import constants from "../utils/constants.js";
const matchIgnoreSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "users",
      required: true,
    },
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: [constants.CONST_STATUS_ACTIVE, constants.CONST_STATUS_DELETED],
      default: constants.CONST_STATUS_ACTIVE,
    },
    repeatTime:{
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
    collection: "matchIgnore",
    versionKey: false,
  }
);
const matchIgnoreModel = mongoose.model("matchIgnoreSchema", matchIgnoreSchema);

export default matchIgnoreModel;
