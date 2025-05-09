import constants from "../../../utils/constants.js";
import helper from "../../../utils/helper.js";
import i18n from "../../../config/i18n.js";
import interestModel from "../../../models/interest.model.js";
import languageModel from "../../../models/language.model.js";
import hairTypeModel from "../../../models/hair.model.js";
import bodyTypeModel from "../../../models/bodyType.model.js";
import eyeTypeModel from "../../../models/eyes.model.js";
import countryModel from "../../../models/country.model.js";
import cityModel from "../../../models/city.model.js";
import preferenceModel from "../../../models/preference.model.js";
import mongoose from "mongoose";
import newcountryModel from "../../../models/newCountry.model.js";
import newcityModel from "../../../models/newCity.model.js";

const interestList = async (req, res) => {
  try {
    let query = {
      status: { $ne: constants.CONST_STATUS_DELETED },
    };
    if (req.query?.search) {
      query.name = {
        $regex: ".*" + req.query.search + ".*",
        $options: "i",
      };
    }
    let result = interestModel
      .find(query)
      .sort({ name: 1 })
      .select("_id name icon status createdAt updatedAt");

    if (req.query?.page) {
      const page = req.query.page;
      const limit = constants.CONST_LIMIT;
      result = result.skip((page - 1) * limit).limit(limit);
    }

    const response = await result;
    if (response.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_no_record_found")
      );
    }
    let totalCounts = await interestModel.find(query);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_data"),
      response,
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

const addInterest = async (req, res) => {
  try {
    const body = req.body;

    const response = await interestModel.findOne({ name: body.name });

    if (response) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_already_exist")
      );
    }

    const icon = req.file?.location !== undefined ? `${req.file.location}` : "";
    let newData = new interestModel({
      name: body.name,
      icon: icon,
    });
    await newData.save();
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_added_successfully")
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

const updateInterest = async (req, res) => {
  try {
    let body = req.body;
    if (req.file?.location) {
      body.icon = req.file.location;
    }
    let data = await interestModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) },
      { ...body }
    );
    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_record_not_found")
      );
    }
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_interest_updated_successfully")
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

const deleteInterest = async (req, res) => {
  try {
    const existingInterest = await interestModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) },
      { status: constants.CONST_STATUS_DELETED },
      { new: true }
    );
    if (!existingInterest) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_record_not_found")
      );
    }
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_interest_deleted_successfully")
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

const languageList = async (req, res) => {
  try {
    let query = {
      status: { $ne: constants.CONST_STATUS_DELETED },
    };
    if (req.query?.search) {
      query.name = {
        $regex: ".*" + req.query.search + ".*",
        $options: "i",
      };
    }
    let result = languageModel
      .find(query)
      .sort({ name: 1 })
      .select("_id language status createdAt updatedAt");

    if (req.query?.page) {
      const page = req.query.page;
      const limit = constants.CONST_LIMIT;
      result = result.skip((page - 1) * limit).limit(limit);
    }

    const response = await result;
    if (response.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_no_record_found")
      );
    }
    let totalCounts = await languageModel.find(query);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_data"),
      response,
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

const addLanguage = async (req, res) => {
  try {
    const body = req.body;

    const response = await languageModel.findOne({ language: body.language });

    if (response) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_already_exist")
      );
    }

    const icon = req.file?.location !== undefined ? `${req.file.location}` : "";
    let newData = new languageModel({
      language: body.language,
    });
    await newData.save();
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_added_successfully")
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

const updateLanguage = async (req, res) => {
  try {
    let body = req.body;

    let data = await languageModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) },
      { ...body }
    );
    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
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

const deleteLanguage = async (req, res) => {
  try {
    const existing = await languageModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) },
      { status: constants.CONST_STATUS_DELETED },
      { new: true }
    );
    if (!existing) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_record_not_found")
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

const hairList = async (req, res) => {
  try {
    let query = {
      status: { $ne: constants.CONST_STATUS_DELETED },
    };
    if (req.query?.search) {
      query.hairType = {
        $regex: ".*" + req.query.search + ".*",
        $options: "i",
      };
    }
    let result = hairTypeModel
      .find(query)
      .sort({ name: 1 })
      .select("_id hairType status createdAt updatedAt");

    if (req.query?.page) {
      const page = req.query.page;
      const limit = constants.CONST_LIMIT;
      result = result.skip((page - 1) * limit).limit(limit);
    }

    const response = await result;
    if (response.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_no_record_found")
      );
    }
    let totalCounts = await hairTypeModel.find(query);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_data"),
      response,
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

const addHairType = async (req, res) => {
  try {
    const body = req.body;

    const response = await hairTypeModel.findOne({ hairType: body.hairType });

    if (response) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_already_exist")
      );
    }

    let newData = new hairTypeModel({
      hairType: body.hairType,
    });
    await newData.save();
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_added_successfully")
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

const updateHairType = async (req, res) => {
  try {
    let body = req.body;

    let data = await hairTypeModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) },
      { ...body }
    );

    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
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

const deleteHairType = async (req, res) => {
  try {
    const existing = await hairTypeModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) },
      { status: constants.CONST_STATUS_DELETED },
      { new: true }
    );
    if (!existing) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_record_not_found")
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

const bodyTypeList = async (req, res) => {
  try {
    let query = {
      status: { $ne: constants.CONST_STATUS_DELETED },
    };
    if (req.query?.search) {
      query.name = {
        $regex: ".*" + req.query.search + ".*",
        $options: "i",
      };
    }
    let result = bodyTypeModel
      .find(query)
      .sort({ name: 1 })
      .select("_id bodyType status createdAt updatedAt");

    if (req.query?.page) {
      const page = req.query.page;
      const limit = constants.CONST_LIMIT;
      result = result.skip((page - 1) * limit).limit(limit);
    }

    const response = await result;
    if (response.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_no_record_found")
      );
    }
    let totalCounts = await bodyTypeModel.find(query);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_data"),
      response,
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

const addBodyType = async (req, res) => {
  try {
    const body = req.body;

    const response = await bodyTypeModel.findOne({ bodyType: body.bodyType });

    if (response) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_already_exist")
      );
    }

    let newData = new bodyTypeModel({
      bodyType: body.bodyType,
    });
    await newData.save();
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_added_successfully")
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

const updateBodyType = async (req, res) => {
  try {
    let body = req.body;

    let data = await bodyTypeModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) },
      { ...body }
    );
    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
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

const deleteBodyType = async (req, res) => {
  try {
    const existing = await bodyTypeModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) },
      { status: constants.CONST_STATUS_DELETED },
      { new: true }
    );
    if (!existing) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_record_not_found")
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

const eyeTypeList = async (req, res) => {
  try {
    let query = {
      status: { $ne: constants.CONST_STATUS_DELETED },
    };
    if (req.query?.search) {
      query.name = {
        $regex: ".*" + req.query.search + ".*",
        $options: "i",
      };
    }
    let result = eyeTypeModel
      .find(query)
      .sort({ name: 1 })
      .select("_id eyeType status createdAt updatedAt");

    if (req.query?.page) {
      const page = req.query.page;
      const limit = constants.CONST_LIMIT;
      result = result.skip((page - 1) * limit).limit(limit);
    }

    const response = await result;
    if (response.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_no_record_found")
      );
    }
    let totalCounts = await eyeTypeModel.find(query);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_data"),
      response,
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

const addEyeType = async (req, res) => {
  try {
    const body = req.body;

    const response = await eyeTypeModel.findOne({ eyeType: body.eyeType });

    if (response) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_already_exist")
      );
    }

    let newData = new eyeTypeModel({
      eyeType: body.eyeType,
    });
    await newData.save();
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_added_successfully")
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

const updateEyeType = async (req, res) => {
  try {
    let body = req.body;

    let data = await eyeTypeModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) },
      { ...body }
    );
    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
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

const deleteEyeType = async (req, res) => {
  try {
    const existing = await eyeTypeModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) },
      { status: constants.CONST_STATUS_DELETED },
      { new: true }
    );
    if (!existing) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_record_not_found")
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

const getCities = async (req, res) => {
  try {
    const match = {
      countryId: mongoose.Types.ObjectId.createFromHexString(req.params.id),
      cityId: { $ne: "" },
      status: constants.CONST_STATUS_ACTIVE,
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

const addCity = async (req, res) => {
  try {
    let uniqueExist = await cityModel.findOne({ name: req.body.name });
    if (uniqueExist) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_already_exist")
      );
    }
    let data = await cityModel.create({
      countryId: req.body.countryId,
      name: req.body.name,
      status: constants.CONST_STATUS_ACTIVE,
      cityId: Date.now(),
    });
    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_something_went_wrong")
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
      error.response?.data?.message || error.message
    );
  }
};

const travelPreferenceList = async (req, res) => {
  try {
    let query = {
      status: { $ne: constants.CONST_STATUS_DELETED },
    };
    if (req.query?.search) {
      query.name = {
        $regex: ".*" + req.query.search + ".*",
        $options: "i",
      };
    }
    let result = preferenceModel
      .find(query)
      .sort({ name: 1 })
      .select("_id preference status createdAt updatedAt");

    if (req.query?.page) {
      const page = req.query.page;
      const limit = constants.CONST_LIMIT;
      result = result.skip((page - 1) * limit).limit(limit);
    }

    const response = await result;
    if (response.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_no_record_found")
      );
    }
    let totalCounts = await preferenceModel.find(query);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_data"),
      response,
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

const addTravelPreference = async (req, res) => {
  try {
    const body = req.body;

    const response = await preferenceModel.findOne({
      preference: body.preference,
    });

    if (response) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_already_exist")
      );
    }

    let newData = new preferenceModel({
      preference: body.preference,
    });
    await newData.save();
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_added_successfully")
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

const updateTravelPreference = async (req, res) => {
  try {
    let body = req.body;

    let data = await preferenceModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) },
      { ...body }
    );
    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
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

const deleteTravelPreference = async (req, res) => {
  try {
    const existing = await preferenceModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) },
      { status: constants.CONST_STATUS_DELETED },
      { new: true }
    );
    if (!existing) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_record_not_found")
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

const updateCity = async (req, res) => {
  try {
    let body = req.body;
    if (body.name) {
      let uniqueExist = await cityModel.findOne({ name: body.name });
      if (uniqueExist) {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_OK,
          i18n.__("lang_already_exist")
        );
      }
    }

    let data = await cityModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) },
      {
        ...body,
      },
      { new: true }
    );
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
      i18n.__("lang_updated_successfully"),
      data
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.response?.data?.message || error.message
    );
  }
};

const deleteCity = async (req, res) => {
  try {
    let data = await cityModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId.createFromHexString(req.params.id) },
      {
        status: constants.CONST_STATUS_DELETED,
      }
    );
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
      i18n.__("lang_deleted_successfully")
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.response?.data?.message || error.message
    );
  }
};

const masterController = {
  interestList: interestList,
  addInterest: addInterest,
  updateInterest: updateInterest,
  deleteInterest: deleteInterest,
  languageList: languageList,
  addLanguage: addLanguage,
  updateLanguage: updateLanguage,
  deleteLanguage: deleteLanguage,
  hairList: hairList,
  addHairType: addHairType,
  updateHairType: updateHairType,
  deleteHairType: deleteHairType,
  bodyTypeList: bodyTypeList,
  addBodyType: addBodyType,
  updateBodyType: updateBodyType,
  deleteBodyType: deleteBodyType,
  eyeTypeList: eyeTypeList,
  addEyeType: addEyeType,
  updateEyeType: updateEyeType,
  deleteEyeType: deleteEyeType,
  addCity: addCity,
  getCities: getCities,
  getCountries: getCountries,
  travelPreferenceList: travelPreferenceList,
  addTravelPreference: addTravelPreference,
  updateTravelPreference: updateTravelPreference,
  deleteTravelPreference: deleteTravelPreference,
  updateCity: updateCity,
  deleteCity: deleteCity,
};

export default masterController;
