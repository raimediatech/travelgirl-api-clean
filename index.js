import dotenv from "dotenv";
dotenv.config();
// Database connection
import connect from "./utils/dbConnection.js";
connect();
// custom created files
import constants from "./utils/constants.js";
import i18n from "./config/i18n.js";
import helper from "./utils/helper.js";
import express from "express";
import bodyParser from "body-parser";
import cron from "node-cron";
// API collection configuration section
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cors from "cors";
const swaggerDocument = YAML.load("./swagger.yaml");
const swaggerUserDocument = YAML.load("./user_swagger.yaml");
import appVersionModel from "./models/appVersion.model.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  return res
    .status(constants.CONST_RESP_CODE_OK)
    .send(i18n.__("lang_forbidden"));
});
process.env.TZ = "Europe/London";
app.use("/api-user", swaggerUi.serve, (...args) =>
  swaggerUi.setup(swaggerUserDocument)(...args)
);
cron.schedule("* * * * *", () => {
  helper.checkBoost();
});

cron.schedule("* * * * *", () => {
  helper.removeIgnoreProfile();
});
app.use("/api-admin", swaggerUi.serve, (...args) =>
  swaggerUi.setup(swaggerDocument)(...args)
);

app.use(async (req, res, next) => {
  // Store dummy data
  // seeders.executeSeeder();
  const headerContent = req.headers;
  const currentUrl = req.url;
  const urlMaster = constants.CONST_ALLOW_URL_WITHOUT_HEADER;
  if (!urlMaster.includes(currentUrl)) {
    if (
      headerContent.hasOwnProperty("accept-language") &&
      headerContent.hasOwnProperty("time-zone") &&
      headerContent.hasOwnProperty("device-type") &&
      headerContent.hasOwnProperty("device-token") &&
      headerContent.hasOwnProperty("version")
    ) {
      const acceptLanguage = headerContent["accept-language"];
      const languageMaster = constants.CONST_RESP_LANG_COLLECTION;
      if (languageMaster.includes(acceptLanguage)) {
        const currentLanguage = i18n.getLocale();
        if (!currentLanguage.includes(acceptLanguage)) {
          i18n.setLocale(acceptLanguage);
        }
        const deviceType = headerContent["device-type"];
        const deviceTypeMaster = constants.CONST_DEVICE_TYPES;
        if (deviceTypeMaster.includes(deviceType.toLowerCase())) {
          const version = headerContent["version"];
          let versionData = await appVersionModel.findOne({
          // Guard against missing versionData
          if (!versionData) {
            console.warn(`No versionData for device ${queryDevice}, skipping version check`);
            return next();
          }
            device: deviceType,
          });

          if (version >= versionData.version) {
            next();
          } else {
            return helper.returnFalseResponse(
              req,
              res,
              constants.CONST_RESP_CODE_UNAUTHORIZED,
              i18n.__("lang_version_updated"),
              {},
              460
            );
          }
        } else {
          return helper.returnFalseResponse(
            req,
            res,
            constants.CONST_RESP_CODE_UNAUTHORIZED,
            i18n.__("lang_invalid_device_type"),
            {}
          );
        }
      } else {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_UNAUTHORIZED,
          i18n.__("lang_invalid_header"),
          {}
        );
      }
    } else {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_UNAUTHORIZED,
        i18n.__("lang_invalid_header"),
        {}
      );
    }
  }
});

import adminRouter from "./modules/admin/router/index.js";
app.use("/v1/admin/", adminRouter);

import userRouter from "./modules/user/router/index.js";
import newcountryModel from "./models/newCountry.model.js";
import newcityModel from "./models/newCity.model.js";
app.use("/v1/user/", userRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({
    message: i18n.__("lang_endpoint_not_found_message"),
  });
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server run on: ${process.env.APP_PORT}`);
});
