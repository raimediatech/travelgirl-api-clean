import hairTypeModel from "../models/hair.model.js";

const hairArray = [
  { hairType: "Black" },
  { hairType: "Brown" },
  { hairType: "Blue" },
];

export async function seedHairTypeData() {
  try {
    const data = await hairTypeModel.find();
    if (data?.length) {
      return;
    }
    // Insert the new data
    await hairTypeModel.insertMany(hairArray);
  } catch (error) {
    console.log("Error seeding data:", error);
  }
}
