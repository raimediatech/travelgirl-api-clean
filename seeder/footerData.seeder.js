import footerModel from "../models/footer.model.js";

let footerData = {
  footerEmail: "info@travelgirls-app.com",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
  contactNumber: "9999999999",
  facebookUrl: "https://www.facebook.com/",
  instagramUrl: "https://www.instagram.com/",
  tikTokUrl: "https://in.tiktok.com/",
  linkedinUrl: "https://in.linkedin.com/",
  needHelp: "44444444444",
};

export async function seedFooterData() {
  try {
    const data = await footerModel.find();
    if (data?.length) {
      return;
    }
    // Insert the new data
    await footerModel.insertMany(footerData);
  } catch (error) {
    console.log("Error seeding data:", error);
  }
}
