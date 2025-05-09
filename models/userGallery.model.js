import mongoose from "mongoose";
import constants from "../utils/constants.js";

const userGallerySchema = mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        constants.CONST_STATUS_ACTIVE,
        constants.CONST_STATUS_INACTIVE,
        constants.CONST_STATUS_DELETED,
      ],
      default: constants.CONST_STATUS_ACTIVE,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "users",
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    isProfile:{
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: "userGallery",
    versionKey: false,
  }
);

const userGalleryModel = mongoose.model("userGallerySchema", userGallerySchema);

export default userGalleryModel;
