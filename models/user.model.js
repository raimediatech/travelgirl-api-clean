import mongoose from "mongoose";
import constants from "../utils/constants.js";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    deletedFirstName: {
      type: String,
      default: "",
    },
    deleteLastName: {
      type: String,
      default: "",
    },
    deletedImage: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      maxLength: 100,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    notification: {
      type: Boolean,
      required: true,
      enum: [
        constants.CONST_USER_VERIFIED_TRUE,
        constants.CONST_USER_VERIFIED_FALSE,
      ],
      default: constants.CONST_USER_VERIFIED_TRUE,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "cities",
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "countries",
      required: true,
    },
    phoneNumber: {
      type: String,
      maxLength: 10,
    },
    gender: {
      type: Number,
      enum: [constants.CONST_GENDER_MALE, constants.CONST_GENDER_FEMALE],
      default: 1,
    },
    password: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      default: "",
    },
    version: {
      type: String,
      default: "1.0.0",
    },
    profilePercentage: {
      type: Number,
      default: 0,
    },
    emailVerified: {
      type: Boolean,
      required: true,
      enum: [
        constants.CONST_USER_VERIFIED_TRUE,
        constants.CONST_USER_VERIFIED_FALSE,
      ],
      default: constants.CONST_USER_VERIFIED_FALSE,
    },

    isAccountVerified: {
      type: Boolean,
      required: true,
      enum: [
        constants.CONST_USER_VERIFIED_TRUE,
        constants.CONST_USER_VERIFIED_FALSE,
      ],
      default: constants.CONST_USER_VERIFIED_FALSE,
    },
    accountVerifiedTime: {
      type: String,
      default: "",
    },
    role: {
      type: Number,
      enum: [constants.CONST_ROLE_USER, constants.CONST_ROLE_ADMIN],
      comment: "1: Admin, 2: User",
    },

    status: {
      type: String,
      enum: [
        constants.CONST_STATUS_ACTIVE,
        constants.CONST_STATUS_INACTIVE,
        constants.CONST_STATUS_DELETED,
      ],
      default: constants.CONST_STATUS_INACTIVE,
    },
    timeZone: {
      type: String,
    },

    otp: {
      type: Number,
    },
    otpExpiry: {
      type: Date,
    },
    otpType: {
      type: String,
      enum: [constants.CONST_FORGOT_OTP, constants.CONST_REGISTER_OTP],
    },
    image: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: 0,
    },
    deviceToken: {
      type: String,
      default: null,
    },
    deviceType: {
      type: String,
      default: null,
    },

    isSubscriptionPurchased: {
      type: Boolean,
      default: false,
      index: true,
    },

    subscriptionId: {
      type: String,
      default: constants.CONST_SUBSCRIPTION_NONE,
      enum: [
        constants.CONST_SUBSCRIPTION_BOTH,
        constants.CONST_SUBSCRIPTION_MATCH,
        constants.CONST_SUBSCRIPTION_NOMAD,
        constants.CONST_SUBSCRIPTION_NONE,
      ],
    },
    purchaseDate: {
      type: Date,
      default: null,
    },
    boost: {
      type: Boolean,
      default: false,
    },
    boostCount: {
      type: Number,
      default: 0,
    },
    boostEndTime: {
      type: String,
      default: "",
    },
    profileAdded: {
      type: Boolean,
      default: false,
    },
    flag: {
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
    isLocation: {
      type: Boolean,
      default: false,
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
    cityPreferences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cities",
        default: null,
      },
    ],
    countryPreferences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "countries",
        default: null,
      },
    ],

    travelPreferences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cities",
        default: null,
      },
    ],
    hairType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hairType",
      default: null,
    },
    eyeType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "eyeType",
      default: null,
    },
    bodyType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bodyType",
      default: null,
    },
    height: {
      type: Number,
      min: [100, "Height must be at least 100 cm"], // Set minimum value with a custom message
      max: [200, "Height must not exceed 200 cm"],
    },
    language: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "languages",
        default: [],
      },
    ],
    interest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "interests",
        default: [],
      },
    ],
    document: {
      type: String,
      default: "",
    },
    vedio: {
      type: String,
      default: "",
    },
    vedioScreenShot: {
      type: String,
      default: "",
    },
    profileVerified: {
      type: Boolean,
      default: false,
    },
    cityName: {
      type: String,
      default: "",
    },
    countryName: {
      type: String,
      default: "",
    },
    socialMediaLink: [
      {
        type: mongoose.Schema.Types.Mixed,
        default: [],
      },
    ],
  },
  {
    timestamps: true,
    collection: "users",
    versionKey: false,
  }
);
userSchema.index({ location: "2dsphere" });
const userModel = mongoose.model("userSchema", userSchema);

export default userModel;
