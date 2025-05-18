import dotenv from "dotenv";
dotenv.config();

// Database connection
import connect from "./utils/dbConnection.js";
connect();

// Custom utilities
import constants from "./utils/constants.js";
import i18n from "./config/i18n.js";
import helper from "./utils/helper.js";

import express from "express";
import bodyParser from "body-parser";
import cron from "node-cron";
import semver from "semver";                                  // ← added import

// API docs
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cors from "cors";
const swaggerDocument = YAML.load("./swagger.yaml");
const swaggerUserDocument = YAML.load("./user_swagger.yaml");

import appVersionModel from "./models/appVersion.model.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Health check / forbidden root
app.get("/", async (req, res) => {
  return res
    .status(constants.CONST_RESP_CODE_OK)
    .send(i18n.__("lang_forbidden"));
});

// Set timezone for cron jobs
process.env.TZ = "Europe/London";

// Swagger UI
app.use(
  "/api-user",
  swaggerUi.serve,
  (...args) => swaggerUi.setup(swaggerUserDocument)(...args)
);
cron.schedule("* * * * *", () => helper.checkBoost());
cron.schedule("* * * * *", () => helper.removeIgnoreProfile());
app.use(
  "/api-admin",
  swaggerUi.serve,
  (...args) => swaggerUi.setup(swaggerDocument)(...args)
);

// Version-check & header validation middleware
app.use(async (req, res, next) => {
  const headers = req.headers;
  const url = req.url;
  const allowList = constants.CONST_ALLOW_URL_WITHOUT_HEADER;

  if (allowList.includes(url)) {
    return next();
  }

  // Required headers
  const required = [
    "accept-language",
    "time-zone",
    "device-type",
    "device-token",
    "version",
  ];
  const hasAll = required.every((h) => headers.hasOwnProperty(h));
  if (!hasAll) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_UNAUTHORIZED,
      i18n.__("lang_invalid_header"),
      {}
    );
  }

  // Language
  const lang = headers["accept-language"];
  if (!constants.CONST_RESP_LANG_COLLECTION.includes(lang)) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_UNAUTHORIZED,
      i18n.__("lang_invalid_header"),
      {}
    );
  }
  if (i18n.getLocale() !== lang) {
    i18n.setLocale(lang);
  }

  // Device type
  const deviceType = headers["device-type"];
  const queryDevice = deviceType.toLowerCase();
  if (!constants.CONST_DEVICE_TYPES.includes(queryDevice)) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_UNAUTHORIZED,
      i18n.__("lang_invalid_device_type"),
      {}
    );
  }

  // Version check
  const clientVersion = headers["version"];
  let versionData = await appVersionModel.findOne({
    device: { $regex: `^${queryDevice}$`, $options: "i" },
  });
  if (!versionData) {
    console.warn(
      `No versionData for device ${queryDevice}, skipping version check`
    );
    return next();
  }

  const backendVer = semver.coerce(versionData.version);
  const clientVer = semver.coerce(clientVersion);
  if (clientVer && backendVer.major > clientVer.major) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_UNAUTHORIZED,
      i18n.__("lang_version_updated"),
      {},
      460
    );
  }

  next();
});

// Admin routes
import adminRouter from "./modules/admin/router/index.js";
app.use("/v1/admin/", adminRouter);

// User routes
import userRouter from "./modules/user/router/index.js";
app.use("/v1/user/", userRouter);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({
    message: i18n.__("lang_endpoint_not_found_message"),
  });
});

// Start server
const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => console.log(`Server run on: ${PORT}`));
