import i18n from "../config/i18n.js";
import nodemailer from "nodemailer";
import pug from "pug";
import constants from "./constants.js";

const sendEmail = async (name, email, subject, message) => {
  const isSecure = Number(constants.CONST_SMTP_PORT) === 465;

  const transporter = nodemailer.createTransport({
    host: constants.CONST_SMTP_HOST,
    port: constants.CONST_SMTP_PORT,
    secure: isSecure,          // SSL/TLS for port 465
    requireTLS: !isSecure,     // STARTTLS for 587/25
    tls: { rejectUnauthorized: false },
    auth: {
      user: constants.CONST_SMTP_USER,
      pass: constants.CONST_SMTP_PASSWORD,
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("SMTP server is ready to send messages");
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
  const templateDir = "templates/";
  const messageBody = pug.renderFile(`${templateDir}registrationEmailOtp.pug`, {
    name: userData.firstName,
    email: userData.email,
    otp: otpData.randomOtp,
    logo: constants.CONST_APP_LOGO,
  });
  const subject = i18n.__("lang_registration_otp");
  await sendEmail(userData.name, userData.email, subject, messageBody);
  return true;
};

const resendOtp = async (userData, otpData) => {
  const templateDir = "templates/";
  const messageBody = pug.renderFile(`${templateDir}resendEmailOtp.pug`, {
    name: userData.name,
    email: userData.email,
    otp: otpData.randomOtp,
    logo: constants.CONST_APP_LOGO,
  });
  const subject = i18n.__("lang_resend_otp");
  await sendEmail(userData.name, userData.email, subject, messageBody);
  return true;
};

const forgotPasswordOtp = async (userData, otpData) => {
  const templateDir = "templates/";
  const messageBody = pug.renderFile(`${templateDir}forgotPasswordOtp.pug`, {
    name: userData.name,
    email: userData.email,
    otp: otpData.randomOtp,
    logo: constants.CONST_APP_LOGO,
  });
  const subject = i18n.__("lang_forgot_password_otp");
  await sendEmail(userData.name, userData.email, subject, messageBody);
  return true;
};

const sendAdminEmail = async (email) => {
  const adminEmail = "capriadmin@yopmail.com";
  const templateDir = "templates/";
  const messageBody = pug.renderFile(`${templateDir}emailRequest.pug`, {
    email: email,
    logo: constants.CONST_APP_LOGO,
  });
  const subject = i18n.__("lang_email_request");
  await sendEmail("", adminEmail, subject, messageBody);
  return true;
};

const sendUserEmail = async (email) => {
  const templateDir = "templates/";
  const messageBody = pug.renderFile(`${templateDir}userEmail.pug`, {
    email: email,
    logo: constants.CONST_APP_LOGO,
  });
  const subject = i18n.__("lang_Exclusive_Pre-Sign_Up_Confirmation!");
  await sendEmail("", email, subject, messageBody);
  return true;
};

const sendRegistrationApprovalMail = async (userData) => {
  const templateDir = "templates/";
  const messageBody = pug.renderFile(`${templateDir}userApprovalMail.pug`, {
    name: userData.firstName,
    email: userData.email,
    logo: constants.CONST_APP_LOGO,
  });
  const subject = i18n.__("lang_account_approval_email");
  await sendEmail("", "capriadmin@yopmail.com", subject, messageBody);
  return true;
};

const contactSupport = async (email, name) => {
  const templateDir = "templates/";
  const messageBody = pug.renderFile(`${templateDir}contactSupport.pug`, {
    name: name,
    email: email,
    logo: constants.CONST_APP_LOGO,
  });
  const subject = i18n.__("lang_email");
  await sendEmail("", "capriadmin@yopmail.com", subject, messageBody);
  return true;
};

const emailSender = {
  sendRegistrationOtp,
  resendOtp,
  forgotPasswordOtp,
  sendUserEmail,
  sendAdminEmail,
  sendRegistrationApprovalMail,
  contactSupport,
};

export default emailSender;
