import express from "express";
import commonController from "../controller/common.controller.js";
import commonValidator from "../../../utils/validation.js";
import AuthMiddleware from "../../../middleware/auth_middleware.js";
import contentUpload from "../../../middleware/contentUpload.js";

const adminCommonRouter = express.Router();

adminCommonRouter.get(
  "/dashboard",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.dashboard
);

adminCommonRouter.get(
  "/static-pages",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.getStaticContent
);

adminCommonRouter.patch(
  "/update-static",
  commonValidator.joiStaticPageValidator,
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.updateContent
);

adminCommonRouter.get(
  "/users",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.userList
);

adminCommonRouter.get(
  "/user-detail/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.userDetail
);

adminCommonRouter.patch(
  "/user-status-update/:userId",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.updateUserStatus
);

// adminCommonRouter.patch(
//   "/user-delete/:userId",
//   AuthMiddleware.checkAuthTokenAndVersion,
//   commonController.deleteUserAccount
// );

adminCommonRouter.get(
  "/email",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.getEmail
);

adminCommonRouter.get("/footer", commonController.getFooterContent);

adminCommonRouter.patch(
  "/footer/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiUpdateFooterValidation,
  commonController.updateFooterContent
);

adminCommonRouter.get(
  "/report-list",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.getReportList
);

adminCommonRouter.get(
  "/transaction-list",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.getTransactionList
);

adminCommonRouter.get(
  "/match-list/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.getMatchList
);

adminCommonRouter.patch(
  "/update-profile",
  contentUpload.single("profileImage"),
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiUpdateProfileValidator,
  commonController.updateProfile
);

adminCommonRouter.patch(
  "/approve-user-report/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.approveUserReport
);

adminCommonRouter.patch(
  "/ignore-user-report/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.ignoreUserReport
);

adminCommonRouter.patch(
  "/approve-reject/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.rejectOrApproveUserProfile
);

adminCommonRouter.patch(
  "/update-version/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.updateVersion
);

adminCommonRouter.get(
  "/get-version",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.getVersion
);

adminCommonRouter.get(
  "/contact-support",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonController.getContactSupport
);

export default adminCommonRouter;
