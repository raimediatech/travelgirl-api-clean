import mongoose from "mongoose";
import constants from "../utils/constants.js";
const preferenceSchema = mongoose.Schema(
  {
    preference: {
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
    collection: "preferences",
    versionKey: false,
  }
);
const preferenceModel = mongoose.model("preferenceSchema", preferenceSchema);

export default preferenceModel;
