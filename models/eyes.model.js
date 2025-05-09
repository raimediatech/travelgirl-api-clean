import mongoose from "mongoose";
import constants from "../utils/constants.js";
const eyeTypeSchema = mongoose.Schema(
  {
    eyeType: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [constants.CONST_STATUS_ACTIVE, constants.CONST_STATUS_INACTIVE],
      default: constants.CONST_STATUS_ACTIVE,
    },
  },
  {
    timestamps: true,
    collection: "eyeType",
    versionKey: false,
  }
);
const eyeTypeModel = mongoose.model("eyeTypeSchema", eyeTypeSchema);

export default eyeTypeModel;
