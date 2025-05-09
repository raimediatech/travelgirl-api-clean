import mongoose from "mongoose";
import constants from "../utils/constants.js";
const notificationSchema = mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "users",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "users",
      required: true,
    },

    notificationTitle: {
      type: String,
    },
    notificationBody: {
      type: String,
    },
    status: {
      type: String,
      enum: [constants.CONST_STATUS_PENDING, constants.CONST_STATUS_SUCCESS],
      default: constants.CONST_STATUS_PENDING,
    },
    pushNotificationResponse: {
      type: String,
      default: "",
    },
    isRead: {
      type: Boolean,
      default: constants.CONST_USER_VERIFIED_FALSE,
    },
    redirectionContain: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    collection: "notifications",
    versionKey: false,
  }
);
const notificationModel = mongoose.model(
  "notificationSchema",
  notificationSchema
);

export default notificationModel;
