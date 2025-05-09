import eyeTypeModel from "../models/eyes.model.js";

const eyeArray = [
  { eyeType: "Black" },
  { eyeType: "Brown" },
  { eyeType: "Blue" },
];

export async function seedEyeTypeData() {
  try {
    const data = await eyeTypeModel.find();
    if (data?.length) {
      return;
    }
    // Insert the new data
    await eyeTypeModel.insertMany(eyeArray);
  } catch (error) {
    console.log("Error seeding data:", error);
  }
}
