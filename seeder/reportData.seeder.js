import reportMasterModel from "../models/reportMaster.model.js";
import constants from "../utils/constants.js";
const reportPageArray = [
    { name: "Abusive language" },
    { name: "X rated content or pictures" },
    { name: "Fraud (Wrong name representation)" },
    { name: "Bullying" },
    {
      name: "Suggestions or Ideas",
      childContent: constants.CONST_USER_VERIFIED_TRUE,
    },
  ];

export async function seedReportMasterData() {
  try {
    const data = await reportMasterModel.find();
    if (data?.length) {
      return;
    }
    // Insert the new data
    await reportMasterModel.insertMany(reportPageArray);
  } catch (error) {
    console.log("Error seeding data:", error);
  }
}
