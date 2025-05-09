import mongoose from "mongoose";
import constants from "../utils/constants.js";
const hairTypeSchema = mongoose.Schema(
  {
    hairType: {
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
    collection: "hairType",
    versionKey: false,
  }
);
const hairTypeModel = mongoose.model("hairTypeSchema", hairTypeSchema);

export default hairTypeModel;
