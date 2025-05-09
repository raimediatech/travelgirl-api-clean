import mongoose from "mongoose";
import constants from "../utils/constants.js";

const footerSchema = mongoose.Schema(
  {
    footerEmail: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      maxLength: 100,
    },
    description: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    facebookUrl: {
      type: String,
    },
    instagramUrl: {
      type: String,
    },
    tikTokUrl: {
      type: String,
    },
    linkedinUrl: {
      type: String,
    },
    needHelp: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "footerContent",
    versionKey: false,
  }
);

const footerModel = mongoose.model("footerSchema", footerSchema);

export default footerModel;
