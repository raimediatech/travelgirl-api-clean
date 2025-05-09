import mongoose from "mongoose";
import constants from "../utils/constants.js";
const bodyTypeSchema = mongoose.Schema(
  {
    bodyType: {
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
    collection: "bodyType",
    versionKey: false,
  }
);
const bodyTypeModel = mongoose.model("bodyTypeSchema", bodyTypeSchema);

export default bodyTypeModel;
