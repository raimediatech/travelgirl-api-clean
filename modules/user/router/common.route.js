import commonController from "../controller/common.controller.js";
import commonValidator from "../../../utils/validation.js";
import AuthMiddleware from "../../../middleware/auth_middleware.js";
import express from "express";
import contentUpload from "../../../middleware/contentUpload.js";
const commonRouter = express.Router();

commonRouter.post(
  "/upload-profile-image/:id",
  contentUpload.single("profileImage"),
  commonController.uploadProfileImage
);

commonRouter.post(
  "/upload-gallery-image",
  contentUpload.single("profileImage"),
  commonController.uploadProfileGallery
);

commonRouter.get(
  "/gallery-image/:id",
  commonController.getProfileGallery
);

commonRouter.patch(
  "/update-gallery-image/:id",
  contentUpload.single("profileImage"),
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.updateProfileGallery
);

commonRouter.delete(
  "/delete-gallery-image/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.deleteProfileGallery
);

commonRouter.post(
  "/user-subscription-plan",
  commonValidator.joiAddSubscriptionValidator,
  commonController.addSubscriptionPlan
);

commonRouter.get(
  "/user-subscription-plan",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.getUserSubscriptionPlan
);

commonRouter.get(
  "/profile/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.getProfile
);

commonRouter.patch(
  "/update-profile",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiUpdateProfileValidator,
  commonController.updateProfile
);

commonRouter.post(
  "/add-detail",
  //   contentUpload.fields([
  //     { name: "documentImage", maxCount: 1 },
  //     { name: "documentVedio", maxCount: 1 },
  // ]),
  commonValidator.joiAddDetailValidator,
  commonController.addDetail
);

commonRouter.post(
  "/add-vedio/:id",
  contentUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "vedio", maxCount: 1 },
  ]),
  commonController.uploadVedio
);

commonRouter.post(
  "/add-email",
  commonValidator.joiResendOtpValidator,
  commonController.addEmail
);

commonRouter.get("/footer", commonController.getFooterContent);

commonRouter.patch(
  "/notification",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.notificationOnOff
);

commonRouter.post(
  "/delete",
  commonValidator.joiLoginValidator,
  commonController.deleteUserAccountFromWeb
);

commonRouter.post(
  "/get-nomad",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.getNomad
);

commonRouter.post(
  "/find-by",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.findBy
);

commonRouter.post(
  "/ignore-match",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiMatchIgnoreValidator,
  commonController.ignoreMatch
);

commonRouter.post(
  "/undo-match",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.undoMatch
);

commonRouter.post(
  "/like-match",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiMatchIgnoreValidator,
  commonController.likeMatch
);

commonRouter.post(
  "/super-match",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiMatchIgnoreValidator,
  commonController.superLikeMatch
);

commonRouter.post(
  "/wink-match",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiMatchIgnoreValidator,
  commonController.winkMatch
);

commonRouter.post(
  "/report-match",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiReportMatchValidator,
  commonController.reportMatch
);

commonRouter.get(
  "/myMatches",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.myMatches
);

commonRouter.get(
  "/likes-sent-list",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.likeSentList
);

commonRouter.get(
  "/likes-received-list",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.likeReceivedList
);

commonRouter.patch(
  "/delete-account",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.deleteAccount
);

commonRouter.post(
  "/block-unblock",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiBlockUserValidator,
  commonController.blockUnblockUser
);

commonRouter.get(
  "/block-user-list",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.blockUserList
);

commonRouter.get(
  "/view-list",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.profileViewList
);

// commonRouter.post(
//   "/open-ai",
//   commonController.openAI
// );

commonRouter.patch(
  "/update-lat-long/:id",
  // AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiUpdateLatLongValidator,
  commonController.updateLatLong
);

commonRouter.get(
  "/notification-list",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.getNotification
);

commonRouter.patch(
  "/update-notification/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.updateNotification
);

commonRouter.post(
  "/upload-image",
  contentUpload.single("image"),
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.uploadImage
);

commonRouter.post(
  "/contact-support",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.contactSupport
);

export default commonRouter;
