import staticPageModel from "../models/staticPage.model.js";

const staticPageData = [
  {
    title: "About Us",
    slug: "about-us",
    description: "<div>About us description</div>",
  },
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    description: "<div>Privacy Policies description</div>",
  },
  {
    title: "Terms & Conditions",
    slug: "term-service",
    description: "<div>Terms & Conditions description</div>",
  },
  {
    title: "Contact Us",
    slug: "contact-us",
    description: "<div>Contact us description</div>",
  },
];

export async function seedStaticPageData() {
  try {
    const data = await staticPageModel.find();
    if (data?.length) {
      return;
    }
    // Insert the new data
    await staticPageModel.insertMany(staticPageData);
  } catch (error) {
    console.log("Error seeding data:", error);
  }
}
