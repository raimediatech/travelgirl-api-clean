import mongoose from "mongoose";
import constants from "../utils/constants.js";

const subscriptionPlanSchema = mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
      trim: true,
    },
    planId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    duration: {
      type: Number, // in days
      required: true,
    },
    durationType: {
      type: String,
      enum: ["days", "months", "years"],
      default: "months",
    },
    features: [{
      type: String,
    }],
    planType: {
      type: String,
      enum: ["nomad", "match", "both", "none"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [constants.CONST_STATUS_ACTIVE, constants.CONST_STATUS_DELETED],
      default: constants.CONST_STATUS_ACTIVE,
    },
  },
  {
    timestamps: true,
    collection: "subscriptionPlans",
    versionKey: false,
  }
);

const subscriptionPlanModel = mongoose.model(
  "subscriptionPlan",
  subscriptionPlanSchema
);

export default subscriptionPlanModel;