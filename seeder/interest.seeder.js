import interestModel from "../models/interest.model.js";

const interestArray = [
  { name: "Dancing", icon: "" },
  { name: "Movie", icon: "" },
  { name: "Food", icon: "" },
  { name: "Art", icon: "" },
  { name: "Music", icon: "" },
  { name: "Reading", icon: "" },
  { name: "Technology", icon: "" },
  { name: "Travel", icon: "" },
  { name: "Sports", icon: "" },
  { name: "Pet Lovers", icon: "" },
  { name: "Yoga", icon: "" },
  { name: "Fashion & Beauty", icon: "" },
  { name: "Photography", icon: "" },
  { name: "Meditation", icon: "" },
  { name: "Homebody", icon: "" },
];

export async function seedInterestData() {
  try {
    const data = await interestModel.find();
    if (data?.length) {
      return;
    }
    // Insert the new data
    await interestModel.insertMany(interestArray);
  } catch (error) {
    console.log("Error seeding data:", error);
  }
}
