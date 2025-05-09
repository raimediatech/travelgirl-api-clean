import preferenceModel from "../models/preference.model.js";

const preferenceArray = [
  { preference: "Adventure" },
  { preference: "Trekking" },
  { preference: "Canoeing" },
];

export async function seedPreferenceData() {
  try {
    const data = await preferenceModel.find();
    if (data?.length) {
      return;
    }
    // Insert the new data
    await preferenceModel.insertMany(preferenceArray);
  } catch (error) {
    console.log("Error seeding data:", error);
  }
}
