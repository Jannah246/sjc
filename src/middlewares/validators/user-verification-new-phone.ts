import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";
import { userRegisterService } from "../../services";

const userVerificationNewPhoneSchema = Joi.object({
  phone: Joi.number().required().integer().messages({
    "any.required": "Phone field is required.",
    "number.base": "Phone field must contain only numbers.",
    "number.integer": "Phone field must contain only numbers.",
  }),

  otp: Joi.number().required().integer().messages({
    "any.required": "Otp field is required.",
    "number.base": "Otp field must contain only numbers.",
    "number.integer": "Otp field must contain only numbers.",
  }),
});

export const userVerificationNewPhoneValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = userVerificationNewPhoneSchema.validate(req.body, {
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
