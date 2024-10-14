import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const internetPackageClientSchema = Joi.object({
  internet_package_id: Joi.string().required().messages({
    "any.required": "Internet package id field is required.",
    "string.empty": "Internet package id field is required.",
  }),

  package_name: Joi.string().required().messages({
    "any.required": "Package name field is required.",
    "string.empty": "Package name field is required.",
  }),

  package_speed: Joi.string().required().messages({
    "any.required": "Package speed field is required.",
    "string.empty": "Package speed field is required.",
  }),

  package_price: Joi.number().required().messages({
    "any.required": "Package price field is required.",
    "string.empty": "Package price field is required.",
    "number.base": "Package price field must contain only numbers.",
  }),
});

export const internetPackageClientValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = internetPackageClientSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const { details } = error;
    const data = formatResponse(
      400,
      true,
      errorValidatorResponse(details),
      null
    );
    res.status(400).json(data);
    return;
  }
  next();
};
