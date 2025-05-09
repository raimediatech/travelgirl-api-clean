import mongoose from "mongoose";
const newcountrySchema = mongoose.Schema(
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
    collection: "newcountries",
    versionKey: false,
  }
);
const newcountryModel = mongoose.model("newcountrySchema", newcountrySchema);

export default newcountryModel;
