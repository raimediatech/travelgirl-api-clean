import mongoose from "mongoose";
import constants from "../utils/constants.js";
const profileViewSchema = mongoose.Schema(
  {
    viewerId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "users",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "users",
      required: true,
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
    collection: "profileViews",
    versionKey: false,
  }
);
const profileViewModel = mongoose.model("profileViewSchema", profileViewSchema);

export default profileViewModel;
