import i18n from "../config/i18n.js";
import nodemailer from "nodemailer";
import pug from "pug";
import constants from "./constants.js";

/**
 * Send a single e-mail.
 */
const sendEmail = async (name, email, subject, message) => {
  // SMTP security mode depends on the port: 465 → SSL/TLS, 587/25 → STARTTLS
  const isSecure = Number(constants.CONST_SMTP_PORT) === 465;

  const transporter = nodemailer.createTransport({
    host: constants.CONST_SMTP_HOST,
    port: Number(constants.CONST_SMTP_PORT),
    secure: isSecure,          // SSL/TLS for 465
    requireTLS: !isSecure,     // STARTTLS for 587 / 25
    tls: { rejectUnauthorized: false },
    auth: {
      user: constants.CONST_SMTP_USER,
      pass: constants.CONST_SMTP_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    console.log("SMTP server is ready to send messages");
  } catch (err) {
    console.error("SMTP verification error:", err);
  }

  const info = await transporter.sendMail({
    from: `${constants.CONST_APP_NAME} <${constants.CONST_SMTP_FROM_ADDRESS}>`,
    to: email,
    subject,
    html: message,
  });

  console.log(`Message sent to ${email}: ${info.messageId}`);
};

/* ────────────────────────────────────────────────────────────────── */
/*  HIGH-LEVEL MAILERS                                               */
/* ────────────────────────────────────────────────────────────────── */

const templateDir = "templates/";

const sendRegistrationOtp = async (userData, otpData) => {
  const html = pug.renderFile(`${templateDir}registrationEmailOtp.pug`, {
    name:  userData.firstName,
    email: userData.email,
    otp:   otpData.randomOtp,
    logo:  constants.CONST_APP_LOGO,
  });
  await sendEmail(userData.firstName, userData.email, i18n.__("lang_registration_otp"), html);
  return true;
};

const resendOtp = async (userData, otpData) => {
  const html = pug.renderFile(`${templateDir}resendEmailOtp.pug`, {
    name:  userData.firstName,
    email: userData.email,
    otp:   otpData.randomOtp,
    logo:  constants.CONST_APP_LOGO,
  });
  await sendEmail(userData.firstName, userData.email, i18n.__("lang_resend_otp"), html);
  return true;
};

const forgotPasswordOtp = async (userData, otpData) => {
  const html = pug.renderFile(`${templateDir}forgotPasswordOtp.pug`, {
    name:  userData.firstName,
    email: userData.email,
    otp:   otpData.randomOtp,
    logo:  constants.CONST_APP_LOGO,
  });
  await sendEmail(userData.firstName, userData.email, i18n.__("lang_forgot_password_otp"), html);
  return true;
};

const sendAdminEmail = async (email) => {
  const adminEmail = "capriadmin@yopmail.com";
  const html = pug.renderFile(`${templateDir}emailRequest.pug`, {
    email,
    logo: constants.CONST_APP_LOGO,
  });
  await sendEmail("", adminEmail, i18n.__("lang_email_request"), html);
  return true;
};

const sendUserEmail = async (email) => {
  const html = pug.renderFile(`${templateDir}userEmail.pug`, {
    email,
    logo: constants.CONST_APP_LOGO,
  });
  await sendEmail("", email, i18n.__("lang_Exclusive_Pre-Sign_Up_Confirmation!"), html);
  return true;
};

const sendRegistrationApprovalMail = async (userData) => {
  const html = pug.renderFile(`${templateDir}userApprovalMail.pug`, {
    name:  userData.firstName,
    email: userData.email,
    logo:  constants.CONST_APP_LOGO,
  });
  await sendEmail("", "capriadmin@yopmail.com", i18n.__("lang_account_approval_email"), html);
  return true;
};

const contactSupport = async (email, name) => {
  const html = pug.renderFile(`${templateDir}contactSupport.pug`, {
    name,
    email,
    logo: constants.CONST_APP_LOGO,
  });
  await sendEmail("", "capriadmin@yopmail.com", i18n.__("lang_email"), html);
  return true;
};

/* ────────────────────────────────────────────────────────────────── */

export default {
  sendRegistrationOtp,
  resendOtp,
  forgotPasswordOtp,
  sendUserEmail,
  sendAdminEmail,
  sendRegistrationApprovalMail,
  contactSupport,
};
