import constants from "../utils/constants.js";
import appVersionModel from "../models/appVersion.model.js";
import helper from "../utils/helper.js";

const versionData = [
  {
    version: "1.0.0",
    device: constants.CONST_DEVICE_ANDROID,
  },
  {
    version: "1.0.0",
    device: constants.CONST_DEVICE_IOS,
  },
  {
    version: "1.0.0",
    device: constants.CONST_DEVICE_BROWSER,
  },
];
export async function seedAppVersionData() {
  try {
    const data = await appVersionModel.find({
      role: constants.CONST_ROLE_ADMIN,
    });
    if (data?.length) {
      return;
    }
    // Insert the new data
    await appVersionModel.insertMany(versionData);
  } catch (error) {
    console.log("Error seeding data:", error);
  }
}
