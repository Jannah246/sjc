import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const posRechargeManualSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "any.required": "User id is required.",
    "string.empty": "User id is required.",
  }),
  recharge_amount: Joi.number().min(1).required().messages({
    "any.required": "The recharge amount field is required.",
    "number.base": "The recharge amount must contain only numeric value.",
    "number.min": "The recharge amount must be greater than or equal to 1.",
  }),
  service_amount: Joi.number().min(0).required().messages({
    "any.required": "The service amount field is required.",
    "number.base": "The service amount must contain only numeric value.",
    "number.min": "The service amount must be greater than or equal to 0.",
  }),
  profile_camp_id: Joi.string().required().messages({
    "any.required": "Camp id is required.",
    "string.empty": "Camp id is required.",
  }),
});

export const posRechargeManualValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = posRechargeManualSchema.validate(req.body, {
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
