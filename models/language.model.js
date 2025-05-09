import mongoose from "mongoose";
import constants from "../utils/constants.js";
const languageSchema = mongoose.Schema(
  {
    language: {
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
    collection: "languages",
    versionKey: false,
  }
);
const languageModel = mongoose.model("languageSchema", languageSchema);

export default languageModel;
