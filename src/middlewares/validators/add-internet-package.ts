import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { MAX_DAY, MAX_KB, formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const internetPackageSchema = Joi.object({
  package_name: Joi.string().required().messages({
    "any.required": "Package name field is required.",
    "string.empty": "Package name field is required.",
  }),

  duration: Joi.number()
    .integer()
    .min(1)
    .max(MAX_DAY)
    .required()
    .messages({
      "any.required": "Duration field is required.",
      "number.base": "Duration field must contain only numbers.",
      "number.integer": "Duration field must contain only numbers.",
      "number.min": "Duration field must be at least 1 characters in length.",
      "number.max": `Duration field must be at least ${MAX_DAY} characters in length.`,
    }),

  volume: Joi.number()
    .integer()
    .min(1)
    .max(MAX_KB)
    .required()
    .messages({
      "any.required": "Volume field is required.",
      "number.base": "Volume field must contain only numbers.",
      "number.integer": "Volume field must contain only numbers.",
      "number.min": "Volume field must be at least 1 characters in length.",
      "number.max": `Volume field must be at least ${MAX_KB} characters in length.`,
    }),

  download_bandwidth: Joi.number()
    .integer()
    .min(0)
    .max(MAX_KB)
    .required()
    .messages({
      "any.required": "Download bandwidth field is required.",
      "number.base": "Download bandwidth field must contain only numbers.",
      "number.integer": "Download bandwidth field must contain only numbers.",
      "number.min":
        "Download bandwidth field must be at least 0 characters in length.",
      "number.max": `Download bandwidth field must be at least  ${MAX_KB} characters in length.`,
    }),

  upload_bandwidth: Joi.number()
    .integer()
    .min(0)
    .max(MAX_KB)
    .required()
    .messages({
      "any.required": "Upload bandwidth field is required.",
      "number.base": "Upload bandwidth field must contain only numbers.",
      "number.integer": "Upload bandwidth field must contain only numbers.",
      "number.min":
        "Upload bandwidth field must be at least 0 characters in length.",
      "number.max": `Upload bandwidth field must be at least  ${MAX_KB} characters in length.`,
    }),

  package_speed: Joi.string().required().messages({
    "any.required": "Package speed field is required.",
    "string.empty": "Package speed field is required.",
  }),
});

export const internetPackageValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = internetPackageSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const { details } = error;
    const data = formatResponse(
      400,
      false,
      errorValidatorResponse(details),
      null
    );
    res.status(400).json(data);
    return;
  }
  next();
};
