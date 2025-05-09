import contentUpload from "../../../middleware/contentUpload.js";
import commonValidator from "../../../utils/validation.js";
import authUserController from "../controller/auth.controller.js";
import AuthMiddleware from "../../../middleware/auth_middleware.js";
import express from "express";
const authUserRouter = express.Router();

authUserRouter.post(
  "/signup",
  contentUpload.single("profileImage"),
  commonValidator.joiSignUpValidator,
  authUserController.signup
);

authUserRouter.post(
  "/login",
  commonValidator.joiLoginValidator,
  authUserController.login
);

authUserRouter.post(
  "/forgot-password",
  commonValidator.joiResendOtpValidator,
  authUserController.forgotPassword
);

authUserRouter.patch(
  "/verify-otp",
  commonValidator.joiVerifyOtpValidator,
  authUserController.verifyOtp
);

authUserRouter.patch(
  "/resend-otp",
  commonValidator.joiResendOtpValidator,
  authUserController.resendOtp
);

authUserRouter.patch(
  "/change-password",
  commonValidator.joiChangePasswordValidator,
  AuthMiddleware.checkAuthTokenAndVersion,
  authUserController.changePassword
);

authUserRouter.post(
  "/forgot-password",
  commonValidator.joiResendOtpValidator,
  authUserController.forgotPassword
);

authUserRouter.patch(
  "/forgot-password-reset",
  commonValidator.joiForgotPasswordResetValidator,
  authUserController.forgotPasswordReset
);

authUserRouter.post(
  "/upload-image",
  contentUpload.single("image"),
  authUserController.uploadCelebrityImage
);

authUserRouter.post(
  "/recognize-image",
  contentUpload.single("profileImage"),
  authUserController.recognizeImage
);

authUserRouter.post(
  "/email-check",
  commonValidator.joiResendOtpValidator,
  authUserController.emailCheck
);

authUserRouter.post(
  "/social-login",
  contentUpload.single("profileImage"),
  commonValidator.joiSocialSignUpValidator,
  authUserController.socialLogin
);

export default authUserRouter;
