import jwt from "jsonwebtoken";
import constants from "../utils/constants.js";
import appVersionModel from "../models/appVersion.model.js";
import mongoose from "mongoose";
import helper from "../utils/helper.js";
import i18n from "../config/i18n.js";
import userModel from "../models/user.model.js";

let checkAuthTokenAndVersion = async (req, res, next) => {
  const headerContent = req.headers;
  const deviceToken = headerContent["device-token"];
  const deviceType = headerContent["device-type"];
  const version = headerContent["version"];
  let versionData = await appVersionModel.findOne({ device: deviceType });

  if (version < versionData.version) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_UNAUTHORIZED,
      i18n.__("lang_version_updated"),
      {},
      460
    );
  }

  // Accept both 'authorization' and 'x-authorization' headers, any case
  let getAuthToken =
    headerContent["authorization"] ||
    headerContent["x-authorization"] ||
    headerContent["Authorization"] ||
    headerContent["X-Authorization"];

  if (!getAuthToken) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_UNAUTHORIZED,
      i18n.__("lang_invalid_token")
    );
  }
  if (!getAuthToken.includes("Bearer")) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_UNAUTHORIZED,
      i18n.__("lang_invalid_token")
    );
  }

  try {
    const parts = getAuthToken.split(" ");
    if (parts.length !== 2) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_UNAUTHORIZED,
        i18n.__("lang_invalid_token")
      );
    }
    const scheme = parts[0];
    const token = parts[1];
    if (!/^Bearer$/i.test(scheme)) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_UNAUTHORIZED,
        i18n.__("lang_invalid_token")
      );
    }
    const tokenPayload = jwt.decode(token);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (tokenPayload?.exp < currentTimestamp) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_UNAUTHORIZED,
        i18n.__("lang_token_expired"),
        {},
        461
      );
    }
    const decodeToken = jwt.verify(token, constants.CONST_JWT_TOKEN_KEY);

    if (
      decodeToken.hasOwnProperty("id") &&
      decodeToken.hasOwnProperty("email")
    ) {
      let userInfo = await userModel
        .findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(decodeToken.id),
          },
          { deviceType: deviceType, deviceToken: deviceToken }
        );
      if (!userInfo) {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_UNAUTHORIZED,
          i18n.__("lang_invalid_token")
        );
      }
      req.userInfo = userInfo;
      next();
    } else {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_UNAUTHORIZED,
        i18n.__("lang_invalid_token")
      );
    }
  } catch (err) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_UNAUTHORIZED,
      i18n.__("lang_invalid_token")
    );
  }
};

let AuthMiddleware = {
  checkAuthTokenAndVersion: checkAuthTokenAndVersion,
};

export default AuthMiddleware;
