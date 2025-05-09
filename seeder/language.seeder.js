import languageModel from "../models/language.model.js";

const languageArray = [
  { language: "Hindi" },
  { language: "English" },
  { language: "France" },
];

export async function seedLanguageData() {
  try {
    const data = await languageModel.find();
    if (data?.length) {
      return;
    }
    // Insert the new data
    await languageModel.insertMany(languageArray);
  } catch (error) {
    console.log("Error seeding data:", error);
  }
}
