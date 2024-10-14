import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const deviceCodeSchema = Joi.object({
  client_id: Joi.string().required().messages({
    "any.required": "client_id is required.",
  }),
  no_of_code: Joi.number().integer().required().messages({
    "any.required": "The number of code field is required.",
    "number.base": "The number of code field must contain only numbers.",
    "number.integer": "The number of code field must contain only numbers.",
  }),
});

export const addDeviceCodeValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = deviceCodeSchema.validate(req.body, { abortEarly: false });
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
