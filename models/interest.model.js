import mongoose from "mongoose";
import constants from "../utils/constants.js";

const interestSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: [
        constants.CONST_STATUS_ACTIVE,
        constants.CONST_STATUS_INACTIVE,
        constants.CONST_STATUS_DELETED,
      ],
      default: constants.CONST_STATUS_ACTIVE,
    },
  },
  {
    timestamps: true,
    collection: "interests",
    versionKey: false,
  }
);

const interestModel = mongoose.model("interestSchema", interestSchema);

export default interestModel;
