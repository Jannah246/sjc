import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";
import { campService } from "../../services";

const addCampSchema = Joi.object({
  camp_name: Joi.string().required().messages({
    "any.required": "Camp name is required.",
  }),

  camp_address: Joi.string().required().messages({
    "any.required": "Camp address is required.",
  }),

  camp_city: Joi.string().required().messages({
    "any.required": "Camp city is required.",
  }),

  router_primary_ip: Joi.string().required().messages({
    "any.required": "Router primary ip is required.",
  }),

  no_of_allowed_user: Joi.number().integer().required().messages({
    "any.required": "The number of allowed user field is required.",
    "number.base": "The  number of allowed field must contain only numbers.",
    "number.integer":
      "The  number of allowed user field must contain only numbers.",
  }),

  no_of_allowed_kiosk: Joi.number().integer().required().messages({
    "any.required": "The number of allowed kiosk field is required.",
    "number.base":
      "The  number of allowed kiosk field must contain only numbers.",
    "number.integer":
      "The number of allowed kiosk field must contain only numbers.",
  }),

  no_of_allowed_account: Joi.number().integer().required().messages({
    "any.required": "The number of allowed account field is required.",
    "number.base":
      "The number of allowed account field must contain only numbers.",
    "number.integer":
      "The number of allowed account field must contain only numbers.",
  }),

  no_of_allowed_coordinators: Joi.number().integer().required().messages({
    "any.required": "The number of allowed coordinator field is required.",
    "number.base":
      "The number of allowed coordinator field must contain only numbers.",
    "number.integer":
      "The number of allowed coordinator field must contain only numbers.",
  }),

  is_allowed_package_meal: Joi.number()
    .integer()
    .valid(0, 1)
    .required()
    .messages({
      "any.required": "The allowed package meal field is required.",
      "any.only":
        "The allowed package meal field must be one of:0 = NO,1 = Yes",
      "number.base":
        "The allowed package meal field must be one of:0 = NO,1 = Yes",
      "number.integer":
        "The allowed package meal field must be one of:0 = NO,1 = Yes.",
    }),

  is_allowed_package_water: Joi.number()
    .integer()
    .valid(0, 1)
    .required()
    .messages({
      "any.required": "The  allowed package water field is required.",
      "any.only":
        "The  allowed package water field must be one of:0 = NO,1 = Yes",
      "number.base":
        "The  allowed package water field must be one of:0 = NO,1 = Yes",
      "number.integer":
        "The is allowed package water field must be one of:0 = NO,1 = Yes.",
    }),

  is_allowed_package_internet: Joi.number()
    .integer()
    .valid(0, 1)
    .required()
    .messages({
      "any.required": "The  allowed package internet field is required.",
      "any.only":
        "The allowed package internet field must be one of:0 = NO,1 = Yes",
      "number.base":
        "The allowed package internet field must be one of:0 = NO,1 = Yes",
      "number.integer":
        "The allowed package internet field must be one of:0 = NO,1 = Yes.",
    }),

  site: Joi.string().valid("global", "local").required().messages({
    "any.required": "The site field is required.",
    "any.only": "The site field must be one of: global,local.",
  }),

  router_mac_address: Joi.string().required().messages({
    "any.required": "router mack address is required.",
  }),

  router_ssid: Joi.string().messages({
    "string.base": "router ssid must be string.",
  }),
  router_secondary_ip: Joi.string().messages({
    "string.base": "router secondary ip must be string.",
  }),
  router_pass: Joi.string().messages({
    "string.base": "router password must be string.",
  }),
  router_secret: Joi.string().messages({
    "string.base": "router secret must be string.",
  }),
  router_alias: Joi.string().messages({
    "string.base": "router alias must be string.",
  }),
  router_hostname: Joi.string().messages({
    "string.base": "router hostname must be string.",
  }),
  camp_uuid: Joi.string().messages({
    "string.base": "camp uuid must be string.",
  }),
});

export const campValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await addCampSchema.validateAsync(req.body, { abortEarly: false });
    const isCampNameInUse = await checkUniqueCampName(req);
    if (!isCampNameInUse) {
      return next();
    }

    const data = formatResponse(
      400,
      true,
      { camp_name: "The camp_name field must contain a unique value." },
      null
    );
    res.status(400).json(data);
    return;
  } catch (error: any) {
    const { details } = error;
    let errorObj = errorValidatorResponse(details);
    if (!errorObj.camp_name) {
      const isCampNameInUse = await checkUniqueCampName(req);
      if (isCampNameInUse) {
        errorObj = {
          camp_name: "The camp_name field must contain a unique value.",
          ...errorObj,
        };
      }
    }

    const data = formatResponse(400, true, errorObj, null);
    res.status(400).json(data);
    return;
  }
};

const checkUniqueCampName = async (req: Request) => {
  return await campService.checkCampName(
    req.body.camp_name,
    req.params && req.params.id ? req.params.id : undefined
  );
};
