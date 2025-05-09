import i18n from "../config/i18n.js";
import nodemailer from "nodemailer";
import pug from "pug";
import constants from "./constants.js";

const sendEmail = async (name, email, subject, message) => {
 
  const transporter = nodemailer.createTransport({
    host: constants.CONST_SMTP_HOST,
    port: constants.CONST_SMTP_PORT,
    secure: true,
    auth: {
      user: constants.CONST_SMTP_USER,
      pass: constants.CONST_SMTP_PASSWORD,
    },
   
  });
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  const info = await transporter.sendMail({
    from: `${constants.CONST_APP_NAME} <${constants.CONST_SMTP_FROM_ADDRESS}>`,
    to: email,
    subject: subject,
    html: message,
  });
  console.log("Message sent: %s", info.messageId);
};

const sendRegistrationOtp = async (userData, otpData) => {
  let templateDir = "templates/";
  let messageBody = pug.renderFile(`${templateDir}registrationEmailOtp.pug`, {
    name: userData.firstName,
    email: userData.email,
    otp: otpData.randomOtp,
    logo: constants.CONST_APP_LOGO,
  });
  let subject = i18n.__("lang_registration_otp");
  await sendEmail(userData.name, userData.email, subject, messageBody);
  return true;
};

const resendOtp = async (userData, otpData) => {
  let templateDir = "templates/";
  let messageBody = pug.renderFile(`${templateDir}resendEmailOtp.pug`, {
    name: userData.name,
    email: userData.email,
    otp: otpData.randomOtp,
    logo: constants.CONST_APP_LOGO,
  });
  let subject = i18n.__("lang_resend_otp");
  await sendEmail(userData.name, userData.email, subject, messageBody);
  return true;
};

const forgotPasswordOtp = async (userData, otpData) => {
  let templateDir = "templates/";
  let messageBody = pug.renderFile(`${templateDir}forgotPasswordOtp.pug`, {
    name: userData.name,
    email: userData.email,
    otp: otpData.randomOtp,
    logo: constants.CONST_APP_LOGO,
  });
  let subject = i18n.__("lang_forgot_password_otp");
  await sendEmail(userData.name, userData.email, subject, messageBody);
  return true;
};

const sendAdminEmail = async (email) => {
  let adminEmail = "capriadmin@yopmail.com";
  let templateDir = "templates/";
  let messageBody = pug.renderFile(`${templateDir}emailRequest.pug`, {
    email: email,
    logo: constants.CONST_APP_LOGO,
  });
  let subject = i18n.__("lang_email_request");
  let test=await sendEmail("", adminEmail, subject, messageBody);
  
  return true;
};

const sendUserEmail = async (email) => {
  let templateDir = "templates/";
  let messageBody = pug.renderFile(`${templateDir}userEmail.pug`, {
    email: email,
    logo: constants.CONST_APP_LOGO,
  });
  let subject = i18n.__("lang_Exclusive_Pre-Sign_Up_Confirmation!");
  await sendEmail("", email, subject, messageBody);
  return true;
};

const sendRegistrationApprovalMail = async (userData) => {
  let templateDir = "templates/";
  let messageBody = pug.renderFile(`${templateDir}userApprovalMail.pug`, {
    name: userData.firstName,
    email:userData.email,
    logo: constants.CONST_APP_LOGO, 
  });
  let subject = i18n.__("lang_account_approval_email");
  await sendEmail("", "capriadmin@yopmail.com", subject, messageBody);
  return true;
};

const contactSupport = async (email,name) => {
  let templateDir = "templates/";
  let messageBody = pug.renderFile(`${templateDir}contactSupport.pug`, {
    name: name,
    email:email,
    logo: constants.CONST_APP_LOGO, 
  });
  let subject = i18n.__("lang_email");
  await sendEmail("", "capriadmin@yopmail.com", subject, messageBody);
  return true;
};

const emailSender = {
  sendRegistrationOtp: sendRegistrationOtp,
  resendOtp: resendOtp,
  forgotPasswordOtp: forgotPasswordOtp,
  sendUserEmail:sendUserEmail,
  sendAdminEmail:sendAdminEmail,
  sendRegistrationApprovalMail:sendRegistrationApprovalMail,
  contactSupport:contactSupport
};

export default emailSender;
