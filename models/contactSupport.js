import mongoose from "mongoose";
import constants from "../utils/constants.js";

const contactSupportSchema = mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      maxLength: 100,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    message: {
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
    collection: "contactSupport",
    versionKey: false,
  }
);

const contactSupportModel = mongoose.model(
  "contactSupportSchema",
  contactSupportSchema
);

export default contactSupportModel;
