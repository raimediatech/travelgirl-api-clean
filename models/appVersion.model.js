import mongoose from "mongoose";
import constants from "../utils/constants.js";
const appVersionSchema = mongoose.Schema(
  {
    device: {
      type: String,
      required: true,
    },
    version: {
      type: String,
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
    collection: "appVersion",
    versionKey: false,
  }
);
const appVersionModel = mongoose.model("appVersionSchema", appVersionSchema);

export default appVersionModel;
