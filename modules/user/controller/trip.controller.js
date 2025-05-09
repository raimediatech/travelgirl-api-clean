import i18n from "../../../config/i18n.js";
import constants from "../../../utils/constants.js";
import helper from "../../../utils/helper.js";
import mongoose from "mongoose";
import tripModel from "../../../models/trip.model.js";
import userModel from "../../../models/user.model.js";

const createTrip = async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.body.user_info._id });

    if (!user) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_user_not_found")
      );
    }
    await tripModel.create({
      userId: req.body.user_info._id,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      description: req.body.description,
      address: req.body?.address,
      tripType: req.body.tripType,
      numberOfUsers: req.body.numberOfUsers,
      location: {
        type: "Point",
        coordinates: [Number(req.body.longitude), Number(req.body.latitude)], 
      },
      country: req.body.country,
      flag: req.body?.flag,
      city: req.body.city,
    });
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_trip_created_successfully")
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

const getUserTrips = async (req, res) => {
  try {
    let user = await userModel.findOne({
      _id: mongoose.Types.ObjectId.createFromHexString(req.params.id),
    });
    if (!user) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_user_not_found")
      );
    }
    let filter = {
      userId: mongoose.Types.ObjectId.createFromHexString(req.params.id),
      status: constants.CONST_STATUS_ACTIVE,
    };
    if (req.query?.tripType) {
      filter.tripType = Number(req.query?.tripType);
    }

    let pipeline = [
      {
        $match: filter,
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
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          tripType: 1,
          address: 1,
          latitude: 1,
          longitude: 1,
          numberOfUsers: 1,
          userId: 1,
          description: 1,
          startDate: 1,
          endDate: 1,
          createdAt: 1,
          country: 1,
          city: 1,
          flag: 1,
          location:1,
          isLocation:1,
          userData: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            image: 1,
            age: 1,
          },
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
    let result = await tripModel.aggregate(pipeline);
    if (result.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_no_record_found")
      );
    }
    if (req.query?.page) {
      pipeline.pop();
      pipeline.pop();
    }
    let tripCount = await tripModel.aggregate(pipeline);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_trip_list"),
      result,
      tripCount.length
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

const getAllTrips = async (req, res) => {
  try {
    const currentTimestamp = Date.now();


    let filter = {
      status: constants.CONST_STATUS_ACTIVE,
      // startDate: { $gte: currentTimestamp },
    };
    // let userData = await userModel.find({ _id: req.body.user_info._id });
    if (req.query?.search) {
      filter.country = {
        $regex: ".*" + req.query.search + ".*",
        $options: "i",
      };
    }
    if (req.body?.startDate && req.body?.endDate) {
      filter.$and = [
        { startDate: { $gte: req.body.startDate } },
        { endDate: { $lte: req.body.endDate } },
      ];
    }
    if (req.body?.country) {
      filter.country = {
        $regex: ".*" + req.body.country + ".*",
        $options: "i",
      };
    }

    if (req.query?.tripType) {
      filter.tripType = Number(req.query?.tripType);
    }

    let pipeline = [
      {
        $match: filter,
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
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          tripType: 1,
          address: 1,
          latitude: 1,
          location:1,
          isLocation:1,
          longitude: 1,
          numberOfUsers: 1,
          userId: 1,
          description: 1,
          startDate: 1,
          endDate: 1,
          createdAt: 1,
          country: 1,
          city: 1,
          flag: 1,
          userData: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            image: 1,
            age: 1,
            latitude: 1,
            longitude: 1,
            location:1,
            isLocation:1,
          },
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
    let result = await tripModel.aggregate(pipeline);
    if (result.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_no_record_found")
      );
    }
    // if (
    //   req.body?.distanceRange &&
    //   userData.latitude != 0 &&
    //   userData.longitude != 0
    // ) {
    //   result = await helper.getUserByDistance(
    //     result,
    //     userData.latitude,
    //     userData.longitude,
    //     req.body?.distanceRange
    //   );
    //   if (result.length == 0) {
    //     return helper.returnFalseResponse(
    //       req,
    //       res,
    //       constants.CONST_RESP_CODE_OK,
    //       i18n.__("lang_no_record_found")
    //     );
    //   }
    // }
    if (req.query?.page) {
      pipeline.pop();
      pipeline.pop();
    }
    let tripCount = await tripModel.aggregate(pipeline);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_trip_list"),
      result,
      tripCount.length
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

let tripController = {
  createTrip: createTrip,
  getUserTrips: getUserTrips,
  getAllTrips: getAllTrips,
};

export default tripController;
