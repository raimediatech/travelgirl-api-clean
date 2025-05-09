import mongoose from "mongoose";

const staticPageSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    website: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "staticPages",
    versionKey: false,
  }
);

const staticPageModel = mongoose.model("staticPageSchema", staticPageSchema);

export default staticPageModel;
