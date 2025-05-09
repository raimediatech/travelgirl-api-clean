import bodyTypeModel from "../models/bodyType.model.js";

const bodyArray = [
  { bodyType: "Slim" },
  { bodyType: "Fatty" },
  { bodyType: "Average" },
];

export async function seedBodyTypeData() {
  try {
    const data = await bodyTypeModel.find();
    if (data?.length) {
      return;
    }
    // Insert the new data
    await bodyTypeModel.insertMany(bodyArray);
  } catch (error) {
    console.log("Error seeding data:", error);
  }
}
