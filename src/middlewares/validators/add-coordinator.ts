import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";
import { coordinatorService } from "../../services";

const coordinatorSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email field is required.",
    "string.empty": "Email field is required.",
    "string.email": "Email address is not in format.",
  }),

  password: Joi.string().min(8).required().messages({
    "any.required": "Password field is required.",
    "string.empty": "Password field is required.",
    "string.min": "The password field must be at least 8 characters in length.",
  }),

  full_name: Joi.string().required().messages({
    "any.required": "Full name field is required.",
    "string.empty": "Full name field is required.",
  }),

  is_mess_management: Joi.number().integer().valid(0, 1).required().messages({
    "any.required": "The mess management field is required.",
    "any.only": "The mess management field must be one of:0 = NO,1 = Yes",
    "number.base": "The mess management field must be one of:0 = NO,1 = Yes",
    "number.integer":
      "The mess management field must be one of:0 = NO,1 = Yes.",
  }),

  is_water_management: Joi.number().integer().valid(0, 1).required().messages({
    "any.required": "The water management field is required.",
    "any.only": "The water management field must be one of:0 = NO,1 = Yes",
    "number.base": "The water management field must be one of:0 = NO,1 = Yes",
    "number.integer":
      "The water management field must be one of:0 = NO,1 = Yes.",
  }),

  is_internet_management: Joi.number()
    .integer()
    .valid(0, 1)
    .required()
    .messages({
      "any.required": "The internet management field is required.",
      "any.only": "The internet management field must be one of:0 = NO,1 = Yes",
      "number.base":
        "The internet management field must be one of:0 = NO,1 = Yes",
      "number.integer":
        "The internet management field must be one of:0 = NO,1 = Yes.",
    }),
});

export const coordinatorValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await coordinatorSchema.validateAsync(req.body, { abortEarly: false });

    const isEmailInUse = await checkUniqueEmail(req);
    if (!isEmailInUse) {
      return next();
    }
    const data = formatResponse(
      400,
      true,
      { email: "The email field must contain a unique value." },
      null
    );
    res.status(400).json(data);
    return;
  } catch (error: any) {
    const { details } = error;

    let errorObj = errorValidatorResponse(details);
    if (!errorObj.email) {
      const isEmailInUse = await checkUniqueEmail(req);
      if (isEmailInUse) {
        errorObj = {
          email: "The email field must contain a unique value.",
          ...errorObj,
        };
      }
    }

    const data = formatResponse(400, true, errorObj, null);
    res.status(400).json(data);
    return;
  }
};

const checkUniqueEmail = async (req: Request) => {
  return await coordinatorService.checkEmail(
    req.body.email,
    req.params && req.params.id ? req.params.id : undefined
  );
};
