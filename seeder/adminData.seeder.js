import constants from "../utils/constants.js";
import userModel from "../models/user.model.js";
import helper from "../utils/helper.js";

const adminData = {
    firstName: "Admin",
    lastName: "Admin",
    phone: "9999999999",
    country: "6627901882419b71a7810377",
    state: "6627901882419b71a7810377",
    city: "6627901882419b71a7810377",
    email: "admin@travelgirl.com",
    password: await helper.encryptPassword("An@123456"),
    status: constants.CONST_STATUS_ACTIVE,
    emailVerified: constants.CONST_USER_VERIFIED_TRUE,
    isAccountVerified: constants.CONST_USER_VERIFIED_TRUE,
    role: constants.CONST_ROLE_ADMIN,
    image: `${constants.CONST_USER_IMAGE}a.png`,
};

export async function seedAdminData() {
  try {
    const data = await userModel.find({ role: constants.CONST_ROLE_ADMIN });
    if (data?.length) {
      return;
    }
    // Insert the new data
    await userModel.insertMany(adminData);
  } catch (error) {
    console.log("Error seeding data:", error);
  }
}
