import constants from "../../../utils/constants.js";
import helper from "../../../utils/helper.js";
import i18n from "../../../config/i18n.js";
import jwt from "jsonwebtoken";
import userModel from "../../../models/user.model.js";

const login = async (req, res) => {
  try {
    const body = req.body;
    const userInfo = await userModel.findOne({ email: body.email });
    if (!userInfo) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_user_not_found")
      );
    }

    if (
      userInfo.role == constants.CONST_ROLE_USER
    ) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_you_are_not_admin")
      );
    }
    const verifyPassword = await helper.passwordCompare(
      body.password,
      userInfo.password
    );
    if (verifyPassword) {
      const token = jwt.sign(
        {
          id: userInfo._id,
          email: userInfo.email,
        },
        process.env.JWT_TOKEN_KEY,
        { expiresIn: constants.CONST_VALIDATE_SESSION_EXPIRE }
      );
     
      delete userInfo.password;
      let data = { userInfo, token };
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_login_Success"),
        data
      );
    } else {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_invalid_credentials")
      );
    }
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_BAD_REQUEST,
      error.message,
      {}
    );
  }
};

const changePassword = async (req, res) => {
  try {
    const body = req.body;
   
    const userId = req.body.user_info._id;
    let isUserValid = await userModel.findOne({
      _id: userId,
      status: constants.CONST_STATUS_ACTIVE,
    });
    if (!isUserValid) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_user_not_found")
      );
    }
    const oldPassword = await helper.passwordCompare(
      body.oldPassword,
      isUserValid.password
    );
    if (!oldPassword) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_your_old_password_is_wrong")
      );
    }
    await userModel.updateOne(
      {
        _id: userId,
      },
      {
        password: await helper.encryptPassword(body.newPassword),
      }
    );
   
    
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_password_changed_successfully")
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_BAD_REQUEST,
      error.message,
      data
    );
  }
};

let authController = {
  login: login,
  changePassword: changePassword,
};

export default authController;
