import i18n from "../../../config/i18n.js";
import userModel from "../../../models/user.model.js";
import constants from "../../../utils/constants.js";
import helper from "../../../utils/helper.js";
import mongoose from "mongoose";
import notificationModel from "../../../models/notification.model.js";
import userSubscriptionModel from "../../../models/userSubscription.model.js";
import matchModel from "../../../models/match.model.js";
import userReportModel from "../../../models/userReport.model.js";
import matchIgnoreModel from "../../../models/ignore.model.js";
import reportMasterModel from "../../../models/reportMaster.model.js";
import emailModel from "../../../models/email.model.js";
import emailSender from "../../../utils/emailSender.js";
import footerModel from "../../../models/footer.model.js";
import userGalleryModel from "../../../models/userGallery.model.js";
import moment from "moment";
import blockUserModel from "../../../models/block.model.js";
import profileViewModel from "../../../models/profileView.model.js";
import notification from "../../../utils/notification.js";
import contactSupportModel from "../../../models/contactSupport.js";

let uploadProfileImage = async (req, res) => {
  try {
    const profileImage =
      req.file?.location !== undefined ? `${req.file.location}` : "";
    let userData = await userModel.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId.createFromHexString(req.params.id),
      },
      {
        image: profileImage,
      },
      { new: true }
    );
    if (!userData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_not_found")
      );
    }
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_updated_successfully"),
      profileImage
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let uploadProfileGallery = async (req, res) => {
  try {
    if (!req.file?.location)
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_image_required")
      );

    if (req.body.isProfile == "true") {
      await userGalleryModel.updateMany(
        { userId: req.body.userId },
        { isProfile: false }
      );
      let user = await userModel.findOneAndUpdate(
        { _id: req.body.userId },
        {
          image: req.file?.location,
          profilePercentage: req.body?.profilePercentage,
        }
      );
      if (user.vedioScreenShot != "") {
        let similarity = await helper.compareFaces(
          req.file?.location,
          user.vedioScreenShot
        );
        if (similarity > 0.9) {
          await userModel.updateOne(
            { _id: user._id },
            {
              profileVerified: constants.CONST_USER_VERIFIED_TRUE,
              profilePercentage: req.body?.profilePercentage,
            }
          );
        } else {
          await userModel.updateOne(
            { _id: user._id },
            {
              profileVerified: constants.CONST_USER_VERIFIED_FALSE,
            }
          );
        }
      }
    }
    let userData = await userGalleryModel.create({
      image: req.file?.location,
      userId: req.body.userId,
      isProfile: req.body.isProfile,
    });
    userData.save();

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_updated_successfully")
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let updateProfileGallery = async (req, res) => {
  try {
    let galleryData = await userGalleryModel.findOne({
      _id: mongoose.Types.ObjectId.createFromHexString(req.params.id),
    });

    if (req.body.isProfile == "true" && req.file?.location) {
      await userGalleryModel.updateMany(
        { userId: galleryData.userId },
        { isProfile: false }
      );
      await userGalleryModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId.createFromHexString(req.params.id),
        },
        {
          isProfile: true,
          image: req.file?.location,
          profilePercentage: req.body?.profilePercentage,
        },
        { new: true }
      );
      let user = await userModel.findOneAndUpdate(
        { _id: galleryData.userId },
        { image: req.file?.location }
      );
      if (user.vedioScreenShot != "") {
        let similarity = await helper.compareFaces(
          req.file?.location,
          userData.vedioScreenShot
        );
        if (similarity > 0.9) {
          await userModel.updateOne(
            { _id: user._id },
            {
              profileVerified: constants.CONST_USER_VERIFIED_TRUE,
              profilePercentage: req.body?.profilePercentage,
            }
          );
        } else {
          await userModel.updateOne(
            { _id: user._id },
            {
              profileVerified: constants.CONST_USER_VERIFIED_FALSE,
              profilePercentage: req.body?.profilePercentage,
            }
          );
        }
      }
    } else if (req.body.isProfile == "true") {
      await userGalleryModel.updateMany(
        { userId: galleryData.userId },
        { isProfile: false }
      );
      let data = await userGalleryModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId.createFromHexString(req.params.id),
        },
        {
          isProfile: true,
        },
        { new: true }
      );

      let user = await userModel.findOneAndUpdate(
        { _id: galleryData.userId },
        { image: data.image }
      );
      if (user.vedioScreenShot != "") {
        let similarity = await helper.compareFaces(
          data.image,
          userData.vedioScreenShot
        );
        if (similarity > 0.9) {
          await userModel.updateOne(
            { _id: user._id },
            {
              profileVerified: constants.CONST_USER_VERIFIED_TRUE,
            }
          );
        } else {
          await userModel.updateOne(
            { _id: user._id },
            {
              profileVerified: constants.CONST_USER_VERIFIED_FALSE,
            }
          );
        }
      }
    } else {
      let data = await userGalleryModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId.createFromHexString(req.params.id),
        },
        {
          image: req.file?.location,
        },
        { new: true }
      );
      if (data.isProfile) {
        let user = await userModel.findOneAndUpdate(
          { _id: galleryData.userId },
          { image: data.image }
        );
        if (user.vedioScreenShot != "") {
          let similarity = await helper.compareFaces(
            data.image,
            userData.vedioScreenShot
          );
          if (similarity > 0.9) {
            await userModel.updateOne(
              { _id: user._id },
              {
                profileVerified: constants.CONST_USER_VERIFIED_TRUE,
                profilePercentage: req.body?.profilePercentage,
              }
            );
          } else {
            await userModel.updateOne(
              { _id: user._id },
              {
                profileVerified: constants.CONST_USER_VERIFIED_FALSE,
                profilePercentage: req.body?.profilePercentage,
              }
            );
          }
        }
      }
    }

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_updated_successfully")
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let deleteProfileGallery = async (req, res) => {
  try {
    let userData = await userGalleryModel.findOneAndDelete({
      _id: mongoose.Types.ObjectId.createFromHexString(req.params.id),
    });
    if (!userData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_not_found")
      );
    }
    if (userData.isProfile) {
      await userModel.updateOne(
        { _id: userData.userId },
        {
          image: "",
          profileVerified: constants.CONST_USER_VERIFIED_FALSE,
        }
      );
    }
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_deleted_successfully")
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};


let getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ success: 0, message: "User ID is required" });
    }
    let profileData = await userModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      // ... (rest of your aggregation pipeline, as in your original code)
    ]);

    if (!profileData || !profileData.length) {
      return res.status(404).json({ success: 0, message: "User not found" });
    }

    let user = profileData[0];
    user.image = user.image || ""; // fallback if missing
    user.gallery = user.gallery || []; // fallback if missing

    return res.status(200).json({
      version: req.appVersionInfo,
      success: 1,
      data: user
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return res.status(500).json({
      success: 0,
      message: error.message || "Internal Server Error"
    });
  }
};


let updateProfile = async (req, res) => {
  try {
    let userId = req.body.user_info._id;
    let body = req.body;

    let userData = await userModel.findOne({
      _id: userId,
    });
    if (!userData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_CONTENT_NOT_FOUND,
        i18n.__("lang_record_not_found")
      );
    }
    // if (body?.cityName) {
    //   const cityData = await helper.addCity(body.state, body?.cityName);
    //   body.city = cityData;
    // }
    if (body?.boost) {
      if (userData.boost == constants.CONST_USER_VERIFIED_TRUE) {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_OK,
          i18n.__("lang_profile_already_boosted")
        );
      }
      if (userData.boostCount >= 2) {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_OK,
          i18n.__("lang_boost_limit_reached")
        );
      }
      body.boostEndTime = Math.floor(new Date().getTime() / 1000) + 1800;
      body.boostCount = userData.boostCount + 1;
    }
    await userModel.updateOne(
      {
        _id: userId,
      },
      { ...body },
      { new: true }
    );

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_profile_updated_successfully")
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let getNotification = async (req, res) => {
  try {
    const page = Number(req.query?.page);
    const limit = constants.CONST_LIMIT;
    const skipCount = (page - 1) * limit;

    let query = {
      receiverId: req.body.user_info._id,
    };

    let result = notificationModel.find(query).sort({ createdAt: -1 });
    if (req.query?.page) {
      result.skip(skipCount).limit(limit);
    }

    result = await result;

    if (result.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_not_found")
      );
    }
    let unreadCount = await notificationModel.countDocuments({
      receiverId: req.body.user_info._id,
      isRead: constants.CONST_USER_VERIFIED_FALSE,
    });

    let totalCounts = await notificationModel.countDocuments({
      receiverId: req.body.user_info._id,
    });

    let finalData = {
      data: result,
      unreadCount: unreadCount,
    };
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_notification_list"),
      finalData,
      totalCounts
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let updateNotification = async (req, res) => {
  try {
    let notificationData = await notificationModel.findOneAndUpdate(
      {
        receiverId: req.body.user_info._id,
        _id: mongoose.Types.ObjectId.createFromHexString(req.params.id),
      },
      {
        isRead: constants.CONST_USER_VERIFIED_TRUE,
      },
      {
        new: true,
      }
    );
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_updated_successfully"),
      notificationData
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let notificationOnOff = async (req, res) => {
  try {
    let userId = req.body.user_info._id;

    let userData = await userModel.findOne({
      _id: userId,
    });

    if (!userData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_user_not_found")
      );
    }
    if (userData.notification == constants.CONST_USER_VERIFIED_FALSE) {
      await userModel.updateOne(
        { _id: userData._id },
        { notification: constants.CONST_USER_VERIFIED_TRUE }
      );
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("enabled")
      );
    }
    if (userData.notification == constants.CONST_USER_VERIFIED_TRUE) {
      await userModel.updateOne(
        { _id: userData._id },
        { notification: constants.CONST_USER_VERIFIED_FALSE }
      );
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("disabled")
      );
    }
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let addDetail = async (req, res) => {
  try {
    const data = await userModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId.createFromHexString(req.body.userId) },
      {
        cityPreferences: req.body?.cityPreferences,
        countryPreferences: req.body?.countryPreferences,
        travelPreferences: req.body?.travelPreferences,
        hairType: req.body?.hairType,
        eyeType: req.body?.eyeType,
        bodyType: req.body?.bodyType,
        language: req.body?.language,
        interest: req.body?.interest,
        socialMediaLink: req.body?.socialMediaLink,
        about: req.body?.about,
        height: req.body?.height,
        profileAdded: constants.CONST_USER_VERIFIED_TRUE,
        profilePercentage: req.body?.profilePercentage,
      }
    );
    if (!data) {
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_no_record_found")
      );
    }
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_detail_added_successfully"),
      data._id
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let deleteUserAccountFromWeb = async (req, res) => {
  try {
    let userData = await userModel.findOne({
      email: req.body.email,
    });
    if (!userData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_no_record_found")
      );
    }
    if (userData.status == constants.CONST_STATUS_DELETED) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_Already_deleted")
      );
    }
    let isPasswordMatch = await helper.passwordCompare(
      req.body.password,
      userData.password
    );
    if (!isPasswordMatch) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_incorrect_password")
      );
    }
    await helper.updateEmail(userData);

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_account_deleted_successfully")
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let addSubscriptionPlan = async (req, res) => {
  try {
    await userSubscriptionModel.updateMany(
      {
        userId: mongoose.Types.ObjectId.createFromHexString(req.body.userId),
      },
      {
        status: constants.CONST_STATUS_INACTIVE,
      }
    );
    let data = new userSubscriptionModel({
      userId: req.body.userId,
      productId: req.body.productId,
      response: req.body.response,
      amount: req.body.amount,
      paymentType: req.body.paymentType,
      validTill: "",
    });
    await data.save();
    await userModel.updateOne(
      {
        _id: mongoose.Types.ObjectId.createFromHexString(req.body.userId),
      },
      {
        isSubscriptionPurchased: constants.CONST_USER_VERIFIED_TRUE,
        subscriptionId: req.body.productId,
        purchaseDate: data.createdAt,
        boostCount: 0,
      }
    );
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_FOUND,
      i18n.__("lang_subscription_added_successfully")
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};
// getUserSubscriptionPlan
let getUserSubscriptionPlan = async (req, res) => {
  try {
    const getPlan = await userSubscriptionModel
      .findOne({
        userId: req.body.user_info._id,
        status: constants.CONST_STATUS_ACTIVE,
      })
      .select("_id amount status userId paymentType productId validTill");
    if (!getPlan) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_not_found")
      );
    }
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_FOUND,
      i18n.__("lang_record_found"),
      getPlan
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let getNomad = async (req, res) => {
  try {
    let filter = {
      status: constants.CONST_STATUS_ACTIVE,
      _id: { $ne: req.body.user_info._id },
      role: constants.CONST_ROLE_USER,
      profileAdded: constants.CONST_USER_VERIFIED_TRUE,
      isAccountVerified: constants.CONST_USER_VERIFIED_TRUE,
    };
    let userData = await userModel.findOne({ _id: req.body.user_info._id });
    if (
      userData.subscriptionId == constants.CONST_SUBSCRIPTION_NONE ||
      userData.subscriptionId == constants.CONST_SUBSCRIPTION_MATCH
    ) {
      filter.city = userData.city;
    }
    if (userData.gender == constants.CONST_GENDER_FEMALE) {
      filter.gender = constants.CONST_GENDER_MALE;
    } else {
      filter.gender = constants.CONST_GENDER_FEMALE;
    }
    if (req.body?.minHeightRange || req.body?.maxHeightRange) {
      let lowRange = req.body?.minHeightRange ? req.body?.minHeightRange : 0;
      let maxRange = req.body?.maxHeightRange ? req.body?.maxHeightRange : 100;
      filter.height = {
        $gte: Number(lowRange),
        $lte: Number(maxRange),
      };
    }
    if (req.body?.minAgeRange || req.body?.maxAgeRange) {
      let lowRange = req.body?.minAgeRange ? req.body?.minAgeRange : 18;
      let maxRange = req.body?.maxAgeRange ? req.body?.maxAgeRange : 60;
      filter.age = {
        $gte: Number(lowRange),
        $lte: Number(maxRange),
      };
    }
    if (req.body?.gender) {
      filter.gender = Number(req.body?.gender);
    }
    if (req.body?.gender == 0) {
      delete filter.gender;
    }
    if (req.body?.interest && req.body.interest.length) {
      filter.interest = {
        $in: req.body.interest.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }
    if (req.body?.bodyType && req.body.bodyType.length) {
      filter.bodyType = {
        $in: req.body.bodyType.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }
    if (req.body?.eyeType && req.body.eyeType.length) {
      filter.eyeType = {
        $in: req.body.eyeType.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }
    if (req.body?.hairType && req.body.hairType.length) {
      filter.hairType = {
        $in: req.body.hairType.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }
    if (req.body?.language && req.body.language.length) {
      filter.language = {
        $in: req.body.language.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }
    if (req.body?.travelPreferences && req.body.travelPreferences.length) {
      filter.travelPreferences = {
        $in: req.body.travelPreferences.map(
          (id) => new mongoose.Types.ObjectId(id)
        ),
      };
    }
    if (req.body?.country && req.body.country != "") {
      filter.country = new mongoose.Types.ObjectId(req.body.country);
    }
    if (req.body?.city && req.body.city != "") {
      filter.city = new mongoose.Types.ObjectId(req.body.city);
    }

    // manage nomad subscription according to city if free other wise worldWide

    let pipeline = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "_id",
          as: "countryData",
        },
      },
      {
        $unwind: {
          path: "$countryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "city",
          foreignField: "_id",
          as: "cityData",
        },
      },
      {
        $unwind: {
          path: "$cityData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          random: { $rand: {} },
          priority: {
            $cond: {
              if: { $eq: ["$isSubscriptionPurchased", true] },
              then: 1,
              else: 2,
            },
          },
        },
      },
      // First, sort by priority (isSubscriptionPurchased: true = 1) and then by random
      {
        $lookup: {
          from: "blocks",
          let: { matchUserId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$blockBy", req.body.user_info._id] },
                    { $eq: ["$blockTo", "$$matchUserId"] },
                  ],
                },
              },
            },
          ],
          as: "blockedByUser",
        },
      },
      // Lookup to check if the match has blocked the current user
      {
        $lookup: {
          from: "blocks",
          let: { matchUserId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$blockBy", "$$matchUserId"] },
                    { $eq: ["$blockTo", req.body.user_info._id] },
                  ],
                },
              },
            },
          ],
          as: "blocksUser",
        },
      },
      // Exclude matches where there is a block relationship
      {
        $match: {
          blockedByUser: { $eq: [] },
          blocksUser: { $eq: [] },
        },
      },
      {
        $sort: { priority: 1, random: 1 },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          dob: 1,
          email: 1,
          about: 1,
          age: 1,
          isSubscriptionPurchased: 1,
          isAccountVerified: 1,
          image: 1,
          status: 1,
          role: 1,
          notification: 1,
          city: 1,
          children: 1,
          profileAdded: 1,
          country: 1,
          gender: 1,
          height: 1,
          age: 1,
          flag: 1,
          countryData: { $ifNull: ["$countryData", {}] },
          cityData: { $ifNull: ["$cityData", {}] },
        },
      },
    ];

    if (req.query?.page) {
      const page = parseInt(req.query?.page) || 1;
      const limit = constants.CONST_LIMIT;
      const skip = (page - 1) * limit;
      pipeline.push(
        {
          $skip: skip,
        },
        {
          $limit: limit,
        }
      );
    }
    const userDetail = await userModel.aggregate(pipeline);

    if (userDetail.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_not_found")
      );
    }
    if (req.query?.page) {
      pipeline.pop();
      pipeline.pop();
    }
    let userCount = await userModel.aggregate(pipeline);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_FOUND,
      i18n.__("lang_record_found"),
      userDetail,
      userCount.length
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let findBy = async (req, res) => {
  try {
    let filter = {
      status: constants.CONST_STATUS_ACTIVE,
      _id: { $ne: req.body.user_info._id },
      role: constants.CONST_ROLE_USER,
      profileAdded: constants.CONST_USER_VERIFIED_TRUE,
      // profileVerified: constants.CONST_USER_VERIFIED_TRUE,
      isAccountVerified: constants.CONST_USER_VERIFIED_TRUE,
    };
    if (req.body?.minAgeRange || req.body?.maxAgeRange) {
      let lowRange = req.body?.minAgeRange ? req.body?.minAgeRange : 18;
      let maxRange = req.body?.maxAgeRange ? req.body?.maxAgeRange : 60;
      filter.age = {
        $gte: Number(lowRange),
        $lte: Number(maxRange),
      };
    }
    if (req.body?.gender == 1 || req.body?.gender == 2) {
      filter.gender = Number(req.body?.gender);
    }
    if (req.body?.interest && req.body?.interest.length) {
      filter.interest = {
        $in: req.body.interest.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }
    let userData = await userModel.findOne({ _id: req.body.user_info._id });

    filter.boost = true;

    let boostPipeline = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "userReport",
          localField: "_id",
          foreignField: "matchId",
          as: "reportedMatches",
          pipeline: [
            {
              $match: {
                userId: req.body.user_info._id,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "matchIgnore",
          localField: "_id",
          foreignField: "matchId",
          as: "ignoredMatches",
          pipeline: [
            {
              $match: {
                userId: req.body.user_info._id,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "matches",
          localField: "_id",
          foreignField: "matchId",
          as: "matchedUsers",
          pipeline: [
            {
              $match: {
                userId: req.body.user_info._id,
              },
            },
          ],
        },
      },
      {
        $match: {
          reportedMatches: { $eq: [] },
          ignoredMatches: { $eq: [] },
          matchedUsers: { $eq: [] },
        },
      },
      {
        $lookup: {
          from: "languages",
          localField: "language",
          foreignField: "_id",
          as: "languageData",
        },
      },
      {
        $lookup: {
          from: "interests",
          localField: "interest",
          foreignField: "_id",
          as: "interestData",
        },
      },

      {
        $lookup: {
          from: "countries",
          localField: "countryPreferences",
          foreignField: "_id",
          as: "countryPreferenceData",
        },
      },

      {
        $lookup: {
          from: "cities",
          localField: "cityPreferences",
          foreignField: "_id",
          as: "cityPreferenceData",
        },
      },
      {
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "_id",
          as: "countryData",
        },
      },
      {
        $unwind: {
          path: "$countryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "city",
          foreignField: "_id",
          as: "cityData",
        },
      },
      {
        $unwind: {
          path: "$cityData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "bodyType",
          localField: "bodyType",
          foreignField: "_id",
          as: "bodyTypeData",
        },
      },
      {
        $unwind: {
          path: "$bodyTypeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "eyeType",
          localField: "eyeType",
          foreignField: "_id",
          as: "eyeTypeData",
        },
      },
      {
        $unwind: {
          path: "$eyeTypeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "hairType",
          localField: "hairType",
          foreignField: "_id",
          as: "hairTypeData",
        },
      },
      {
        $unwind: {
          path: "$hairTypeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "preferences",
          localField: "travelPreferences",
          foreignField: "_id",
          as: "travelPreferenceData",
        },
      },
      {
        $lookup: {
          from: "blocks",
          let: { matchUserId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$blockBy", req.body.user_info._id] },
                    { $eq: ["$blockTo", "$$matchUserId"] },
                  ],
                },
              },
            },
          ],
          as: "blockedByUser",
        },
      },
      // Lookup to check if the match has blocked the current user
      {
        $lookup: {
          from: "blocks",
          let: { matchUserId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$blockBy", "$$matchUserId"] },
                    { $eq: ["$blockTo", req.body.user_info._id] },
                  ],
                },
              },
            },
          ],
          as: "blocksUser",
        },
      },
      // Exclude matches where there is a block relationship
      {
        $match: {
          blockedByUser: { $eq: [] },
          blocksUser: { $eq: [] },
        },
      },
      {
        $sort: { boost: -1, isSubscriptionPurchased: -1 },
      },
      {
        $limit: 3,
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          dob: 1,
          email: 1,
          about: 1,
          // height:1,
          age: 1,
          isSubscriptionPurchased: 1,
          isAccountVerified: 1,
          image: 1,
          status: 1,
          role: 1,
          notification: 1,
          city: 1,
          children: 1,
          profileAdded: 1,
          country: 1,
          gender: 1,
          height: 1,
          age: 1,
          latitude: 1,
          longitude: 1,
          location: 1,
          isLocation: 1,
          distance: 1,
          age: 1,
          boost: 1,
          languageData: 1,
          interestData: 1,
          // cityPreferenceData: 1,
          // countryPreferenceData: 1,
          socialMediaLink: 1,
          profileVerified: 1,
          galleryImages: 1,
          countryData: { $ifNull: ["$countryData", {}] },
          bodyTypeData: { $ifNull: ["$bodyTypeData", {}] },
          cityData: { $ifNull: ["$cityData", {}] },
          hairTypeData: { $ifNull: ["$hairTypeData", {}] },
          eyeTypeData: { $ifNull: ["$eyeTypeData", {}] },
          // travelPreferenceData: { $ifNull: ["$travelPreferenceData", {}] },
        },
      },
    ];
    const boostUserData = await userModel.aggregate(boostPipeline);
    if (boostUserData.length > 0) {
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
        i18n.__("lang_record_found"),
        boostUserData,
        boostUserData.length
      );
    }
    delete filter.boost;
    if (userData.isLocation == constants.CONST_USER_VERIFIED_TRUE) {
      filter.isLocation = constants.CONST_USER_VERIFIED_TRUE;
      boostPipeline.splice(20, 1);

      boostPipeline.unshift({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              Number(userData.location.coordinates[0]),
              Number(userData.location.coordinates[1]),
            ],
          },
          distanceField: "distance",
          maxDistance: req.body?.distanceRange
            ? Number(req.body?.distanceRange) * 1000
            : 600 * 1000,
          spherical: true,
        },
      });

      let distanceData = await userModel.aggregate(boostPipeline);

      if (distanceData.length > 0) {
        return helper.returnTrueResponse(
          req,
          res,
          constants.CONST_RESP_CODE_OK,
          i18n.__("lang_record_found"),
          distanceData,
          distanceData.length
        );
      }
      if (req.body?.distanceFilter) {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_NOT_FOUND,
          i18n.__("lang_record_not_found")
        );
      }
    }
    delete filter.isLocation;

    let pipeline = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "userReport",
          localField: "_id",
          foreignField: "matchId",
          as: "reportedMatches",
          pipeline: [
            {
              $match: {
                userId: req.body.user_info._id,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "matchIgnore",
          localField: "_id",
          foreignField: "matchId",
          as: "ignoredMatches",
          pipeline: [
            {
              $match: {
                userId: req.body.user_info._id,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "matches",
          localField: "_id",
          foreignField: "matchId",
          as: "matchedUsers",
          pipeline: [
            {
              $match: {
                userId: req.body.user_info._id,
              },
            },
          ],
        },
      },
      {
        $match: {
          reportedMatches: { $eq: [] },
          ignoredMatches: { $eq: [] },
          matchedUsers: { $eq: [] },
        },
      },
      {
        $lookup: {
          from: "languages",
          localField: "language",
          foreignField: "_id",
          as: "languageData",
        },
      },
      {
        $lookup: {
          from: "interests",
          localField: "interest",
          foreignField: "_id",
          as: "interestData",
        },
      },

      {
        $lookup: {
          from: "countries",
          localField: "countryPreferences",
          foreignField: "_id",
          as: "countryPreferenceData",
        },
      },

      {
        $lookup: {
          from: "cities",
          localField: "cityPreferences",
          foreignField: "_id",
          as: "cityPreferenceData",
        },
      },
      {
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "_id",
          as: "countryData",
        },
      },
      {
        $unwind: {
          path: "$countryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "city",
          foreignField: "_id",
          as: "cityData",
        },
      },
      {
        $unwind: {
          path: "$cityData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "bodyType",
          localField: "bodyType",
          foreignField: "_id",
          as: "bodyTypeData",
        },
      },
      {
        $unwind: {
          path: "$bodyTypeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "eyeType",
          localField: "eyeType",
          foreignField: "_id",
          as: "eyeTypeData",
        },
      },
      {
        $unwind: {
          path: "$eyeTypeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "hairType",
          localField: "hairType",
          foreignField: "_id",
          as: "hairTypeData",
        },
      },
      {
        $unwind: {
          path: "$hairTypeData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "preferences",
          localField: "travelPreferences",
          foreignField: "_id",
          as: "travelPreferenceData",
        },
      },
      {
        $lookup: {
          from: "blocks",
          let: { matchUserId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$blockBy", req.body.user_info._id] },
                    { $eq: ["$blockTo", "$$matchUserId"] },
                  ],
                },
              },
            },
          ],
          as: "blockedByUser",
        },
      },
      // Lookup to check if the match has blocked the current user
      {
        $lookup: {
          from: "blocks",
          let: { matchUserId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$blockBy", "$$matchUserId"] },
                    { $eq: ["$blockTo", req.body.user_info._id] },
                  ],
                },
              },
            },
          ],
          as: "blocksUser",
        },
      },
      // Exclude matches where there is a block relationship
      {
        $match: {
          blockedByUser: { $eq: [] },
          blocksUser: { $eq: [] },
        },
      },
      {
        $match: {
          $or: [
            { interest: { $in: userData.interest } },
            { language: { $in: userData.language } },
            { travelPreferences: { $in: userData.travelPreferences } },
            { countryPreferences: { $in: userData.countryPreferences } },
            { cityPreferences: { $in: userData.cityPreferences } },
            { country: userData.country },
            { city: userData.city },
            { hairType: userData.hairType },
            { eyeType: userData.eyeType },
            { bodyType: userData.bodyType },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 3,
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          dob: 1,
          email: 1,
          about: 1,
          // height:1,
          age: 1,
          isSubscriptionPurchased: 1,
          isAccountVerified: 1,
          image: 1,
          status: 1,
          role: 1,
          notification: 1,
          city: 1,
          children: 1,
          profileAdded: 1,
          country: 1,
          gender: 1,
          height: 1,
          age: 1,
          latitude: 1,
          longitude: 1,
          location: 1,
          isLocation: 1,
          age: 1,
          boost: 1,
          languageData: 1,
          interestData: 1,
          flag: 1,
          // cityPreferenceData: 1,
          // countryPreferenceData: 1,
          socialMediaLink: 1,
          profileVerified: 1,
          galleryImages: 1,
          countryData: { $ifNull: ["$countryData", {}] },
          bodyTypeData: { $ifNull: ["$bodyTypeData", {}] },
          cityData: { $ifNull: ["$cityData", {}] },
          hairTypeData: { $ifNull: ["$hairTypeData", {}] },
          eyeTypeData: { $ifNull: ["$eyeTypeData", {}] },
          // travelPreferenceData: { $ifNull: ["$travelPreferenceData", {}] },
        },
      },
    ];

    if (req.body?.filter) {
      pipeline.splice(20, 1);
    }
    if (req.query?.page) {
      const page = parseInt(req.query?.page) || 1;
      const limit = constants.CONST_LIMIT;
      const skip = (page - 1) * limit;
      pipeline.push(
        {
          $skip: skip,
        },
        {
          $limit: limit,
        }
      );
    }

    const userDetail = await userModel.aggregate(pipeline);

    if (userDetail.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_not_found")
      );
    }
    if (req.query?.page) {
      pipeline.pop();
      pipeline.pop();
    }
    let userCount = await userModel.aggregate(pipeline);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_FOUND,
      i18n.__("lang_record_found"),
      userDetail,
      userCount.length
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let likeMatch = async (req, res) => {
  try {
    let friend = false;
    let body = req.body;

    let matchData = await matchModel.findOne({
      matchId: mongoose.Types.ObjectId.createFromHexString(body.matchId),
      userId: body.user_info._id,
    });
    if (matchData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_already_matched")
      );
    }

    let currentTime1 = moment();
    let currentTime2 = moment();
    const start = currentTime1.hour(0).minute(0);
    const end = currentTime2.hour(23).minute(59);

    let userData = await userModel.findOne({ _id: body.user_info._id });
    let matchCount = await matchModel.find({
      userId: req.body.user_info._id,
      like: constants.CONST_USER_VERIFIED_TRUE,
      createdAt: {
        $lte: end,
        $gte: start,
      },
    });

    if (
      (userData.subscriptionId == constants.CONST_SUBSCRIPTION_NOMAD ||
        userData.subscriptionId == constants.CONST_SUBSCRIPTION_NONE) &&
      matchCount &&
      matchCount?.length >= 20
    ) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_Your_daily_limit_has_been_exceeded")
      );
    }
    let userMatch = await matchModel.findOne({
      userId: mongoose.Types.ObjectId.createFromHexString(body.matchId),
      matchId: body.user_info._id,
      request: constants.CONST_USER_VERIFIED_TRUE,
    });

    let data;

    let matchUser = await userModel.findOne({
      _id: mongoose.Types.ObjectId.createFromHexString(body.matchId),
    });
    let adminData = await helper.getAdminDetails();
    if (userMatch) {
      data = new matchModel({
        userId: body.user_info._id,
        matchId: body.matchId,
        request: constants.CONST_USER_VERIFIED_FALSE,
        status: constants.CONST_STATUS_ACTIVE,
        requestStatus: constants.CONST_STATUS_ACCEPT,
        like: constants.CONST_USER_VERIFIED_TRUE,
      });
      friend = true;
      await matchModel.updateOne(
        { _id: userMatch._id },
        {
          request: constants.CONST_USER_VERIFIED_FALSE,
          status: constants.CONST_STATUS_ACTIVE,
          requestStatus: constants.CONST_STATUS_ACCEPT,
        }
      );
      let notificationData = {
        title: "Match Profile",
        body: `${userData.firstName} has matched with your profile.`,
        senderId: adminData._id,
        receiverId: body.matchId,
        type: "Match",
        id: body.matchId,
      };

      let jsonData = {
        type: "Match",
        matchId: body.matchId,
        userId: body.user_info._id,
      };

      let result = await notification.sendNotification(notificationData);
      await helper.notificationUpdate(result, jsonData);
      notificationData = {
        title: "Match Profile",
        body: `${matchUser.firstName} has matched with your profile.`,
        senderId: adminData._id,
        receiverId: body.user_info._id,
        type: "Match",
        id: body.user_info._id,
      };
      result = await notification.sendNotification(notificationData);
      await helper.notificationUpdate(result, jsonData);
    } else {
      data = new matchModel({
        userId: body.user_info._id,
        matchId: body.matchId,
        like: constants.CONST_USER_VERIFIED_TRUE,
      });
      let notificationData = {
        title: "Match Profile",
        body: `${userData.firstName} has liked your profile.`,
        senderId: adminData._id,
        receiverId: body.matchId,
        type: "like",
        id: body.matchId,
      };

      let jsonData = {
        type: "like",
        matchId: body.matchId,
        userId: body.user_info._id,
      };

      let result = await notification.sendNotification(notificationData);
      await helper.notificationUpdate(result, jsonData);
    }

    await data.save();
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_matched_successfully"),
      friend
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let ignoreMatch = async (req, res) => {
  try {
    let userData = await userModel.findById(
      mongoose.Types.ObjectId.createFromHexString(req.body.matchId)
    );
    if (!userData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_UNAUTHORIZED,
        i18n.__("lang_matches_user_not_found")
      );
    }
    let data = await matchIgnoreModel.findOne({
      matchId: mongoose.Types.ObjectId.createFromHexString(req.body.matchId),
      userId: req.body.user_info._id,
    });

    if (data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_already_ignored")
      );
    }
    let match = await matchModel.findOne({
      userId: mongoose.Types.ObjectId.createFromHexString(req.body.matchId),
      matchId: req.body.user_info._id,
    });

    let repeatTime;
    const currentTimestamp = Date.now();
    const sevenDaysLater = currentTimestamp + 7 * 24 * 60 * 60 * 1000;
    repeatTime = sevenDaysLater;
    if (match) {
      const threeDaysLater = currentTimestamp + 3 * 24 * 60 * 60 * 1000;
      repeatTime = threeDaysLater;
    }
    let ignoreData = new matchIgnoreModel({
      matchId: req.body.matchId,
      userId: req.body.user_info._id,
      repeatTime: repeatTime,
    });
    await ignoreData.save();
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_ignored_successfully")
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let reportMatch = async (req, res) => {
  try {
    let reportMaster = await userReportModel.findOne({
      matchId: mongoose.Types.ObjectId.createFromHexString(req.body.matchId),
      userId: req.body.user_info._id,
    });

    if (reportMaster) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_already_reported")
      );
    }
    let data = await reportMasterModel.findOne({
      _id: mongoose.Types.ObjectId.createFromHexString(req.body.reportId),
    });

    let reason = data.name;
    if (req.body?.reason) {
      reason = req.body.reason;
    }
    let reportData = new userReportModel({
      matchId: req.body.matchId,
      userId: req.body.user_info._id,
      reportId: req.body.reportId,
      reason: reason,
    });
    await reportData.save();
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_reported_successfully")
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let addEmail = async (req, res, next) => {
  try {
    const emailData = await emailModel.findOne({
      email: req.body.email,
    });

    if (!emailData) {
      let emailData = new emailModel({ email: req.body.email });
      await emailData.save();
      await emailSender.sendAdminEmail(req.body.email);
      await emailSender.sendUserEmail(req.body.email);
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_requested")
      );
    } else {
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_requested")
      );
    }
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let getFooterContent = async (req, res) => {
  try {
    let data = await footerModel.findOne({});
    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_not_found")
      );
    }

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_data"),
      data
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let myMatches = async (req, res) => {
  try {
    let userData = await userModel.findOne({
      _id: req.body.user_info._id,
    });

    if (!userData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_user_not_found")
      );
    }

    let pipeline = [
      {
        $match: {
          userId: req.body.user_info._id,
          status: constants.CONST_STATUS_ACTIVE,
          request: constants.CONST_USER_VERIFIED_FALSE,
        },
      },
      {
        $lookup: {
          from: "userReport",
          localField: "_id",
          foreignField: "matchId",
          as: "reportedMatches",
        },
      },
      {
        $match: {
          reportedMatches: { $eq: [] },
        },
      },
      {
        $lookup: {
          from: "userReport",
          localField: "matchId",
          foreignField: "matchId",
          as: "reportedMyMatches",
          pipeline: [
            {
              $match: {
                userId: req.body.user_info._id,
              },
            },
          ],
        },
      },
      {
        $match: {
          reportedMyMatches: { $eq: [] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "matchId",
          foreignField: "_id",
          as: "matchData",
        },
      },
      {
        $unwind: {
          path: "$matchData",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "countries",
          localField: "matchData.country",
          foreignField: "_id",
          as: "countryData",
        },
      },
      {
        $unwind: {
          path: "$countryData",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "cities",
          localField: "matchData.city",
          foreignField: "_id",
          as: "cityData",
        },
      },
      {
        $unwind: {
          path: "$cityData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "blocks",
          let: { matchUserId: "$matchId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$blockBy", req.body.user_info._id] },
                    { $eq: ["$blockTo", "$$matchUserId"] },
                  ],
                },
              },
            },
          ],
          as: "blockedByUser",
        },
      },
      // Lookup to check if the match has blocked the current user
      {
        $lookup: {
          from: "blocks",
          let: { matchUserId: "$matchId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$blockBy", "$$matchUserId"] },
                    { $eq: ["$blockTo", req.body.user_info._id] },
                  ],
                },
              },
            },
          ],
          as: "blocksUser",
        },
      },
      // Exclude matches where there is a block relationship
      {
        $match: {
          blockedByUser: { $eq: [] },
          blocksUser: { $eq: [] },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          matchId: 1,
          status: 1,
          createdAt: 1,
          like: 1,
          superLike: 1,
          wink: 1,
          flag: 1,
          matchData: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            flag: 1,
            dob: 1,
            email: 1,
            bio: 1,
            children: 1,
            gender: 1,
            image: 1,
            status: 1,
          },

          countryData: { $ifNull: ["$countryData", {}] },

          cityData: { $ifNull: ["$cityData", {}] },
        },
      },
    ];

    if (req.query?.page) {
      const page = parseInt(req.query?.page);
      const limit = constants.CONST_LIMIT;
      const skip = (page - 1) * limit;
      pipeline.push(
        {
          $skip: skip,
        },
        {
          $limit: limit,
        }
      );
    }

    let data = await matchModel.aggregate(pipeline);

    if (data.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_not_found")
      );
    }
    if (req.query?.page) {
      pipeline.pop();
      pipeline.pop();
    }

    let totalCount = await matchModel.aggregate(pipeline);

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_myMatches"),
      data,
      totalCount.length
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let likeSentList = async (req, res) => {
  try {
    let userData = await userModel.findOne({
      _id: req.body.user_info._id,
    });

    if (!userData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_user_not_found")
      );
    }

    let pipeline = [
      {
        $match: {
          userId: req.body.user_info._id,
          status: constants.CONST_STATUS_INACTIVE,
          request: constants.CONST_USER_VERIFIED_TRUE,
        },
      },
      {
        $lookup: {
          from: "userReport",
          localField: "_id",
          foreignField: "matchId",
          as: "reportedMatches",
        },
      },
      {
        $match: {
          reportedMatches: { $eq: [] },
        },
      },
      {
        $lookup: {
          from: "userReport",
          localField: "matchId",
          foreignField: "matchId",
          as: "reportedMyMatches",
          pipeline: [
            {
              $match: {
                userId: req.body.user_info._id,
              },
            },
          ],
        },
      },
      {
        $match: {
          reportedMyMatches: { $eq: [] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "matchId",
          foreignField: "_id",
          as: "matchData",
        },
      },
      {
        $unwind: {
          path: "$matchData",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "countries",
          localField: "matchData.country",
          foreignField: "_id",
          as: "countryData",
        },
      },
      {
        $unwind: {
          path: "$countryData",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "cities",
          localField: "matchData.city",
          foreignField: "_id",
          as: "cityData",
        },
      },
      {
        $unwind: {
          path: "$cityData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "blocks",
          let: { matchUserId: "$matchId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$blockBy", req.body.user_info._id] },
                    { $eq: ["$blockTo", "$$matchUserId"] },
                  ],
                },
              },
            },
          ],
          as: "blockedByUser",
        },
      },
      // Lookup to check if the match has blocked the current user
      {
        $lookup: {
          from: "blocks",
          let: { matchUserId: "$matchId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$blockBy", "$$matchUserId"] },
                    { $eq: ["$blockTo", req.body.user_info._id] },
                  ],
                },
              },
            },
          ],
          as: "blocksUser",
        },
      },
      // Exclude matches where there is a block relationship
      {
        $match: {
          blockedByUser: { $eq: [] },
          blocksUser: { $eq: [] },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          matchId: 1,
          status: 1,
          createdAt: 1,
          request: 1,
          requestStatus: 1,
          wink: 1,
          like: 1,
          superLike: 1,

          matchData: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            flag: 1,
            dob: 1,
            email: 1,
            bio: 1,
            children: 1,
            gender: 1,
            image: 1,
            status: 1,
          },

          countryData: { $ifNull: ["$countryData", {}] },

          cityData: { $ifNull: ["$cityData", {}] },
        },
      },
    ];

    if (req.query?.page) {
      const page = parseInt(req.query?.page);
      const limit = constants.CONST_LIMIT;
      const skip = (page - 1) * limit;
      pipeline.push(
        {
          $skip: skip,
        },
        {
          $limit: limit,
        }
      );
    }

    let data = await matchModel.aggregate(pipeline);

    if (data.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_not_found")
      );
    }
    if (req.query?.page) {
      pipeline.pop();
      pipeline.pop();
    }

    let totalCount = await matchModel.aggregate(pipeline);

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_like_sent_list"),
      data,
      totalCount.length
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let likeReceivedList = async (req, res) => {
  try {
    let userData = await userModel.findOne({
      _id: req.body.user_info._id,
    });

    if (!userData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_user_not_found")
      );
    }
    let filter = {
      matchId: req.body.user_info._id,
      status: constants.CONST_STATUS_INACTIVE,
      request: constants.CONST_USER_VERIFIED_TRUE,
    };
    if (req.query.type == 1) {
      filter.like = true;
    }
    if (req.query.type == 2) {
      filter.wink = true;
    }
    if (req.query.type == 3) {
      filter.superLike = true;
    }
    let pipeline = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "userReport",
          localField: "_id",
          foreignField: "matchId",
          as: "reportedMatches",
        },
      },
      {
        $match: {
          reportedMatches: { $eq: [] },
        },
      },
      {
        $lookup: {
          from: "userReport",
          localField: "matchId",
          foreignField: "matchId",
          as: "reportedMyMatches",
          pipeline: [
            {
              $match: {
                userId: req.body.user_info._id,
              },
            },
          ],
        },
      },
      {
        $match: {
          reportedMyMatches: { $eq: [] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "matchData",
        },
      },
      {
        $unwind: {
          path: "$matchData",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "countries",
          localField: "matchData.country",
          foreignField: "_id",
          as: "countryData",
        },
      },
      {
        $unwind: {
          path: "$countryData",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "cities",
          localField: "matchData.city",
          foreignField: "_id",
          as: "cityData",
        },
      },
      {
        $unwind: {
          path: "$cityData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "blocks",
          let: { matchUserId: "$matchId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$blockBy", req.body.user_info._id] },
                    { $eq: ["$blockTo", "$$matchUserId"] },
                  ],
                },
              },
            },
          ],
          as: "blockedByUser",
        },
      },
      // Lookup to check if the match has blocked the current user
      {
        $lookup: {
          from: "blocks",
          let: { matchUserId: "$matchId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$blockBy", "$$matchUserId"] },
                    { $eq: ["$blockTo", req.body.user_info._id] },
                  ],
                },
              },
            },
          ],
          as: "blocksUser",
        },
      },
      // Exclude matches where there is a block relationship
      {
        $match: {
          blockedByUser: { $eq: [] },
          blocksUser: { $eq: [] },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          matchId: 1,
          status: 1,
          createdAt: 1,
          request: 1,
          requestStatus: 1,
          wink: 1,
          like: 1,
          superLike: 1,
          matchData: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            flag: 1,
            dob: 1,
            email: 1,
            bio: 1,
            children: 1,
            gender: 1,
            image: 1,
            status: 1,
          },

          countryData: { $ifNull: ["$countryData", {}] },

          cityData: { $ifNull: ["$cityData", {}] },
        },
      },
    ];

    if (req.query?.page) {
      const page = parseInt(req.query?.page);
      const limit = constants.CONST_LIMIT;
      const skip = (page - 1) * limit;
      pipeline.push(
        {
          $skip: skip,
        },
        {
          $limit: limit,
        }
      );
    }

    let data = await matchModel.aggregate(pipeline);

    if (data.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_not_found")
      );
    }
    if (req.query?.page) {
      pipeline.pop();
      pipeline.pop();
    }

    let totalCount = await matchModel.aggregate(pipeline);

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_like_received_list"),
      data,
      totalCount.length
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let undoMatch = async (req, res) => {
  try {
    let userData = await userModel.findOne({
      _id: req.body.user_info._id,
    });
    if (!userData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_user_not_found")
      );
    }
    let data = await matchIgnoreModel.findOne({}).sort({ createdAt: -1 });
    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_undo_record_not_found")
      );
    }
    await matchIgnoreModel.deleteOne({ _id: data._id });
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_undo_successfully")
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let superLikeMatch = async (req, res) => {
  try {
    let friend = false;
    let body = req.body;
    let matchData = await matchModel.findOne({
      matchId: mongoose.Types.ObjectId.createFromHexString(body.matchId),
      userId: body.user_info._id,
    });
    if (matchData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_already_matched")
      );
    }
    let userData = await userModel.findOne({ _id: body.user_info._id });
    let purchaseDate = userData.purchaseDate;
    let purchaseDate2 = moment(purchaseDate).add(1, "months");

    let matchCountMonth = await matchModel.find({
      userId: req.body.user_info._id,
      superLike: constants.CONST_USER_VERIFIED_TRUE,
      createdAt: {
        $lte: purchaseDate2,
        $gte: purchaseDate,
      },
    });

    if (matchCountMonth && matchCountMonth?.length >= 10) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_Your_monthly_limit_has_been_exceeded")
      );
    }
    let currentTime1 = moment();
    let currentTime2 = moment();
    const start = currentTime1.hour(0).minute(0);
    const end = currentTime2.hour(23).minute(59);

    let matchCount = await matchModel.find({
      userId: req.body.user_info._id,
      superLike: constants.CONST_USER_VERIFIED_TRUE,
      createdAt: {
        $lte: end,
        $gte: start,
      },
    });

    if (matchCount && matchCount?.length >= 3) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_Your_daily_limit_has_been_exceeded")
      );
    }
    let userMatch = await matchModel.findOne({
      userId: mongoose.Types.ObjectId.createFromHexString(body.matchId),
      matchId: body.user_info._id,
      request: constants.CONST_USER_VERIFIED_TRUE,
    });

    let data;

    let matchUser = await userModel.findOne({
      _id: mongoose.Types.ObjectId.createFromHexString(body.matchId),
    });
    let adminData = await helper.getAdminDetails();

    if (userMatch) {
      data = new matchModel({
        userId: body.user_info._id,
        matchId: body.matchId,
        request: constants.CONST_USER_VERIFIED_FALSE,
        status: constants.CONST_STATUS_ACTIVE,
        requestStatus: constants.CONST_STATUS_ACCEPT,
        superLike: constants.CONST_USER_VERIFIED_TRUE,
      });
      friend = true;
      await matchModel.updateOne(
        { _id: userMatch._id },
        {
          request: constants.CONST_USER_VERIFIED_FALSE,
          status: constants.CONST_STATUS_ACTIVE,
          requestStatus: constants.CONST_STATUS_ACCEPT,
        }
      );
      let notificationData = {
        title: "Match Profile",
        body: `${userData.firstName} has send you superLike`,
        senderId: adminData._id,
        receiverId: body.matchId,
        type: "Match",
        id: body.matchId,
      };

      let jsonData = {
        type: "Match",
        matchId: body.matchId,
        userId: body.user_info._id,
      };

      let result = await notification.sendNotification(notificationData);
      await helper.notificationUpdate(result, jsonData);
      notificationData = {
        title: "Match Profile",
        body: `${matchUser.firstName} has matched with your profile.`,
        senderId: adminData._id,
        receiverId: body.user_info._id,
        type: "Match",
        id: body.user_info._id,
      };
      result = await notification.sendNotification(notificationData);
      await helper.notificationUpdate(result, jsonData);
    } else {
      data = new matchModel({
        userId: body.user_info._id,
        matchId: body.matchId,
        superLike: constants.CONST_USER_VERIFIED_TRUE,
      });
      let notificationData = {
        title: "Match Profile",
        body: `${userData.firstName} has send you superLike.`,
        senderId: adminData._id,
        receiverId: body.matchId,
        type: "superLike",
        id: body.matchId,
      };

      let jsonData = {
        type: "superLike",
        matchId: body.matchId,
        userId: body.user_info._id,
      };

      let result = await notification.sendNotification(notificationData);
      await helper.notificationUpdate(result, jsonData);
    }

    await data.save();
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_superLike_successfully"),
      friend
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let winkMatch = async (req, res) => {
  try {
    let friend = false;
    let body = req.body;
    let matchData = await matchModel.findOne({
      matchId: mongoose.Types.ObjectId.createFromHexString(body.matchId),
      userId: body.user_info._id,
    });
    if (matchData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_already_matched")
      );
    }
    let userData = await userModel.findOne({ _id: body.user_info._id });
    let purchaseDate = userData.purchaseDate;
    let purchaseDate2 = moment(purchaseDate).add(1, "months");
    let matchCountMonth = await matchModel.find({
      userId: req.body.user_info._id,
      wink: constants.CONST_USER_VERIFIED_TRUE,
      createdAt: {
        $lte: purchaseDate2,
        $gte: purchaseDate,
      },
    });
    if (matchCountMonth && matchCountMonth?.length >= 10) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_Your_monthly_limit_has_been_exceeded")
      );
    }
    let currentTime1 = moment();
    let currentTime2 = moment();
    const start = currentTime1.hour(0).minute(0);
    const end = currentTime2.hour(23).minute(59);

    let matchCount = await matchModel.find({
      userId: req.body.user_info._id,
      wink: constants.CONST_USER_VERIFIED_TRUE,
      createdAt: {
        $lte: end,
        $gte: start,
      },
    });

    if (matchCount && matchCount?.length >= 2) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_Your_daily_limit_has_been_exceeded")
      );
    }
    let userMatch = await matchModel.findOne({
      userId: mongoose.Types.ObjectId.createFromHexString(body.matchId),
      matchId: body.user_info._id,
      request: constants.CONST_USER_VERIFIED_TRUE,
    });
    let data;

    let matchUser = await userModel.findOne({
      _id: mongoose.Types.ObjectId.createFromHexString(body.matchId),
    });
    let adminData = await helper.getAdminDetails();
    if (userMatch) {
      data = new matchModel({
        userId: body.user_info._id,
        matchId: body.matchId,
        request: constants.CONST_USER_VERIFIED_FALSE,
        status: constants.CONST_STATUS_ACTIVE,
        requestStatus: constants.CONST_STATUS_ACCEPT,
        wink: constants.CONST_USER_VERIFIED_TRUE,
      });
      friend = true;
      await matchModel.updateOne(
        { _id: userMatch._id },
        {
          request: constants.CONST_USER_VERIFIED_FALSE,
          status: constants.CONST_STATUS_ACTIVE,
          requestStatus: constants.CONST_STATUS_ACCEPT,
        }
      );
      let notificationData = {
        title: "Match Profile",
        body: `${userData.firstName} has send you wink.`,
        senderId: adminData._id,
        receiverId: body.matchId,
        type: "Match",
        id: body.matchId,
      };

      let jsonData = {
        type: "Match",
        matchId: body.matchId,
        userId: body.user_info._id,
      };

      let result = await notification.sendNotification(notificationData);
      await helper.notificationUpdate(result, jsonData);
      notificationData = {
        title: "Match Profile",
        body: `${matchUser.firstName} has match with your profile.`,
        senderId: adminData._id,
        receiverId: body.user_info._id,
        type: "Match",
        id: body.user_info._id,
      };
      result = await notification.sendNotification(notificationData);
      await helper.notificationUpdate(result, jsonData);
    } else {
      data = new matchModel({
        userId: body.user_info._id,
        matchId: body.matchId,
        wink: constants.CONST_USER_VERIFIED_TRUE,
      });
      let notificationData = {
        title: "Match Profile",
        body: `${userData.firstName} has send you wink.`,
        senderId: adminData._id,
        receiverId: body.matchId,
        type: "wink",
        id: body.matchId,
      };

      let jsonData = {
        type: "wink",
        matchId: body.matchId,
        userId: body.user_info._id,
      };

      let result = await notification.sendNotification(notificationData);
      await helper.notificationUpdate(result, jsonData);
    }

    await data.save();
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_wink_successfully"),
      friend
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let uploadVedio = async (req, res) => {
  try {
    let imageUrl = "";
    if (req.files.image && req.files.image[0]) {
      imageUrl = req.files.image[0].location;
    }

    let videoUrl = "";
    if (req.files.vedio && req.files.vedio[0]) {
      videoUrl = req.files.vedio[0].location;
    }

    if (imageUrl == "" || videoUrl == "") {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_Please_upload_image_and_video")
      );
    }
    let userData = await userModel.findOne({
      _id: mongoose.Types.ObjectId.createFromHexString(req.params.id),
    });

    if (!userData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_user_not_found")
      );
    }
    if (userData.image == "") {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_please_upload_profile_image")
      );
    }

    const similarity = await helper.compareFaces(userData.image, imageUrl);
    if (similarity < 0.9) {
      await userModel.updateOne(
        { _id: userData._id },
        {
          vedio: videoUrl,
          vedioScreenShot: imageUrl,
          //  profileVerified: constants.CONST_USER_VERIFIED_TRUE,
          profilePercentage: req.body?.profilePercentage,
        }
      );
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_verification_failed"),
        similarity
      );
    }
    await userModel.updateOne(
      { _id: userData._id },
      {
        vedio: videoUrl,
        vedioScreenShot: imageUrl,
        profileVerified: constants.CONST_USER_VERIFIED_TRUE,
        profilePercentage: req.body?.profilePercentage,
      }
    );
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_verified"),
      similarity
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let blockUnblockUser = async (req, res) => {
  try {
    let body = req.body;
    let block = await blockUserModel.findOne({
      blockBy: body.user_info._id,
      blockTo: mongoose.Types.ObjectId.createFromHexString(body.blockTo),
    });

    if (body.status == constants.CONST_STATUS_BLOCK) {
      if (block?.status == constants.CONST_STATUS_BLOCK) {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_OK,
          i18n.__("lang_already_blocked")
        );
      }
      let blockData = new blockUserModel({
        blockBy: body.user_info._id,
        blockTo: body.blockTo,
      });
      await blockData.save();

      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_blocked_successfully")
      );
    } else {
      if (!block) {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_OK,
          i18n.__("lang_record_not_found")
        );
      }
    }
    await blockUserModel.deleteOne({
      blockBy: body.user_info._id,
      blockTo: mongoose.Types.ObjectId.createFromHexString(body.blockTo),
    });

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_unblocked_successfully")
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let blockUserList = async (req, res) => {
  try {
    let body = req.body;
    let pipeline = [
      {
        $match: {
          blockBy: body.user_info._id,
          status: constants.CONST_STATUS_BLOCK,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "blockTo",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
          blockBy: 1,
          blockTo: 1,
          status: 1,
          userData: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            flag: 1,
            image: 1,
            email: 1,
            status: 1,
          },
        },
      },
    ];
    if (req.query?.page) {
      const page = parseInt(req.query?.page);
      const limit = constants.CONST_PAGINATION_LIMIT;
      const skip = (page - 1) * limit;
      pipeline.push(
        {
          $skip: skip,
        },
        {
          $limit: limit,
        }
      );
    }
    let block = await blockUserModel.aggregate(pipeline);

    if (block.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_not_found")
      );
    }
    if (req.query?.page) {
      pipeline.pop();
      pipeline.pop();
    }
    let blockCounts = await blockUserModel.aggregate(pipeline);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_blocked_data"),
      block,
      blockCounts.length
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let deleteAccount = async (req, res) => {
  try {
    let data = await userModel.findOne({ _id: req.body.user_info._id });
    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
        i18n.__("lang_record_not_found")
      );
    }
    if (data.status == constants.CONST_STATUS_DELETED) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_ALREADY_USED,
        i18n.__("lang_account_already_deleted")
      );
    }

    await helper.updateEmail(data);

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_account_deleted_successfully")
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let profileViewList = async (req, res) => {
  try {
    let body = req.body;
    let pipeline = [
      {
        $match: {
          userId: body.user_info._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "viewerId",
          foreignField: "_id",
          as: "viewerData",
        },
      },
      {
        $unwind: "$viewerData",
      },
      {
        $lookup: {
          from: "countries",
          localField: "viewerData.country",
          foreignField: "_id",
          as: "countryData",
        },
      },
      {
        $unwind: {
          path: "$countryData",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "cities",
          localField: "viewerData.city",
          foreignField: "_id",
          as: "cityData",
        },
      },
      {
        $unwind: {
          path: "$cityData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $project: {
          _id: 1,
          viewerId: 1,
          userId: 1,
          userData: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            image: 1,
            email: 1,
            status: 1,
            age: 1,
            dob: 1,
            flag: 1,
          },
          countryData: { $ifNull: ["$countryData", {}] },
          cityData: { $ifNull: ["$cityData", {}] },
          viewerData: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            image: 1,
            email: 1,
            status: 1,
            dob: 1,
            age: 1,
            flag: 1,
          },
        },
      },
    ];
    if (req.query?.page) {
      const page = parseInt(req.query?.page);
      const limit = constants.CONST_PAGINATION_LIMIT;
      const skip = (page - 1) * limit;
      pipeline.push(
        {
          $skip: skip,
        },
        {
          $limit: limit,
        }
      );
    }
    let data = await profileViewModel.aggregate(pipeline);

    if (data.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_not_found")
      );
    }
    if (req.query?.page) {
      pipeline.pop();
      pipeline.pop();
    }
    let viewCounts = await profileViewModel.aggregate(pipeline);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_profile_view_list"),
      data,
      viewCounts.length
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// let openAI = async (req, res) => {
//   try {
//     let body = req.body;

//     let data = await open.generateResponse(body.prompt);

//     return helper.returnTrueResponse(
//       req,
//       res,
//       constants.CONST_RESP_CODE_OK,
//       i18n.__("lang_response"),
//       data
//     );
//   } catch (error) {
//     return helper.returnFalseResponse(
//       req,
//       res,
//       constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
//       error
//     );
//   }
// };

let updateLatLong = async (req, res) => {
  try {
    let data = await userModel.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId.createFromHexString(req.params.id),
      },
      {
        isLocation: true,
        location: {
          type: "Point",
          coordinates: [Number(req.body.longitude), Number(req.body.latitude)],
        },
      }
    );
    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
        i18n.__("lang_record_not_found")
      );
    }
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_updated_successfully")
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let getProfileGallery = async (req, res) => {
  try {
    let galleryData = await userGalleryModel
      .find({
        userId: mongoose.Types.ObjectId.createFromHexString(req.params.id),
        status: constants.CONST_STATUS_ACTIVE,
      })
      .sort({ isProfile: -1 });
    if (galleryData.length == 0) {
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_no_gallery_found"),
        []
      );
    }
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_gallery_images"),
      galleryData
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let uploadImage = async (req, res) => {
  try {
    const image =
      req.file?.location !== undefined ? `${req.file.location}` : "";

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_updated_successfully"),
      image
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let contactSupport = async (req, res) => {
  try {
    let data = await contactSupportModel.create({
      message: req.body.message,
      name: req.body.name,
      email: req.body.email,
    });
    await emailSender.contactSupport(req.body.email, req.body.name);
    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
        i18n.__("lang_failed")
      );
    }
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_success")
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let commonController = {
  getProfile: getProfile,
  uploadProfileImage: uploadProfileImage,
  updateProfile: updateProfile,
  notificationOnOff: notificationOnOff,
  addDetail: addDetail,
  deleteUserAccountFromWeb: deleteUserAccountFromWeb,
  updateNotification: updateNotification,
  getNotification: getNotification,
  getUserSubscriptionPlan: getUserSubscriptionPlan,
  addSubscriptionPlan: addSubscriptionPlan,
  uploadProfileGallery: uploadProfileGallery,
  getNomad: getNomad,
  findBy: findBy,
  likeMatch: likeMatch,
  ignoreMatch: ignoreMatch,
  reportMatch: reportMatch,
  addEmail: addEmail,
  getFooterContent: getFooterContent,
  updateProfileGallery: updateProfileGallery,
  myMatches: myMatches,
  likeSentList: likeSentList,
  likeReceivedList: likeReceivedList,
  undoMatch: undoMatch,
  superLikeMatch: superLikeMatch,
  winkMatch: winkMatch,
  uploadVedio: uploadVedio,
  deleteAccount: deleteAccount,
  blockUserList: blockUserList,
  blockUnblockUser: blockUnblockUser,
  profileViewList: profileViewList,
  // openAI: openAI,
  updateLatLong: updateLatLong,
  deleteProfileGallery: deleteProfileGallery,
  getProfileGallery: getProfileGallery,
  uploadImage: uploadImage,
  contactSupport: contactSupport,
};

export default commonController;