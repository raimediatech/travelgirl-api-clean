import mongoose from "mongoose";
import constants from "../utils/constants.js";

const faqSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [constants.CONST_STATUS_ACTIVE, constants.CONST_STATUS_INACTIVE],
      default: constants.CONST_STATUS_ACTIVE,
    },
  },
  {
    timestamps: true,
    collection: "faq",
    versionKey: false,
  }
);

const faqModel = mongoose.model("faqSchema", faqSchema);

export default faqModel;
