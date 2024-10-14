import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const posInternetOrderSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "any.required": "User id is required.",
    "string.empty": "User id is required.",
  }),
  package_id: Joi.string().required().messages({
    "any.required": "Package id is required.",
    "string.empty": "Package id is required.",
  }),
  profile_camp_id: Joi.string().required().messages({
    "any.required": "Camp id is required.",
    "string.empty": "Camp id is required.",
  }),
});

export const posInternetOrderValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = posInternetOrderSchema.validate(req.body, {
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
