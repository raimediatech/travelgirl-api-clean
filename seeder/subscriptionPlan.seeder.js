import subscriptionPlanModel from "../models/subscriptionPlan.model.js";
import constants from "../utils/constants.js";

const subscriptionPlanSeeder = async () => {
  try {
    const existingPlans = await subscriptionPlanModel.find({
      status: constants.CONST_STATUS_ACTIVE
    });

    if (existingPlans.length > 0) {
      console.log("Subscription plans already exist, skipping seeder");
      return;
    }

    const defaultPlans = [
      {
        planName: "Free Plan",
        planId: constants.CONST_SUBSCRIPTION_NONE,
        description: "Basic features for new users",
        price: 0,
        currency: "USD",
        duration: 30,
        durationType: "days",
        features: [
          "Basic profile creation",
          "Limited matches per day",
          "Basic messaging"
        ],
        planType: "none",
        isActive: true,
        isPopular: false,
        sortOrder: 1
      },
      {
        planName: "Nomad Plan",
        planId: constants.CONST_SUBSCRIPTION_NOMAD,
        description: "Perfect for travelers and digital nomads",
        price: 9.99,
        currency: "USD",
        duration: 1,
        durationType: "months",
        features: [
          "Unlimited travel matching",
          "Location-based discovery",
          "Travel buddy finder",
          "City-specific matches",
          "Priority support"
        ],
        planType: "nomad",
        isActive: true,
        isPopular: true,
        sortOrder: 2
      },
      {
        planName: "Match Plan",
        planId: constants.CONST_SUBSCRIPTION_MATCH,
        description: "Enhanced dating and relationship features",
        price: 14.99,
        currency: "USD",
        duration: 1,
        durationType: "months",
        features: [
          "Unlimited daily matches",
          "Advanced filters",
          "Read receipts",
          "Super likes",
          "Profile boost"
        ],
        planType: "match",
        isActive: true,
        isPopular: false,
        sortOrder: 3
      },
      {
        planName: "Premium Plan",
        planId: constants.CONST_SUBSCRIPTION_BOTH,
        description: "Complete access to all features",
        price: 19.99,
        currency: "USD",
        duration: 1,
        durationType: "months",
        features: [
          "All Nomad features",
          "All Match features",
          "Unlimited everything",
          "Priority customer support",
          "Exclusive events access",
          "Advanced analytics"
        ],
        planType: "both",
        isActive: true,
        isPopular: true,
        sortOrder: 4
      }
    ];

    await subscriptionPlanModel.insertMany(defaultPlans);
    console.log("✅ Subscription plans seeded successfully");

  } catch (error) {
    console.error("❌ Error seeding subscription plans:", error.message);
  }
};

export default subscriptionPlanSeeder;