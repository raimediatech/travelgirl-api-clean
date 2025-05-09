import mongoose from "mongoose";
import constants from "../utils/constants.js";

const celebritiesImagesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "celebritiesImages",
    versionKey: false,
  }
);

const celebritiesImagesModel = mongoose.model("celebritiesImagesSchema", celebritiesImagesSchema);

export default celebritiesImagesModel;
