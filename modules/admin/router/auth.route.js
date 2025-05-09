import authController from "../controller/auth.controller.js";
import express from "express";
import AuthMiddleware from "../../../middleware/auth_middleware.js";

const adminRouter = express.Router();

adminRouter.post("/login", authController.login);

adminRouter.patch(
  "/change-password",
  AuthMiddleware.checkAuthTokenAndVersion,
  authController.changePassword
);

export default adminRouter;
