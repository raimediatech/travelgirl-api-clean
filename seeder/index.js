import mongoose from "mongoose";
import connect from "../utils/dbConnection.js";

import { seedAdminData } from "./adminData.seeder.js";
import { seedStaticPageData } from "./staticPage.seeder.js";
import { seedCountryCityData } from "./countryCity.seeder.js";
import { seedFooterData } from "./footerData.seeder.js";
import { seedReportMasterData } from "./reportData.seeder.js";
import { seedLanguageData } from "./language.seeder.js";
import { seedBodyTypeData } from "./bodyType.seeder.js";
import { seedEyeTypeData } from "./eye.seeder.js";
import { seedHairTypeData } from "./hair.seeder.js";
import { seedPreferenceData } from "./preferences.seeder.js";
import { seedInterestData } from "./interest.seeder.js";
import countryModel from "../models/country.model.js";
import { seedAppVersionData } from "./appVersion.seeder.js";

async function runSeeders() {
  try {
    // Connect to MongoDB
    await connect();
    // Run seeders

    await seedAdminData();
    await seedStaticPageData();
    await seedCountryCityData();
    await seedFooterData();
    await seedReportMasterData();
    await seedLanguageData();
    await seedBodyTypeData();
    await seedEyeTypeData();
    await seedHairTypeData();
    await seedPreferenceData();
    await seedInterestData();
    await seedAppVersionData();
    // Run other seeders as needed
    console.log("Seeders executed successfully.");
    // let data=await countryModel.find();
    // for(let i=0; i<data.length;i++){
    //   let country=await cityModel.find
    // }
    // Disconnect from MongoDB
    await mongoose.disconnect();
    process.exit(0); // Exit the script
  } catch (error) {
    console.log("Error executing seeders:", error);
    process.exit(1); // Exit the script with an error
  }
}
runSeeders();
