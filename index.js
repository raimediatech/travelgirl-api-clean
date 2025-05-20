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

import appVersionModel from "./models/appVersion.model.js";

// load swagger docs
const swaggerDocument = YAML.load("./swagger.yaml");
const swaggerUserDocument = YAML.load("./user_swagger.yaml");

const app = express();
// Enhanced CORS configuration with explicit headers for iOS compatibility
// Enhanced CORS configuration with explicit headers for iOS compatibility
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language', 'Time-Zone', 'Device-Type', 'Device-Token', 'Version'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  credentials: true
}));

// Handle OPTIONS requests explicitly for iOS
app.options('*', cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language', 'Time-Zone', 'Device-Type', 'Device-Token', 'Version'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  credentials: true
}));

// Handle OPTIONS requests explicitly for iOS
app.options('*', cors());
app.use(bodyParser.json());

// root health check
app.get("/", async (req, res) => {
  return res
    .status(constants.CONST_RESP_CODE_OK)
    .send(i18n.__("lang_forbidden"));
});

// timezone
process.env.TZ = "Europe/London";

// swagger routes
app.use("/api-user", swaggerUi.serve, swaggerUi.setup(swaggerUserDocument));
app.use("/api-admin", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// scheduled tasks
cron.schedule("* * * * *", () => helper.checkBoost());
cron.schedule("* * * * *", () => helper.removeIgnoreProfile());

// version & header validation middleware
app.use(async (req, res, next) => {
  const headerContent = req.headers;
  const currentUrl = req.url;
  const urlMaster = constants.CONST_ALLOW_URL_WITHOUT_HEADER;

  if (urlMaster.includes(currentUrl)) {
    return next();
  }

  const required = [
    "accept-language",
    "time-zone",
    "device-type",
    "device-token",
    "version",
  ];
  const hasAll = required.every((h) => headerContent.hasOwnProperty(h));
  if (!hasAll) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_UNAUTHORIZED,
      i18n.__("lang_invalid_header"),
      {}
    );
  }

  // language handling
  const acceptLanguage = headerContent["accept-language"];
  if (!constants.CONST_RESP_LANG_COLLECTION.includes(acceptLanguage)) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_UNAUTHORIZED,
      i18n.__("lang_invalid_header"),
      {}
    );
  }
  if (i18n.getLocale() !== acceptLanguage) {
    i18n.setLocale(acceptLanguage);
  }

  // device-type handling
  const deviceType = headerContent["device-type"];
  if (
    !constants.CONST_DEVICE_TYPES.includes(deviceType.toLowerCase())
  ) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_UNAUTHORIZED,
      i18n.__("lang_invalid_device_type"),
      {}
    );
  }
  const queryDevice = deviceType.toLowerCase();

  // version check
  const version = headerContent["version"];
  let versionData;
  try {
    versionData = await appVersionModel.findOne({
      device: { $regex: `^${queryDevice}$`, $options: "i" },
    });
  } catch (e) {
    console.error("Version lookup error:", e);
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_UNAUTHORIZED,
      i18n.__("lang_invalid_header"),
      {}
    );
  }

  // Guard against missing record
  if (!versionData) {
    console.warn(
      `No versionData for device ${queryDevice}, skipping version check`
    );
    return next();
  }

  // enforce version
  if (version < versionData.version) {
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

// your routers
import adminRouter from "./modules/admin/router/index.js";
app.use("/v1/admin/", adminRouter);

import userRouter from "./modules/user/router/index.js";
app.use("/v1/user/", userRouter);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: i18n.__("lang_endpoint_not_found_message"),
  });
});

// start server
app.listen(process.env.APP_PORT, () => {
  console.log(`Server run on: ${process.env.APP_PORT}`);
});
