import mongoose from "mongoose";
import constants from "../utils/constants.js";

const emailSchema = mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      maxLength: 100,
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
    collection: "email",
    versionKey: false,
  }
);

const emailModel = mongoose.model("emailSchema", emailSchema);

export default emailModel;
