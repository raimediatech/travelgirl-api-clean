import tripController from "../controller/trip.controller.js";
import commonValidator from "../../../utils/validation.js";
import AuthMiddleware from "../../../middleware/auth_middleware.js";
import express from "express";
const tripRouter = express.Router();

tripRouter.post(
  "/create",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiCreateTripValidator,
  tripController.createTrip
);

tripRouter.post(
  "/all",
  AuthMiddleware.checkAuthTokenAndVersion,
  tripController.getAllTrips
);

tripRouter.get(
  "/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  tripController.getUserTrips
);



export default tripRouter;
