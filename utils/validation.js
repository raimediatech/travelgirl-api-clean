import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
import helper from "./helper.js";
import constants from "./constants.js";

const joiPassword = Joi.extend(joiPasswordExtendCore);
let message =
  "Password Should be at least 8 characters long and includes at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character. Avoid using spaces.";
let joiSignUpValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.pattern.base":
          "The first name should consist of only alphabetic characters.",
      }),
    lastName: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.pattern.base":
          "The last name should consist of only alphabetic characters.",
      }),

    email: Joi.string().email().lowercase().required(),
    phoneNumber: Joi.string()
      .allow("", null)
      .pattern(/^[0-9]{10}$/)
      .optional()
      .messages({
        "string.pattern.base": "Phone digit must be a 10-digit numeric value",
      }),
    flag: Joi.string().optional(),
    cityName: Joi.string().allow(null, "").optional(),
    profilePercentage: Joi.number().required(),
    uuid: Joi.string().allow(null, "").optional(),
    gender: Joi.number().required(),
    city: Joi.string()
      .length(24)
      .optional()
      .hex()
      .regex(/^[a-fA-F0-9]+$/)
      .allow(null, ""),
    country: Joi.string()
      .length(24)
      .required()
      .hex()
      .regex(/^[a-fA-F0-9]+$/),

    dob: Joi.string().required(),
    cityName: Joi.string().optional(),
    countryName: Joi.string().optional(),
    password: joiPassword
      .string()
      .messages({
        "string.empty": message,
      })
      .minOfLowercase(1)
      .messages({
        "password.minOfLowercase": message,
      })
      .minOfNumeric(1)
      .messages({
        "password.minOfNumeric": message,
      })
      .minOfUppercase(1)
      .messages({
        "password.minOfUppercase": message,
      })
      .minOfSpecialCharacters(1)
      .messages({
        "password.minOfSpecialCharacters": message,
      })
      .noWhiteSpaces()
      .messages({
        "password.noWhiteSpaces": message,
      })
      .min(8)
      .messages({
        "string.min": message,
      })
      .required()
      .messages({
        "any.required": message,
      }),

    confirmPassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Password and confirm password not matched" }),

    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiSocialSignUpValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.pattern.base":
          "The first name should consist of only alphabetic characters.",
      }),
    lastName: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.pattern.base":
          "The last name should consist of only alphabetic characters.",
      }),

    email: Joi.string().email().lowercase().required(),
    phoneNumber: Joi.string()
      .allow("", null)
      .pattern(/^[0-9]{10}$/)
      .optional()
      .messages({
        "string.pattern.base": "Phone digit must be a 10-digit numeric value",
      }),
    cityName: Joi.string().allow(null, "").optional(),
    profilePercentage: Joi.number().required(),
    uuid: Joi.string().allow(null, "").optional(),
    gender: Joi.number().required(),
    city: Joi.string()
      .length(24)
      .optional()
      .hex()
      .regex(/^[a-fA-F0-9]+$/)
      .allow(null, ""),
    country: Joi.string()
      .length(24)
      .required()
      .hex()
      .regex(/^[a-fA-F0-9]+$/),

    dob: Joi.string().required(),
    cityName: Joi.string().optional(),
    countryName: Joi.string().optional(),
    flag:Joi.string().optional(),

    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};


let joiLoginValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: joiPassword
      .string()
      .messages({
        "string.empty": message,
      })
      .minOfLowercase(1)
      .messages({
        "password.minOfLowercase": message,
      })
      .minOfNumeric(1)
      .messages({
        "password.minOfNumeric": message,
      })
      .minOfUppercase(1)
      .messages({
        "password.minOfUppercase": message,
      })
      .minOfSpecialCharacters(1)
      .messages({
        "password.minOfSpecialCharacters": message,
      })
      .noWhiteSpaces()
      .messages({
        "password.noWhiteSpaces": message,
      })
      .min(8)
      .messages({
        "string.min": message,
      })
      .required(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiChangePasswordValidator = async (req, res, next) => {
  const schema = Joi.object({
    oldPassword: joiPassword
      .string()
      .messages({
        "string.empty": message,
      })
      .minOfLowercase(1)
      .messages({
        "password.minOfLowercase": message,
      })
      .minOfNumeric(1)
      .messages({
        "password.minOfNumeric": message,
      })
      .minOfUppercase(1)
      .messages({
        "password.minOfUppercase": message,
      })
      .minOfSpecialCharacters(1)
      .messages({
        "password.minOfSpecialCharacters": message,
      })
      .noWhiteSpaces()
      .messages({
        "password.noWhiteSpaces": message,
      })
      .min(8)
      .messages({
        "string.min": message,
      })
      .required(),

    newPassword: joiPassword
      .string()
      .messages({
        "string.empty": message,
      })
      .minOfLowercase(1)
      .messages({
        "password.minOfLowercase": message,
      })
      .minOfNumeric(1)
      .messages({
        "password.minOfNumeric": message,
      })
      .minOfUppercase(1)
      .messages({
        "password.minOfUppercase": message,
      })
      .minOfSpecialCharacters(1)
      .messages({
        "password.minOfSpecialCharacters": message,
      })
      .noWhiteSpaces()
      .messages({
        "password.noWhiteSpaces": message,
      })
      .min(8)
      .messages({
        "string.min": message,
      })
      .required(),
    confirmPassword: Joi.any()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "Password and confirm password not matched",
      }),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiResendOtpValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });
  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

const joiVerifyOtpValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    otp: Joi.number().required(),
    email: Joi.string().email().lowercase().required(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });
  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiStaticContentUpdateValidator = async (req, res, next) => {
  const schema = Joi.object({
    slug: Joi.string().lowercase().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiStaticPageValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().required(),
  });
  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });
  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiForgotPasswordResetValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: joiPassword
      .string()
      .messages({
        "string.empty": message,
      })
      .minOfLowercase(1)
      .messages({
        "password.minOfLowercase": message,
      })
      .minOfNumeric(1)
      .messages({
        "password.minOfNumeric": message,
      })
      .minOfUppercase(1)
      .messages({
        "password.minOfUppercase": message,
      })
      .minOfSpecialCharacters(1)
      .messages({
        "password.minOfSpecialCharacters": message,
      })
      .noWhiteSpaces()
      .messages({
        "password.noWhiteSpaces": message,
      })
      .min(8)
      .messages({
        "string.min": message,
      })
      .required(),
    confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
      "any.only": "Password and confirm password not matched",
    }),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });
  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);

    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiAddSubscriptionValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    userId: Joi.string()
      .length(24)
      .hex()
      .regex(/^[a-fA-F0-9]+$/)
      .required(),
    productId: Joi.string().required(),
    response: Joi.string().required(),
    amount: Joi.number().required(),
    paymentType: Joi.string().required(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });
  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiAddDetailValidator = async (req, res, next) => {
  const body = req.body;

  const schema = Joi.object({
    language: Joi.array().optional(),
    interest: Joi.array().optional(),
    socialMediaLink: Joi.array().optional(),
    bodyType: Joi.string()
      .length(24)
      .hex()
      .regex(/^[a-fA-F0-9]+$/)
      .optional(),
    eyeType: Joi.string()
      .length(24)
      .hex()
      .regex(/^[a-fA-F0-9]+$/)
      .optional(),
    user_info: Joi.object().optional(),
    hairType: Joi.string()
      .length(24)
      .hex()
      .regex(/^[a-fA-F0-9]+$/)
      .optional(),

    cityPreferences: Joi.array().optional(),
    profilePercentage: Joi.number().optional(),
    countryPreferences: Joi.array().optional(),
    travelPreferences: Joi.array().optional(),
    about: Joi.string().optional(),
    userId: Joi.string()
      .length(24)
      .hex()
      .regex(/^[a-fA-F0-9]+$/)
      .required(),
    height: Joi.number().min(100).max(200).optional().messages({
      "number.min": "Height must be at least 100 cm",
      "number.max": "Height must not exceed 200 cm",
    }),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

const joiMatchIgnoreValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    matchId: Joi.string()
      .length(24)
      .required()
      .hex()
      .regex(/^[a-fA-F0-9]+$/),
    user_info: Joi.object().optional(),
  });
  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });
  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiReportMatchValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    matchId: Joi.string()
      .length(24)
      .hex()
      .regex(/^[a-fA-F0-9]+$/)
      .required(),
    reason: Joi.string().optional(),
    reportId: Joi.string()
      .length(24)
      .hex()
      .regex(/^[a-fA-F0-9]+$/)
      .required(),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

const joiUpdateFooterValidation = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    footerEmail: Joi.string().email().lowercase().optional(),
    facebookUrl: Joi.string().optional(),
    instagramUrl: Joi.string().optional(),
    tikTokUrl: Joi.string().optional(),
    linkedinUrl: Joi.string().optional(),
    contactNumber: Joi.string().optional(),
    description: Joi.string().optional(),
    needHelp: Joi.string().optional(),
    user_info: Joi.object().optional(),
  });
  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });
  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiCreateTripValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    description: Joi.string().required(),
    numberOfUsers: Joi.number().required(),
    tripType: Joi.string()
      .valid(constants.CONST_TRIP_GROUP, constants.CONST_TRIP_SOLO)
      .required(),
    address: Joi.string().optional(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    flag: Joi.string().optional(),
    user_info: Joi.object().optional(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiBlockUserValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    status: Joi.string()
      .valid(constants.CONST_STATUS_UNBLOCK, constants.CONST_STATUS_BLOCK)
      .required(),
    blockTo: Joi.string()
      .length(24)
      .hex()
      .regex(/^[a-fA-F0-9]+$/)
      .required(),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiUpdateProfileValidator = async (req, res, next) => {
  const body = req.body;

  const schema = Joi.object({
    boost: Joi.boolean().optional(),
    cityName: Joi.string().optional(),
    countryName: Joi.string().optional(),
    profilePercentage: Joi.number().optional(),
    firstName: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .messages({
        "string.pattern.base":
          "The first name should consist of only alphabetic characters.",
      }),
    lastName: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .messages({
        "string.pattern.base":
          "The last name should consist of only alphabetic characters.",
      }),
    phoneNumber: Joi.string()
      .allow("", null)
      .pattern(/^[0-9]{10}$/)
      .optional()
      .messages({
        "string.pattern.base": "Phone digit must be a 10-digit numeric value",
      }),
    cityName: Joi.string().allow(null, "").optional(),
    gender: Joi.number().optional(),
    city: Joi.string()
      .length(24)
      .optional()
      .hex()
      .regex(/^[a-fA-F0-9]+$/)
      .allow(null, ""),
    country: Joi.string()
      .length(24)
      .optional()
      .hex()
      .regex(/^[a-fA-F0-9]+$/),

    dob: Joi.string().optional(),
    language: Joi.array().optional(),
    interest: Joi.array().optional(),
    socialMediaLink: Joi.array().optional(),
    bodyType: Joi.string()
      .length(24)
      .hex()
      .regex(/^[a-fA-F0-9]+$/)
      .optional(),
    eyeType: Joi.string()
      .length(24)
      .hex()
      .regex(/^[a-fA-F0-9]+$/)
      .optional(),
    user_info: Joi.object().optional(),
    hairType: Joi.string()
      .length(24)
      .hex()
      .regex(/^[a-fA-F0-9]+$/)
      .optional(),

    cityPreferences: Joi.array().optional(),
    countryPreferences: Joi.array().optional(),
    travelPreferences: Joi.array().optional(),
    about: Joi.string().optional(),
    user_info: Joi.object().optional(),
    flag: Joi.string().optional(),
    height: Joi.number().min(100).max(200).optional().messages({
      "number.min": "Height must be at least 100 cm",
      "number.max": "Height must not exceed 200 cm",
    }),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiAddInterestValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    name: Joi.string().required(),
    icon: Joi.string().optional(),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiUpdateInterestValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    name: Joi.string().optional(),
    icon: Joi.string().optional(),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiAddHairTypeValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    hairType: Joi.string().required(),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiUpdateHairTypeValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    hairType: Joi.string().optional(),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiAddEyeTypeValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    eyeType: Joi.string().required(),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiUpdateEyeTypeValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    eyeType: Joi.string().optional(),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiAddBodyTypeValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    bodyType: Joi.string().required(),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiUpdateBodyTypeValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    bodyType: Joi.string().optional(),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

const joiAddCityValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    countryId: Joi.string().required(),
    name: Joi.string().required(),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });
  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiAddLanguageValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    language: Joi.string().required(),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiAddTravelPreferenceValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    preference: Joi.string().required(),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiUpdateLatLongValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let commonValidator = {
  joiSignUpValidator: joiSignUpValidator,
  joiLoginValidator: joiLoginValidator,
  joiChangePasswordValidator: joiChangePasswordValidator,
  joiVerifyOtpValidator: joiVerifyOtpValidator,
  joiResendOtpValidator: joiResendOtpValidator,
  joiStaticContentUpdateValidator: joiStaticContentUpdateValidator,
  joiStaticPageValidator: joiStaticPageValidator,
  joiForgotPasswordResetValidator: joiForgotPasswordResetValidator,
  joiAddSubscriptionValidator: joiAddSubscriptionValidator,
  joiAddDetailValidator: joiAddDetailValidator,

  joiReportMatchValidator: joiReportMatchValidator,
  joiMatchIgnoreValidator: joiMatchIgnoreValidator,
  joiUpdateFooterValidation: joiUpdateFooterValidation,
  joiCreateTripValidator: joiCreateTripValidator,
  joiBlockUserValidator: joiBlockUserValidator,
  joiUpdateProfileValidator: joiUpdateProfileValidator,
  joiAddInterestValidator: joiAddInterestValidator,
  joiUpdateInterestValidator: joiUpdateInterestValidator,
  joiAddHairTypeValidator: joiAddHairTypeValidator,
  joiUpdateHairTypeValidator: joiUpdateHairTypeValidator,
  joiAddEyeTypeValidator: joiAddEyeTypeValidator,
  joiUpdateEyeTypeValidator: joiUpdateEyeTypeValidator,
  joiAddBodyTypeValidator: joiAddBodyTypeValidator,
  joiUpdateBodyTypeValidator: joiUpdateBodyTypeValidator,
  joiAddCityValidator: joiAddCityValidator,
  joiAddLanguageValidator: joiAddLanguageValidator,
  joiAddTravelPreferenceValidator: joiAddTravelPreferenceValidator,
  joiUpdateLatLongValidator: joiUpdateLatLongValidator,
  joiSocialSignUpValidator:joiSocialSignUpValidator
};

export default commonValidator;
