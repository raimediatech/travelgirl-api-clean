import constants from "./constants.js";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import moment from "moment";
import jwt from "jsonwebtoken";
import tripModel from "../models/trip.model.js";
import matchIgnoreModel from "../models/ignore.model.js";
import matchModel from "../models/match.model.js";
import userReportModel from "../models/userReport.model.js";
import AWS from "aws-sdk";
import userGalleryModel from "../models/userGallery.model.js";
import notificationModel from "../models/notification.model.js";

import emailSender from "./emailSender.js";
AWS.config.update({
  accessKeyId: constants.AWS_S3_BUCKET_ACCESS_ID,
  secretAccessKey: constants.AWS_S3_BUCKET_SECRET_ID,
  region: constants.AWS_S3_BUCKET_REGION,
});

const rekognition = new AWS.Rekognition();

const checkEmailUser = async (email) => {
  let userData = await userModel.findOne({
    email: email,
  });
  var message;
  if (userData) {
    if (userData.emailVerified == constants.CONST_USER_VERIFIED_FALSE) {
      let otpData = await helper.generateOtp();
      await userModel.updateMany(
        { email: email },
        {
          otp: otpData.randomOtp,
          otpExpiry: otpData.expirationTime,
          otpType: constants.CONST_REGISTER_OTP,
        },
        {
          new: true,
        }
      );
      return { newData: userData, otpData: otpData };
    } else if (
      userData.isAccountVerified == constants.CONST_USER_VERIFIED_FALSE
    ) {
      return (message =
        "lang_you_are_exist_but_not_verified_by_admin_please_wait");
    } else {
      return (message = "lang_email_already_exist");
    }
  }
  return message;
};

const generateOtp = async () => {
  const randomOtp = String(Math.floor(1000 + Math.random() * 9000));
  const currentTime = new Date();
  const expirationTime = new Date(
    currentTime.getTime() + 10 * 60 * 1000
  ).toISOString();
  let result = {
    randomOtp: randomOtp,
    expirationTime: expirationTime,
  };
  return result;
};

const passwordCompare = async (password, savedPassword) => {
  return await bcrypt.compare(password, savedPassword);
};

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(constants.CONST_GEN_SALT);
  password = await bcrypt.hash(password, salt);
  return password;
};

const getAdminDetails = async () => {
  return await userModel.findOne({ role: constants.CONST_ROLE_ADMIN });
};

const removeBackSlashes = (value) => {
  return value.replace(/\//g, "");
};

const calculateAge = async (dob) => {
  const today = moment();
  const birthDate = moment(dob, "YYYY-MM-DD");
  const years = today.diff(birthDate, "years");
  return years;
};

const returnTrueResponse = async (
  req,
  res,
  statusCode,
  message,
  arr,
  totalCounts,
  unreadCount
) => {
  return res.status(statusCode).json({
    version: {
      current_version: constants.CONST_APP_VERSION,
      major_update: 0,
      minor_update: 0,
      message: "App is Up to date",
    },
    success: 1,
    message: message,
    data: arr,
    totalCounts: totalCounts,
    unreadCount: unreadCount,
  });
};

const returnFalseResponse = (
  req,
  res,
  statusCode,
  message,
  arr,
  error_code
) => {
  return res.status(statusCode).json({
    version: {
      current_version: constants.CONST_APP_VERSION,
      major_update: 0,
      minor_update: 0,
      message: "App is Up to date",
    },
    success: 0,
    message: message,
    data: arr,
    error_code: error_code,
  });
};

const validationErrorConverter = (logs) => {
  let error;
  for (let i = 0; i <= Object.values(logs.errors).length; i++) {
    error = Object.values(logs.errors)[0].message;
    break;
  }
  return error;
};

const joiValidationErrorConvertor = async (errors) => {
  let error_message = "";
  errors.forEach((element, index) => {
    error_message = element.message;
    return true;
  });
  error_message = error_message.replaceAll("/", " ");
  error_message = error_message.replaceAll("_", " ");
  return error_message;
};

const jwtToken = async (userData) => {
  const secretKey = process.env.JWT_TOKEN_KEY;
  const user = {
    id: userData._id,
    email: userData.email,
    role: userData.role,
  };
  const token = jwt.sign(user, secretKey, { expiresIn: '30d' });
  return token;
};

let updateEmail = async (userData) => {
  const currentTimestamp = new Date().getTime();
  const updatedEmail = `deleted${currentTimestamp}_${userData.email}`;
  let newData = await userModel.findOne({ _id: userData._id });
  let data = await userModel.findOneAndUpdate(
    {
      _id: userData._id,
    },
    {
      status: constants.CONST_STATUS_DELETED,
      isDeleted: constants.CONST_USER_VERIFIED_TRUE,
      firstName: "@capri_app_user",
      lastName: "user",
      image: constants.CONST_DUMMY_IMAGE,
      email: updatedEmail,
      deletedFirstName: newData.firstName,
      deleteLastName: newData.lastName,
      deletedImage: newData.image,
    },
    { new: true }
  );
  let userId = userData._id;
  await userGalleryModel.deleteMany({ userId: userId });
  await matchModel.deleteMany({ userId: userId });
  await matchModel.deleteMany({ matchId: userId });
  await matchIgnoreModel.deleteMany({ userId: userId });
  await matchIgnoreModel.deleteMany({ matchId: userId });
  await userReportModel.deleteMany({ userId: userId });
  await userReportModel.deleteMany({ matchId: userId });
  await tripModel.deleteMany({ userId: userId });

  return data;
};

const extractS3KeyFromUrl = async (s3Url) => {
  const urlParts = s3Url.split(".com/");
  return urlParts.length > 1 ? urlParts[1] : null;
};

const compareFaces = async (userImageKey, celebrityImageKey) => {
  console.log(userImageKey, celebrityImageKey);
  const userKey = await extractS3KeyFromUrl(userImageKey);
  const celebrityKey = await extractS3KeyFromUrl(celebrityImageKey);
  if (!userKey || !celebrityKey) return 0;
  const params = {
    SourceImage: {
      S3Object: {
        Bucket: constants.AWS_S3_BUCKET_NAME,
        Name: userKey,
      },
    },
    TargetImage: {
      S3Object: {
        Bucket: constants.AWS_S3_BUCKET_NAME,
        Name: celebrityKey,
      },
    },
    // MaxFaces: 1,
    QualityFilter: "AUTO",
    // MinConfidence: 70,
    // Attributes: ["DEFAULT"],
    SimilarityThreshold: 30,
  };

  try {
    const FaceMatches = await rekognition.compareFaces(params).promise();
    console.log("Face matches found:", FaceMatches);
    return FaceMatches.FaceMatches.length > 0
      ? FaceMatches.FaceMatches[0].Similarity
      : 0;
  } catch (err) {
    return 0;
  }
};

const notificationUpdate = async (result, jsonData) => {
  await notificationModel.findOneAndUpdate(
    { _id: result.notificationData },
    {
      pushNotificationResponse: result.notificationResponse,
      redirectionContain: jsonData,
      status: constants.CONST_STATUS_SUCCESS,
    },
    {
      new: true,
    }
  );
  return true;
};

const checkBoost = async () => {
  let currentTime = Math.floor(new Date().getTime() / 1000);
 
  let data = await userModel.updateMany(
    {
      boost: constants.CONST_USER_VERIFIED_TRUE,
      boostEndTime: { $lte: currentTime },
    },
    {
      boost: constants.CONST_USER_VERIFIED_FALSE,
      boostEndTime: "",
    }
  );
  

  return true;
};

const getUserByDistance = async (data, lat, long, range) => {
  let newData = [];
  for (let d of data) {
    let distance = await calculateDistance(lat, long, d.latitude, d.longitude);
   
    if (distance.toFixed(2) <= Number(range)) {
      newData.push(d);
    }
  }
  return newData;
};

const calculateDistance = async (lat1, lon1, lat2, lon2) => {
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  let r = 6371;

  // calculate the result
  return c * r * 1.6;
};

const email = async () => {
  let email = "pooja@yopmail.com";
  let firstName = "test user";
  let otpData = await generateOtp();
  let newData = {
    email: "pooja@yopmail.com",
    firstName: "test user",
    otp: otpData.randomOtp,
  };
  // Haversine formula
  // await emailSender.sendRegistrationOtp(newData, otpData);
  // await emailSender.resendOtp(newData, otpData)
  // await emailSender.forgotPasswordOtp(newData, otpData)
  await emailSender.sendAdminEmail(email),
    await emailSender.sendRegistrationApprovalMail(newData),
    await emailSender.sendUserEmail(email);
};

const generatePassword = async () => {
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const specialCharacters = "@#$%&*_";
  const numbers = "0123456789";
  const allCharacters =
    uppercaseLetters + specialCharacters + numbers + lowercaseLetters;
  const randomUppercase =
    uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
  const randomLowercase =
    lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
  const randomSpecial =
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
  const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
  let randomString = "";
  for (let i = 0; i < 5; i++) {
    randomString +=
      allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }
  const password =
    randomUppercase +
    randomSpecial +
    randomNumber +
    randomString +
    randomLowercase;

  return password;
};

const removeIgnoreProfile = async () => {
  try {
    const currentTimestamp = Date.now();
    let s = await matchIgnoreModel.deleteMany({
      repeatTime: { $lte: currentTimestamp },
    });
  } catch (error) {
    return error;
  }
};

let helper = {
  passwordCompare: passwordCompare,
  encryptPassword: encryptPassword,
  removeBackSlashes: removeBackSlashes,
  returnTrueResponse: returnTrueResponse,
  returnFalseResponse: returnFalseResponse,
  validationErrorConverter: validationErrorConverter,
  joiValidationErrorConvertor: joiValidationErrorConvertor,
  checkEmailUser: checkEmailUser,
  generateOtp: generateOtp,
  jwtToken: jwtToken,
  getAdminDetails: getAdminDetails,
  compareFaces: compareFaces,
  calculateAge: calculateAge,
  updateEmail: updateEmail,
  notificationUpdate: notificationUpdate,
  checkBoost: checkBoost,
  getUserByDistance: getUserByDistance,
  calculateDistance: calculateDistance,
  email: email,
  generatePassword:generatePassword,
  removeIgnoreProfile:removeIgnoreProfile
};

export default helper;
