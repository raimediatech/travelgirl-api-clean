import mongoose from "mongoose";
import constants from "../utils/constants.js";
const newcitySchema = mongoose.Schema(
  {
    cityId: {
      type: Number,
      default:0
    },
    name: {
      type: String,
      required: true,
    },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "countries",
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
    collection: "newcities",
    versionKey: false,
  }
);
const newcityModel = mongoose.model("newcitySchema", newcitySchema);

export default newcityModel;
