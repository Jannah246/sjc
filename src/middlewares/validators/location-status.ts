import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const locationStatusSchema = Joi.object({
  location_status: Joi.number().integer().required().valid(1, 2, 3).messages({
    "any.required": "The location status field is required.",
    "any.only": "The location status field must be one of: 1,2,3.",
    "number.base": "The location status field must be one of: 1,2,3.",
    "number.integer": "The location status field must be one of: 1,2,3.",
  }),
});

export const locationStatusValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = locationStatusSchema.validate(req.query, {
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
