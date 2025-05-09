import express from "express";
import AuthMiddleware from "../../../middleware/auth_middleware.js";
import masterController from "../controller/master.controller.js";
import commonValidator from "../../../utils/validation.js";
import contentUpload from "../../../middleware/contentUpload.js";

const masterRouter = express.Router();

masterRouter.get(
  "/interest-list",
  AuthMiddleware.checkAuthTokenAndVersion,
  masterController.interestList
);

masterRouter.post(
  "/add-interest",
  contentUpload.single("icon"),
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiAddInterestValidator,
  masterController.addInterest
);

masterRouter.patch(
  "/update-interest/:id",
  contentUpload.single("icon"),
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiUpdateInterestValidator,
  masterController.updateInterest
);

masterRouter.patch(
  "/delete-interest/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  masterController.deleteInterest
);

masterRouter.get(
  "/hair-type-list",
  AuthMiddleware.checkAuthTokenAndVersion,
  masterController.hairList
);

masterRouter.post(
  "/add-hair-type",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiAddHairTypeValidator,
  masterController.addHairType
);

masterRouter.patch(
  "/update-hair-type/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiUpdateHairTypeValidator,
  masterController.updateHairType
);

masterRouter.patch(
  "/delete-hair-type/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  masterController.deleteHairType
);

masterRouter.get(
  "/eye-type-list",
  AuthMiddleware.checkAuthTokenAndVersion,
  masterController.eyeTypeList
);

masterRouter.post(
  "/add-eye-type",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiAddEyeTypeValidator,
  masterController.addEyeType
);

masterRouter.patch(
  "/update-eye-type/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiUpdateEyeTypeValidator,
  masterController.updateEyeType
);

masterRouter.patch(
  "/delete-eye-type/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  masterController.deleteEyeType
);

masterRouter.get(
  "/body-type-list",
  AuthMiddleware.checkAuthTokenAndVersion,
  masterController.bodyTypeList
);

masterRouter.post(
  "/add-body-type",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiAddBodyTypeValidator,
  masterController.addBodyType
);

masterRouter.patch(
  "/update-body-type/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiUpdateBodyTypeValidator,
  masterController.updateBodyType
);

masterRouter.patch(
  "/delete-body-type/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  masterController.deleteBodyType
);

masterRouter.get(
  "/preference-list",
  AuthMiddleware.checkAuthTokenAndVersion,
  masterController.travelPreferenceList
);

masterRouter.post(
  "/add-preference",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiAddTravelPreferenceValidator,
  masterController.addTravelPreference
);

masterRouter.patch(
  "/update-preference/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiAddTravelPreferenceValidator,
  masterController.updateTravelPreference
);

masterRouter.patch(
  "/delete-preference/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  masterController.deleteTravelPreference
);

masterRouter.get(
    "/language-list",
    AuthMiddleware.checkAuthTokenAndVersion,
    masterController.languageList
  );
  
  masterRouter.post(
    "/add-language",
    AuthMiddleware.checkAuthTokenAndVersion,
    commonValidator.joiAddLanguageValidator,
    masterController.addLanguage
  );
  
  masterRouter.patch(
    "/update-language/:id",
    AuthMiddleware.checkAuthTokenAndVersion,
    commonValidator.joiAddLanguageValidator,
    masterController.updateLanguage
  );
  
  masterRouter.patch(
    "/delete-language/:id",
    AuthMiddleware.checkAuthTokenAndVersion,
    masterController.deleteLanguage
  );

masterRouter.post(
  "/add-city",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiAddCityValidator,
  masterController.addCity
);

masterRouter.patch(
  "/edit-city/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  commonValidator.joiAddCityValidator,
  masterController.updateCity
);

masterRouter.patch(
  "/delete-city/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  masterController.deleteCity
);

masterRouter.get(
  "/countries",
  AuthMiddleware.checkAuthTokenAndVersion,
  masterController.getCountries
);

masterRouter.get(
  "/cities/:id",
  AuthMiddleware.checkAuthTokenAndVersion,
  masterController.getCities
);

export default masterRouter;
