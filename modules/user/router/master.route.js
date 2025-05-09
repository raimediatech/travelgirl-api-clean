import masterController from "../controller/master.controller.js";
import commonValidator from "../../../utils/validation.js";
import AuthMiddleware from "../../../middleware/auth_middleware.js";
import express from "express";
const masterRouter = express.Router();

masterRouter.get("/about-us", masterController.aboutUs);
masterRouter.get("/privacy-policy", masterController.privacyPolicy);
masterRouter.get("/footer", masterController.getFooterContent);
masterRouter.get("/term-condition", masterController.termCondition);
masterRouter.get("/contact-us", masterController.contactUs);
masterRouter.get("/countries", masterController.getCountries);
masterRouter.get("/cities/:id", masterController.getCities);

masterRouter.post(
  "/add-email",
  commonValidator.joiResendOtpValidator,
  masterController.addEmail
);

masterRouter.get(
  "/onboard-static-content",
  masterController.getUserMasterContent
);

masterRouter.get(
  "/report-master",
  AuthMiddleware.checkAuthTokenAndVersion,
  masterController.getReportMaster
);

export default masterRouter;
