import i18n from "../../../config/i18n.js";
import staticPageModel from "../../../models/staticPage.model.js";
import constants from "../../../utils/constants.js";
import helper from "../../../utils/helper.js";
import mongoose from "mongoose";
import countryModel from "../../../models/country.model.js";
import cityModel from "../../../models/city.model.js";
import emailModel from "../../../models/email.model.js";
import emailSender from "../../../utils/emailSender.js";
import footerModel from "../../../models/footer.model.js";
import hairTypeModel from "../../../models/hair.model.js";
import eyeTypeModel from "../../../models/eyes.model.js";
import preferenceModel from "../../../models/preference.model.js";
import languageModel from "../../../models/language.model.js";
import bodyTypeModel from "../../../models/bodyType.model.js";
import reportMasterModel from "../../../models/reportMaster.model.js";
import interestModel from "../../../models/interest.model.js";

let privacyPolicy = async (req, res) => {
  try {
    const getPrivacy = await staticPageModel.findOne(
      {
        slug: "privacy-policy",
      },
      "title description"
    );

    if (getPrivacy) {
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_found"),
        getPrivacy
      );
    } else {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
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

let aboutUs = async (req, res) => {
  try {
    const getPrivacy = await staticPageModel.findOne(
      {
        slug: "about-us",
      },
      "title description"
    );

    if (getPrivacy) {
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_found"),
        getPrivacy
      );
    } else {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
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

let termCondition = async (req, res) => {
  try {
    const getPrivacy = await staticPageModel.findOne(
      {
        slug: "term-service",
      },
      "title description"
    );

    if (getPrivacy) {
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_found"),
        getPrivacy
      );
    } else {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
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

let contactUs = async (req, res) => {
  try {
    const getPrivacy = await staticPageModel.findOne(
      {
        slug: "contact-us",
      },
      "title description"
    );

    if (getPrivacy) {
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_record_found"),
        getPrivacy
      );
    } else {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
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

const getCountries = async (req, res) => {
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
    let query = countryModel.find(filterObj).sort({ name: 1 });
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

    const totalCounts = await countryModel.countDocuments(filterObj);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_countries_data"),
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

// const getCities = async (req, res) => {
//   try {
//     let page, limit;
//     if (req.query?.page) {
//       page = req.query.page;
//       limit = constants.CONST_LIMIT;
//     }
//     let filterObj = {
//       countryId: mongoose.Types.ObjectId.createFromHexString(req.params.id),
//       cityId: { $ne: "" },
//     };
//     if (req.query?.search) {
//       filterObj.name = {
//         $regex: ".*" + req.query.search + ".*",
//         $options: "i",
//       };
//     }
//     let query = cityModel.find(filterObj).sort({ name: 1 });
//     if (page) {
//       query = query.skip((page - 1) * limit).limit(limit);
//     }
//     let data = await query;
//     if (data.length == 0) {
//       return helper.returnFalseResponse(
//         req,
//         res,
//         constants.CONST_RESP_CODE_OK,
//         i18n.__("lang_no_record_found")
//       );
//     }
//     const totalCounts = await cityModel.countDocuments(filterObj);
//     return helper.returnTrueResponse(
//       req,
//       res,
//       constants.CONST_RESP_CODE_OK,
//       i18n.__("lang_cities_data"),
//       data,
//       totalCounts
//     );
//   } catch (error) {
//     return helper.returnFalseResponse(
//       req,
//       res,
//       constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
//       error.message
//     );
//   }
// };

const getCities = async (req, res) => {
  try {
    const match = {
      countryId: mongoose.Types.ObjectId.createFromHexString(req.params.id),
      cityId: { $ne: "" },
    };

    if (req.query?.search) {
      match.name = {
        $regex: ".*" + req.query.search + ".*",
        $options: "i",
      };
    }

    // Define the initial aggregation pipeline for data retrieval
    const aggregationPipeline = [
      { $match: match },
      {
        $group: {
          _id: "$name",
          city: { $first: "$$ROOT" }, // Select the first document in each group
        },
      },
      {
        $replaceRoot: { newRoot: "$city" },
      },
      { $sort: { name: 1 } },
    ];

    // Add pagination if 'page' query param exists
    if (req.query?.page) {
      const page = parseInt(req.query.page);
      const limit = constants.CONST_LIMIT;
      const skip = (page - 1) * limit;
      aggregationPipeline.push({ $skip: skip }, { $limit: limit });
    }

    // Execute the main aggregation pipeline
    const data = await cityModel.aggregate(aggregationPipeline);

    if (data.length === 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_no_record_found")
      );
    }

    // Separate count aggregation for total unique city names (faster than full pipeline)
    const countPipeline = [
      { $match: match },
      {
        $group: {
          _id: "$name",
        },
      },
      { $count: "total" },
    ];

    const totalCountResult = await cityModel.aggregate(countPipeline);
    const totalCounts = totalCountResult[0]?.total || 0;

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_cities_data"),
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
        i18n.__("lang_already_joined")
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

const getUserMasterContent = async (req, res) => {
  try {
    let hairData = await hairTypeModel
      .find({
        status: constants.CONST_STATUS_ACTIVE,
      })
      .sort({ hairType: 1 });
    let eyeData = await eyeTypeModel
      .find({
        status: constants.CONST_STATUS_ACTIVE,
      })
      .sort({ eyeType: 1 });
    let preferenceData = await preferenceModel
      .find({
        status: constants.CONST_STATUS_ACTIVE,
      })
      .sort({ preference: 1 });
    let bodyData = await bodyTypeModel
      .find({
        status: constants.CONST_STATUS_ACTIVE,
      })
      .sort({ bodyType: 1 });
    let languageData = await languageModel
      .find({
        status: constants.CONST_STATUS_ACTIVE,
      })
      .sort({ language: 1 });
    let interestData = await interestModel
      .find({
        status: constants.CONST_STATUS_ACTIVE,
      })
      .sort({ name: 1 });

    let data = {
      hairType: hairData,
      eyeType: eyeData,
      preference: preferenceData,
      bodyType: bodyData,
      language: languageData,
      interest: interestData,
    };

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

let getReportMaster = async (req, res) => {
  try {
    let reportMaster = await reportMasterModel.find({
      status: constants.CONST_STATUS_ACTIVE,
    });
    if (reportMaster.length == 0) {
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
      i18n.__("lang_report_master"),
      reportMaster,
      reportMaster.length
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

let masterController = {
  aboutUs: aboutUs,
  contactUs: contactUs,
  privacyPolicy: privacyPolicy,
  termCondition: termCondition,
  getCities: getCities,
  getCountries: getCountries,
  addEmail: addEmail,
  getFooterContent: getFooterContent,
  getUserMasterContent: getUserMasterContent,
  getReportMaster: getReportMaster,
};

export default masterController;
