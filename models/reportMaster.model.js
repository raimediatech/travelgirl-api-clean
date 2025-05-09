import mongoose from "mongoose";
import constants from "../utils/constants.js";

const reportMasterSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 200,
    },
    status: {
      type: String,
      enum: [
        constants.CONST_STATUS_ACTIVE,
        constants.CONST_STATUS_INACTIVE,
        constants.CONST_STATUS_IGNORE,
      ],
      default: constants.CONST_STATUS_ACTIVE,
    },
    childContent: {
      type: Boolean,
      default: constants.CONST_USER_VERIFIED_FALSE,
    },
  },
  {
    timestamps: true,
    collection: "reportMaster",
    versionKey: false,
  }
);

const reportMasterModel = mongoose.model("reportMasterSchema", reportMasterSchema);

export default reportMasterModel;
