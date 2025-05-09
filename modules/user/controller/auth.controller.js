import { isRunnableFunctionWithParse } from "openai/lib/RunnableFunction.mjs";
import i18n from "../../../config/i18n.js";
import celebritiesImagesModel from "../../../models/celebritiesImages.model.js";
import userModel from "../../../models/user.model.js";
import userSubscriptionModel from "../../../models/userSubscription.model.js";
import constants from "../../../utils/constants.js";
import emailSender from "../../../utils/emailSender.js";
import helper from "../../../utils/helper.js";

let signup = async (req, res) => {
  try {
    const body = req.body;
    let uniqueCheck = await userModel.findOne({ email: body.email });

    if (uniqueCheck) {
      if (uniqueCheck.emailVerified == constants.CONST_USER_VERIFIED_FALSE) {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_OK,
          i18n.__("lang_you_are_not_verified_please_verify"),
          uniqueCheck.email
        );
      }
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_validate_error_email_unique")
      );
    } else {
      let hashedPassword = await helper.encryptPassword(body.password);
      let otpData = await helper.generateOtp();
      let city = body?.city;
      // if (req.body?.cityName) {
      //   city = await helper.addCity(body?.state, body?.cityName);
      // }
      let age;
      if (req.body?.dob) {
        age = await helper.calculateAge(req.body?.dob);
      }
      const newUser = new userModel({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        deletedFirstName: body.firstName,
        deleteLastName: body.lastName,
        role: constants.CONST_ROLE_USER,
        password: hashedPassword,
        otp: otpData.randomOtp,
        otpExpiry: otpData.expirationTime,
        otpType: constants.CONST_REGISTER_OTP,
        dob: body.dob,
        city: city,
        age: age,
        country: body?.country,
        gender: body.gender,
        accountVerifiedTime: Math.floor(new Date().getTime() / 1000) + 1800,
        cityName: body?.cityName,
        countryName: body?.countryName,
        profilePercentage: body?.profilePercentage,
        flag:body?.flag,
      });
      let newData = await newUser.save();
      await emailSender.sendRegistrationOtp(newData, otpData);
      await emailSender.sendRegistrationApprovalMail(newData);

      newData.password = "";
      newData.otp = "";
      let data = { newData };

      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_signup_success"),
        data
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

let login = async (req, res) => {
  try {
    const body = req.body;
    const headerContent = req?.headers;
    const deviceToken = headerContent["device-token"];
    const deviceType = headerContent["device-type"];
    const timeZone = headerContent["time-zone"];
    let existUser = await userModel.findOneAndUpdate(
      {
        email: body.email,
        role: constants.CONST_ROLE_USER,
      },
      {
        deviceType: deviceType,
        deviceToken: deviceToken,
        timeZone: timeZone,
      },
      {
        new: true,
      }
    );

    if (!existUser) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_user_not_found")
      );
    }
    if (existUser.role == constants.CONST_ROLE_ADMIN) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_you_are_not_user")
      );
    }
    if (existUser.emailVerified == constants.CONST_USER_VERIFIED_FALSE) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_you_are_not_verified_please_verify"),
        existUser._id
      );
    }

    if (
      (existUser.status == constants.CONST_STATUS_INACTIVE ||
        existUser.isAccountVerified == constants.CONST_USER_VERIFIED_FALSE) &&
      existUser.profileAdded == constants.CONST_USER_VERIFIED_TRUE
    ) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__(
          "lang_your_account_is_inactive_by_admin. please contact to admin or wait for admin approval"
        ),
        existUser._id
      );
    }
    // if (
    //   existUser.isSubscriptionPurchased == constants.CONST_USER_VERIFIED_FALSE
    // ) {
    //   return helper.returnFalseResponse(
    //     req,
    //     res,
    //     constants.CONST_RESP_CODE_OK,
    //     i18n.__("lang_please_purchase_your_subscription_plan"),
    //     existUser._id
    //   );
    // }

    let isPasswordMatch = await helper.passwordCompare(
      body.password,
      existUser.password
    );
    if (!isPasswordMatch) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_incorrect_password")
      );
    }

    let token = await helper.jwtToken(existUser);

    existUser.password = "";
    existUser.otp = "";

    let data = { existUser, token };

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_login_success"),
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

const forgotPassword = async (req, res) => {
  try {
    const body = req.body;
    const email = body.email;
    let isEmailExist = await userModel.findOne({
      email,
      status: constants.CONST_STATUS_ACTIVE,
    });
    if (!isEmailExist) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_user_not_found")
      );
    }
    let otpData = await helper.generateOtp();
    let updatedData = await userModel.findOneAndUpdate(
      { email: email },
      {
        otp: otpData.randomOtp,
        otpExpiry: otpData.expirationTime,
        otpType: constants.CONST_FORGOT_OTP,
      },
      { new: true }
    );
    if (!updatedData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_something_went_wrong_please_click_on_resend")
      );
    }
    await emailSender.forgotPasswordOtp(updatedData, otpData);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_otp_is_sent_to_your_registered_email")
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

const verifyOtp = async (req, res) => {
  try {
    const body = req.body;
    const currentTime = Date.now();
    let isOtpExist = await userModel.findOne({
      otp: body.otp,
      email: body.email,
    });
    if (isOtpExist) {
      if (isOtpExist.otpExpiry < currentTime) {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_OK,
          i18n.__("lang_otp_expires_please_click_on_resend")
        );
      }
      let newData = await userModel.findOneAndUpdate(
        {
          otp: body.otp,
          email: body.email,
        },
        {
          emailVerified: constants.CONST_USER_VERIFIED_TRUE,
          otp: null,
          otpExpiry: null,
          otpType: null,
          // status: constants.CONST_STATUS_ACTIVE,
        }
      );
      let token = await helper.jwtToken(newData);
      let data = {
        token: token,
        id: newData._id,
        profilePercentage: newData.profilePercentage,
      };
      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_verified"),
        data
      );
    } else {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        i18n.__("lang_invalid_otp")
      );
    }
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

const resendOtp = async (req, res) => {
  try {
    // #TODO: verify otp
    const body = req.body;
    let otpData = await helper.generateOtp();
    let data = await userModel.findOne({ email: body.email });
    if (!data) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_something_went_wrong_please_click_on_resend")
      );
    }
    await userModel.updateOne(
      { email: body.email },
      { otp: otpData.randomOtp, otpExpiry: otpData.expirationTime }
    );
    await emailSender.resendOtp(data, otpData);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_otp_is_sent_to_your_registered_email")
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

const forgotPasswordReset = async (req, res) => {
  // #TODO: Update Password
  try {
    const body = req.body;
    let isValidUser = await userModel.findOneAndUpdate(
      {
        email: body.email,
      },
      {
        password: await helper.encryptPassword(body.password),
      }
    );
    if (!isValidUser) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_otp_not_verified.please verify")
      );
    }
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_password_updated_successfully")
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
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

const socialLogin = async (req, res) => {
  try {
    let body = req.body;
    let pass = await helper.generatePassword();
    let hashedPassword = await helper.encryptPassword(pass);
    let age = await helper.calculateAge(body.dob);
    let otpData = await helper.generateOtp();

    const newUser = new userModel({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      role: constants.CONST_ROLE_USER,
      password: hashedPassword,
      otp: otpData.randomOtp,
      otpExpiry: otpData.expirationTime,
      otpType: constants.CONST_REGISTER_OTP,
      dob: body.dob,
      city: body.city,
      age: age,
      country: body?.country,
      gender: body.gender,
      accountVerifiedTime: Math.floor(new Date().getTime() / 1000) + 1800,
      cityName: body?.cityName,
      countryName: body?.countryName,
      profilePercentage: body?.profilePercentage,
      uuid: body?.uuid,
      flag: body?.flag
    });
    let newData = await newUser.save();
    await emailSender.sendRegistrationOtp(newData, otpData);
    await emailSender.sendRegistrationApprovalMail(newData);
    newData.password = "";
    newData.otp = "";

    let data = { newData };

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_signup_success"),
      data
    );
  } catch (error) {
    console.log(error);
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

const emailCheck = async (req, res) => {
  try {
    const email = req.body.email;
    const getUserDetail = await userModel.findOne({
      email: email,
    });
    if (!getUserDetail) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_FOUND,
        i18n.__("lang_record_not_found")
      );
    }
    if (getUserDetail.role == constants.CONST_ROLE_ADMIN) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_you_are_not_user")
      );
    }
    if (getUserDetail.emailVerified == constants.CONST_USER_VERIFIED_FALSE) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__("lang_you_are_not_verified_please_verify"),
        getUserDetail._id
      );
    }

    if (
      (getUserDetail.status == constants.CONST_STATUS_INACTIVE ||
        getUserDetail.isAccountVerified ==
          constants.CONST_USER_VERIFIED_FALSE) &&
      getUserDetail.profileAdded == constants.CONST_USER_VERIFIED_TRUE
    ) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        i18n.__(
          "lang_your_account_is_inactive_by_admin. please contact to admin or wait for admin approval"
        ),
        getUserDetail._id
      );
    }
    let token = await helper.jwtToken(getUserDetail);
    getUserDetail.password = "";
    getUserDetail.otp = "";
    let data = { getUserDetail, token };

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_login_success"),
      data
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_BAD_REQUEST,
      error.message
    );
  }
};

let uploadCelebrityImage = async (req, res) => {
  try {
    let imageUrl = req.file.location;
    await celebritiesImagesModel.create({
      name: req.body.name,
      image: imageUrl,
    });
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      i18n.__("lang_image_uploaded_successfully")
    );
  } catch (error) {
    console.log("Error in authUserController.uploadCelebrityImage: ", error);
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_BAD_REQUEST,
      error.message
    );
  }
};

const recognizeImage = async (req, res) => {
  try {
    const userImageKey = req.file.location;

    const celebrities = await celebritiesImagesModel.find();
    if (!celebrities || celebrities.length === 0) {
      return res.status(404).json({ message: "No celebrities found" });
    }

    const comparisonResults = await Promise.all(
      celebrities.map(async (celebrity) => {
        const similarity = await helper.compareFaces(
          userImageKey,
          celebrity.image
        );
        return {
          celebrityName: celebrity.name,
          celebrityImageKey: celebrity.image,
          similarity: similarity,
        };
      })
    );

    // Sort the results by similarity in descending order
    comparisonResults.sort((a, b) => b.similarity - a.similarity);

    res.status(200).json({
      message: "Comparison completed",
      allResults: comparisonResults,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Error processing the request" });
  }
};

let authUserController = {
  signup: signup,
  login: login,
  forgotPassword: forgotPassword,
  verifyOtp: verifyOtp,
  resendOtp: resendOtp,
  forgotPasswordReset: forgotPasswordReset,
  changePassword: changePassword,
  emailCheck: emailCheck,
  uploadCelebrityImage: uploadCelebrityImage,
  recognizeImage: recognizeImage,
  socialLogin: socialLogin,
};

export default authUserController;
