import mongoose from "mongoose";
import constants from "../utils/constants.js";

const tripSchema = mongoose.Schema(
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
    tripType: {
      type: Number,
      enum: [constants.CONST_TRIP_SOLO, constants.CONST_TRIP_GROUP],
      default: constants.CONST_TRIP_SOLO,
    },
    address: {
      type: String,
      default: "",
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    country: {
      type: String,
      default: "",
    },
    flag: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    numberOfUsers: {
      type: Number,
      default: 0,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "users",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "trips",
    versionKey: false,
  }
);
tripSchema.index({ location: "2dsphere" });
const tripModel = mongoose.model("tripSchema", tripSchema);

export default tripModel;
