import mongoose from "mongoose";
import i18n from "../../../config/i18n.js";
import staticPageModel from "../../../models/staticPage.model.js";
import constants from "../../../utils/constants.js";
import helper from "../../../utils/helper.js";
import userModel from "../../../models/user.model.js";
import emailModel from "../../../models/email.model.js";
import footerModel from "../../../models/footer.model.js";
import userSubscriptionModel from "../../../models/userSubscription.model.js";
import subscriptionPlanModel from "../../../models/subscriptionPlan.model.js";
import userReportModel from "../../../models/userReport.model.js";
import matchModel from "../../../models/match.model.js";
import notification from "../../../utils/notification.js";
import appVersionModel from "../../../models/appVersion.model.js";
import contactSupportModel from "../../../models/contactSupport.js";

const dashboard = async (req, res) => {
  try {
    let data = {};
    const userCount = await userModel
      .find({
        role: constants.CONST_ROLE_USER,
        status: { $ne: constants.CONST_STATUS_DELETED },
      })
      .countDocuments({});

    const transactionCount = 0;
    data.userCount = userCount;
    data.transactionCount = transactionCount;

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_record_found"),
      data
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

const userList = async (req, res) => {
  try {
    let filterObj = {
      role: constants.CONST_ROLE_USER,
      status: { $ne: constants.CONST_STATUS_DELETED },
    };
    if (req.query?.search) {
      filterObj.firstName = {
        $regex: ".*" + req.query.search + ".*",
        $options: "i",
      };
    }
    if (req.query?.email) {
      filterObj.email = {
        $regex: ".*" + req.query.email + ".*",
        $options: "i",
      };
    }
    if (req.query?.status) {
      filterObj.status = req.query.status;
    }
    let pipeline = [
      {
        $match: filterObj,
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
      // {
      //   $lookup: {
      //     from: "countries",
      //     localField: "countryPreferences",
      //     foreignField: "_id",
      //     as: "countryPreferenceData",
      //   },
      // },

      // {
      //   $lookup: {
      //     from: "cities",
      //     localField: "cityPreferences",
      //     foreignField: "_id",
      //     as: "cityPreferenceData",
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$travelPreferenceData",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      { $sort: { createdAt: -1 } },
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
          state: 1,
          gender: 1,
          height: 1,
          age: 1,
          languageData: 1,
          flag:1,
          travelPreferenceData: 1,
          countryData: { $ifNull: ["$countryData", {}] },
          bodyTypeData: { $ifNull: ["$bodyTypeData", {}] },
          cityData: { $ifNull: ["$cityData", {}] },
          hairTypeData: { $ifNull: ["$hairTypeData", {}] },
          eyeTypeData: { $ifNull: ["$eyeTypeData", {}] },
          // travelPreferenceData: { $ifNull: ["$travelPreferenceData", {}] },
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
    let userData = await userModel.aggregate(pipeline);

    if (userData.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
        i18n.__("lang_record_not_found")
      );
    }
    if (req.query?.page) {
      pipeline.pop();
      pipeline.pop();
    }
    const totalCounts = await userModel.aggregate(pipeline);

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_record_found"),
      userData,
      totalCounts.length
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

const userDetail = async (req, res) => {
  try {
    const data = await userModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
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
          from: "userGallery",
          localField: "_id",
          foreignField: "userId",
          as: "galleryImages",
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
      // {
      //   $unwind: {
      //     path: "$travelPreferenceData",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
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
          state: 1,
          gender: 1,
          height: 1,
          age: 1,
          boost: 1,
          vedio: 1,
          flag:1,
          subscriptionId: 1,
          languageData: 1,
          interestData: 1,
          cityPreferenceData: 1,
          countryPreferenceData: 1,
          travelPreferenceData: 1,
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
    ]);

    if (data.length == 0) {
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
      i18n.__("lang_record_found"),
      data[0]
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

const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await userModel.findOne({
      _id: userId,
      status: {
        $ne: constants.CONST_STATUS_DELETED,
      },
      role: {
        $ne: constants.CONST_ROLE_ADMIN,
      },
    });
    if (!user) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
        i18n.__("lang_record_not_found")
      );
    }
    await helper.updateEmail(user);

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_user_account_delete_success")
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

const updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findOne({
      _id: userId,
      role: {
        $ne: constants.CONST_ROLE_ADMIN,
      },
      status: {
        $ne: constants.CONST_STATUS_DELETED,
      },
    });
    if (!user) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
        i18n.__("lang_record_not_found")
      );
    }
    let adminData = await helper.getAdminDetails();
    if (!adminData) {
      // Create a default admin data if not found
      adminData = { _id: "admin" };
    }
    if (user.status == constants.CONST_STATUS_ACTIVE) {
      await userModel.findOneAndUpdate(
        { _id: user._id },
        {
          status: constants.CONST_STATUS_INACTIVE,
          firstName: "@capri_app_user",
          lastName: "user",
          // image: constants.CONST_DUMMY_IMAGE,
          deletedFirstName: user.firstName,
          deleteLastName: user.lastName,
          deletedImage: user.image,
        },
        { new: true }
      );

      let notificationData = {
        title: "Status Update",
        body: `Your account is deactivated by admin`,
        senderId: adminData._id,
        receiverId: user._id,
        type: "Status",
        id: user._id,
      };
      let jsonData = {
        type: "Status",
        id: user._id,
      };

      let result = await notification.sendNotification(notificationData);
      await helper.notificationUpdate(result, jsonData);
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_user_deactivated_success")
      );
    }
    if (user.status == constants.CONST_STATUS_INACTIVE) {
      await userModel.findOneAndUpdate(
        { _id: user._id },
        {
          status: constants.CONST_STATUS_ACTIVE,
          firstName: user.deletedFirstName,
          lastName: user.deleteLastName,
          userName: user.deleteUserName,
          // image: user.deletedImage,
          isAccountVerified: constants.CONST_USER_VERIFIED_TRUE,
          accountVerifiedTime: "",
        },
        { new: true }
      );
      let notificationData = {
        title: "Status Update",
        body: `Your account is activated by admin`,
        senderId: adminData._id,
        receiverId: user._id,
        type: "Status",
        id: user._id,
      };
      let jsonData = {
        type: "Status",
        id: user._id,
      };

      let result = await notification.sendNotification(notificationData);
      await helper.notificationUpdate(result, jsonData);
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_user_active_success")
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

const getStaticContent = async (req, res) => {
  try {
    const queryInfo = req.query;
    const slug = queryInfo.slug ?? "";
    let filterObject = {};
    let getCollection;
    if (slug.length > 0) {
      filterObject.slug = slug;
    }

    getCollection = await staticPageModel
      .find(filterObject, { _id: 0, title: 1, slug: 1, description: 1 })
      .sort({ title: -1 });

    if (getCollection.length > 0) {
      if (slug.length > 0) {
        getCollection = getCollection[0];
      }
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_found"),
        getCollection
      );
    } else {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_record_not_found")
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

let updateContent = async (req, res) => {
  try {
    const body = req.body;
    let { slug, title, description } = body;

    const response = await staticPageModel.findOneAndUpdate(
      { slug: slug },
      { title: title, description: description }
    );

    if (response == null) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_record_not_found")
      );
    } else {
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_content_update_success"),
        {
          slug: slug,
          title: title,
          description: description,
        }
      );
    }
  } catch (e) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      e.message
    );
  }
};

const getEmail = async (req, res) => {
  try {
    let page, limit;
    if (req.query?.page) {
      page = req.query.page;
      limit = constants.CONST_LIMIT;
    }
    let filterObj = {};

    let query = emailModel.find(filterObj).sort({ createdAt: -1 });
    if (page) {
      query = query.skip((page - 1) * limit).limit(limit);
    }
    let data = await query;
    if (data.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_no_record_found")
      );
    }

    const totalCounts = await emailModel.countDocuments(filterObj);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_record_found"),
      data,
      totalCounts
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

const getFooterContent = async (req, res) => {
  try {
    let footerData = await footerModel.findOne();
    if (!footerData) {
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
      i18n.__("lang_footer_data"),
      footerData
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

const updateFooterContent = async (req, res) => {
  try {
    let body = req.body;

    let footerData = await footerModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.params.id),
      },
      {
        ...body,
      },
      { new: true }
    );

    if (!footerData) {
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
      i18n.__("lang_footer_updated_successfully")
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

const getTransactionList = async (req, res) => {
  try {
    let filterObj = {};
    if (req.query?.search) {
      filterObj.firstName = {
        $regex: ".*" + req.query.search + ".*",
        $options: "i",
      };
    }
    let pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
          pipeline: [{ $match: filterObj }],
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          description: 1,
          createdAt: 1,
          title: 1,
          status: 1,
          productId: 1,
          amount: 1,
          validTill: 1,
          userData: {
            _id: 1,
            firstName: 1,
            userName: 1,
            lastName: 1,
            email: 1,
            image: 1,
          },
        },
      },
    ];
    if (req.query?.page) {
      const page = Number(req.query?.page);
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
    let data = await userSubscriptionModel.aggregate(pipeline);
    if (data.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_not_found")
      );
    }
    if (req.query?.page) {
      pipeline.pop(), pipeline.pop();
    }
    let totalCounts = await userSubscriptionModel.aggregate(pipeline);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_data_found"),
      data,
      totalCounts.length
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

const updateProfile = async (req, res) => {
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

    if (req.file?.location) {
      body.image = req.file.location;
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

const getReportList = async (req, res) => {
  try {
    let pipeline = [
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
        $lookup: {
          from: "users",
          localField: "matchId",
          foreignField: "_id",
          as: "matchData",
        },
      },
      {
        $unwind: "$matchData",
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
          reason: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          userData: {
            _id: 1,
            userName: 1,
            firstName: 1,
            lastName: 1,
            image: 1,
            flag:1,
          },
          matchData: {
            _id: 1,
            userName: 1,
            firstName: 1,
            lastName: 1,
            image: 1,
            flag:1,
          },
        },
      },
    ];
    if (req.query?.page) {
      const page = Number(req.query?.page);
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
    let getReport = await userReportModel.aggregate(pipeline);

    if (getReport.length == 0) {
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
    let getReportCounts = await userReportModel.aggregate(pipeline);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_record_found"),
      getReport,
      getReportCounts.length
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

let getMatchList = async (req, res) => {
  try {
    let userData = await userModel.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
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
          userId: new mongoose.Types.ObjectId(req.params.id),
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
          from: "interests",
          localField: "matchData.interest",
          foreignField: "_id",
          as: "interestData",
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
          matchData: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            userName: 1,
            dob: 1,
            email: 1,
            bio: 1,
            image: 1,
            children: 1,
            gender: 1,
            flag:1,
          },
          interestData: 1,
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
      i18n.__("lang_matches"),
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

const ignoreUserReport = async (req, res) => {
  try {
    let data = await userReportModel.findOne({
      _id: mongoose.Types.ObjectId.createFromHexString(req.params.id),
    });
    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
        i18n.__("lang_record_not_found")
      );
    }
    await userReportModel.updateMany(
      { matchId: data.matchId },
      { status: constants.CONST_STATUS_IGNORE }
    );

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_report_ignored_successfully")
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

const approveUserReport = async (req, res) => {
  try {
    let data = await userReportModel.findOne({
      _id: mongoose.Types.ObjectId.createFromHexString(req.params.id),
    });
    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
        i18n.__("lang_record_not_found")
      );
    }
    await userReportModel.updateMany(
      { matchId: data.matchId },
      { status: constants.CONST_STATUS_APPROVED }
    );
    let userData = await userModel.findOne({ _id: data.matchId });
    await helper.updateEmail(userData);

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_report_approved_successfully")
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

const rejectOrApproveUserProfile = async (req, res) => {
  try {
    let body = req.body;
    let data = await userModel.findOne({
      _id: mongoose.Types.ObjectId.createFromHexString(req.params.id),
    });
    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
        i18n.__("lang_record_not_found")
      );
    }
    if (
      (data.vedio == "" ||
        data.vedioScreenShot == "" ||
        data.profileVerified == false) &&
      body.status == constants.CONST_STATUS_APPROVED
    ) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_you_can_not_approve_this_profile")
      );
    }
    if (body.status == constants.CONST_STATUS_APPROVED) {
      await userModel.updateOne(
        { _id: data._id },
        {
          profileVerified: constants.CONST_USER_VERIFIED_TRUE,
        }
      );
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_approved_successfully")
      );
    }
    // if (body.status == constants.CONST_STATUS_REJECTED) {

    // }
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_rejected_successfully")
    );
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

const updateVersion = async (req, res) => {
  try {
    let data = await appVersionModel.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId.createFromHexString(req.params.id),
      },
      {
        version: req.body.version,
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

const getVersion = async (req, res) => {
  try {
    let data = await appVersionModel.find({
      status: constants.CONST_STATUS_ACTIVE,
    });
    if (data.length == 0) {
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
      i18n.__("lang_data"),
      data
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

const getContactSupport = async (req, res) => {
  try {
    let page, limit;
    if (req.query?.page) {
      page = req.query.page;
      limit = constants.CONST_LIMIT;
    }
    let filterObj = {};
    if (req.query?.search) {
      filterObj.name = {
        $regex: ".*" + req.query.search + ".*",
        $options: "i",
      };
    }
    let query = contactSupportModel.find(filterObj).sort({ createdAt: -1 });
    if (page) {
      query = query.skip((page - 1) * limit).limit(limit);
    }
    let data = await query;
    if (data.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_no_record_found")
      );
    }

    const totalCounts = await contactSupportModel.countDocuments(filterObj);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_record_found"),
      data,
      totalCounts
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

// Subscription Plan Management Functions

// Get all subscription plans
const getSubscriptionPlans = async (req, res) => {
  try {
    console.log('Getting subscription plans...'); // Debug log
    
    // Simple query - remove status filter that might be blocking data
    let filterObj = {};
    
    if (req.query?.search) {
      filterObj.$or = [
        { planName: { $regex: ".*" + req.query.search + ".*", $options: "i" } },
        { planId: { $regex: ".*" + req.query.search + ".*", $options: "i" } }
      ];
    }

    let pipeline = [
      { $match: filterObj },
      { $sort: { sortOrder: 1, createdAt: -1 } },
      {
        $project: {
          _id: 1,
          planName: 1,
          planId: 1,
          description: 1,
          price: 1,
          currency: 1,
          duration: 1,
          durationType: 1,
          features: 1,
          planType: 1,
          isActive: 1,
          isPopular: 1,
          sortOrder: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ];

    // Get total count first
    let totalCountPipeline = [...pipeline];
    let totalCounts = await subscriptionPlanModel.aggregate(totalCountPipeline);
    
    // Apply pagination if requested
    if (req.query?.page) {
      const page = Number(req.query?.page);
      const limit = constants.CONST_LIMIT || 10;
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip }, { $limit: limit });
    }

    let data = await subscriptionPlanModel.aggregate(pipeline);
    
    // Always return data, even if empty
    if (data.length == 0) {
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        "No subscription plans found",
        [],
        0
      );
    }

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_data_found"),
      data,
      totalCounts.length
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

// Create new subscription plan
const createSubscriptionPlan = async (req, res) => {
  try {
    const {
      planName,
      planId,
      description,
      price,
      currency,
      duration,
      durationType,
      features,
      planType,
      isActive,
      isPopular,
      sortOrder
    } = req.body;

    // Check if planId already exists
    const existingPlan = await subscriptionPlanModel.findOne({
      planId: planId,
      status: constants.CONST_STATUS_ACTIVE
    });

    if (existingPlan) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_BAD_REQUEST,
        "Plan ID already exists"
      );
    }

    const newPlan = new subscriptionPlanModel({
      planName,
      planId,
      description,
      price,
      currency: currency || "USD",
      duration,
      durationType: durationType || "months",
      features: features || [],
      planType,
      isActive: isActive !== undefined ? isActive : true,
      isPopular: isPopular || false,
      sortOrder: sortOrder || 0
    });

    await newPlan.save();

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      "Subscription plan created successfully",
      newPlan
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

// Update subscription plan
const updateSubscriptionPlan = async (req, res) => {
  try {
    const planId = req.params.id;
    const updateData = req.body;

    // Check if plan exists
    const existingPlan = await subscriptionPlanModel.findOne({
      _id: planId,
      status: constants.CONST_STATUS_ACTIVE
    });

    if (!existingPlan) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
        "Subscription plan not found"
      );
    }

    // If updating planId, check for duplicates
    if (updateData.planId && updateData.planId !== existingPlan.planId) {
      const duplicatePlan = await subscriptionPlanModel.findOne({
        planId: updateData.planId,
        status: constants.CONST_STATUS_ACTIVE,
        _id: { $ne: planId }
      });

      if (duplicatePlan) {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_BAD_REQUEST,
          "Plan ID already exists"
        );
      }
    }

    const updatedPlan = await subscriptionPlanModel.findByIdAndUpdate(
      planId,
      updateData,
      { new: true }
    );

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      "Subscription plan updated successfully",
      updatedPlan
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

// Delete subscription plan
const deleteSubscriptionPlan = async (req, res) => {
  try {
    const planId = req.params.id;

    const existingPlan = await subscriptionPlanModel.findOne({
      _id: planId,
      status: constants.CONST_STATUS_ACTIVE
    });

    if (!existingPlan) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
        "Subscription plan not found"
      );
    }

    await subscriptionPlanModel.findByIdAndUpdate(planId, {
      status: constants.CONST_STATUS_DELETED
    });

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      "Subscription plan deleted successfully"
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

// Get subscription plan analytics
const getSubscriptionAnalytics = async (req, res) => {
  try {
    // Get total revenue by plan
    const revenueByPlan = await userSubscriptionModel.aggregate([
      {
        $match: {
          status: constants.CONST_STATUS_ACTIVE
        }
      },
      {
        $group: {
          _id: "$productId",
          totalRevenue: { $sum: "$amount" },
          totalSubscriptions: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "subscriptionPlans",
          localField: "_id",
          foreignField: "planId",
          as: "planDetails"
        }
      },
      {
        $unwind: {
          path: "$planDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          planId: "$_id",
          planName: "$planDetails.planName",
          totalRevenue: 1,
          totalSubscriptions: 1
        }
      }
    ]);

    // Get monthly revenue trend
    const monthlyRevenue = await userSubscriptionModel.aggregate([
      {
        $match: {
          status: constants.CONST_STATUS_ACTIVE,
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$amount" },
          subscriptions: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    const analytics = {
      revenueByPlan,
      monthlyRevenue,
      totalRevenue: revenueByPlan.reduce((sum, plan) => sum + plan.totalRevenue, 0),
      totalSubscriptions: revenueByPlan.reduce((sum, plan) => sum + plan.totalSubscriptions, 0)
    };

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      "Analytics data retrieved successfully",
      analytics
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

const commonController = {
  dashboard: dashboard,
  userList: userList,
  deleteUserAccount: deleteUserAccount,
  updateUserStatus: updateUserStatus,
  getStaticContent: getStaticContent,
  updateContent: updateContent,
  userDetail: userDetail,
  getEmail: getEmail,
  getFooterContent: getFooterContent,
  updateFooterContent: updateFooterContent,
  getTransactionList: getTransactionList,
  getReportList: getReportList,
  updateProfile: updateProfile,
  getMatchList: getMatchList,
  approveUserReport: approveUserReport,
  ignoreUserReport: ignoreUserReport,
  rejectOrApproveUserProfile: rejectOrApproveUserProfile,
  updateVersion: updateVersion,
  getVersion: getVersion,
  getContactSupport: getContactSupport,
  // Subscription Plan Management
  getSubscriptionPlans: getSubscriptionPlans,
  createSubscriptionPlan: createSubscriptionPlan,
  updateSubscriptionPlan: updateSubscriptionPlan,
  deleteSubscriptionPlan: deleteSubscriptionPlan,
  getSubscriptionAnalytics: getSubscriptionAnalytics,
};

export default commonController;
