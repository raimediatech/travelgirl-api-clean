import mongoose from "mongoose";
import constants from "../utils/constants.js";
const citySchema = mongoose.Schema(
  {
    cityId: {
      type: String,
      default:""
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
      enum: [constants.CONST_STATUS_ACTIVE, constants.CONST_STATUS_INACTIVE,constants.CONST_STATUS_DELETED],
      default: constants.CONST_STATUS_ACTIVE,
    },
  },
  {
    timestamps: true,
    collection: "cities",
    versionKey: false,
  }
);
const cityModel = mongoose.model("citySchema", citySchema);

export default cityModel;
