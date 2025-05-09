import mongoose from "mongoose";
import constants from "../utils/constants.js";
const userReportSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reportMaster",
      required: true,
    },
    reason: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: [
        constants.CONST_STATUS_ACTIVE,
        constants.CONST_STATUS_IGNORE,
        constants.CONST_STATUS_APPROVED,
        constants.CONST_STATUS_DELETED,
      ],
      default: constants.CONST_STATUS_ACTIVE,
    },
    isDeleted: {
      type: Boolean,
      enum: [
        constants.CONST_USER_VERIFIED_TRUE,
        constants.CONST_USER_VERIFIED_FALSE,
      ],
      default: constants.CONST_USER_VERIFIED_FALSE,
    },
  },
  {
    timestamps: true,
    collection: "userReport",
    versionKey: false,
  }
);

const userReportModel = mongoose.model("userReport", userReportSchema);

export default userReportModel;
