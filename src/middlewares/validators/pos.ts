import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { Message, formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";
import { posService } from "../../services";
import { Obj } from "../../types/interfaces";

const addCampSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "any.required": "Email is required.",
    "string.email": "Email address is not in format.",
  }),
  password: Joi.string().min(8).required().messages({
    "any.required": "Password is required.",
    "string.min": "The password field must be at least 8 characters in length.",
  }),

  full_name: Joi.string().required().messages({
    "any.required": "Full Name is required.",
  }),

  ip_mac: Joi.string().required().messages({
    "any.required": "Ip mac is required.",
  }),
});

export const posValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await addCampSchema.validateAsync(req.body, { abortEarly: false });
    const emailInUse = await checkEmail(req);
    const ipInUse = await checkIp(req);
    if (!emailInUse && !ipInUse) {
      return next();
    }

    const err: Obj = {};
    if (emailInUse) {
      err.email = Message.EMAIL_UNIQUE;
    }
    if (ipInUse) {
      err.ip_mac = "The ip mac field must contain a unique value.";
    }

    const data = formatResponse(400, true, err, null);
    res.status(400).json(data);
    return;
  } catch (error: any) {
    const { details } = error;
    let errorObj = errorValidatorResponse(details);
    if (!errorObj.email) {
      const emailInUse = await checkEmail(req);
      if (emailInUse) {
        errorObj = { email: Message.EMAIL_UNIQUE, ...errorObj };
      }
    }
    if (!errorObj.ip_mac) {
      const ipInUse = await checkIp(req);
      if (ipInUse) {
        errorObj = {
          ...errorObj,
          ip_mac: "The ip mac field must contain a unique value.",
        };
      }
    }

    const data = formatResponse(400, true, errorObj, null);
    res.status(400).json(data);
    return;
  }
};

const checkEmail = async (req: Request) => {
  return await posService.checkEmail(
    req.body.email,
    req.params && req.params.id ? req.params.id : undefined
  );
};
const checkIp = async (req: Request) => {
  return await posService.checkIp(
    req.body.ip_mac,
    req.params && req.params.id ? req.params.id : undefined
  );
};
