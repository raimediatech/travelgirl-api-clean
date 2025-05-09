import mongoose from "mongoose";
const countrySchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    countryId: {
      type: Number,
    },
    countryCode: {
      type: String,
    },
    flag:{
      type: String,
      default:"",
    },
    phoneCode: {
      type: String,
    },
    currency: {
      type: String,
    },
    symbol: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "countries",
    versionKey: false,
  }
);
const countryModel = mongoose.model("countrySchema", countrySchema);

export default countryModel;
