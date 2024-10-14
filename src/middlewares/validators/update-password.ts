import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const updatePasswordSchema = Joi.object({
  current_password: Joi.string().min(8).required().messages({
    "any.required": "Current password is required.",
    "string.min":
      "The current_password field must be at least 8 characters in length.",
  }),
  new_password: Joi.string().min(8).required().messages({
    "any.required": "New Password is required.",
    "string.min":
      "The new_password field must be at least 8 characters in length.",
  }),
  confirm_password: Joi.string()
    .valid(Joi.ref("new_password"))
    .min(8)
    .required()
    .messages({
      "any.required": "Confirm Password is required.",
      "string.min":
        "The confirm_password field must be at least 8 characters in length.",
      "any.only":
        "The confirm password field does not match the new password field.",
    }),
});

export const updatePasswordValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = updatePasswordSchema.validate(req.body, {
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
