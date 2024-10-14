import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";
import { userRegisterService } from "../../services";

const userChangePhoneSchema = Joi.object({
  phone: Joi.number().required().integer().messages({
    "any.required": "Phone field is required.",
    "number.base": "Phone field must contain only numbers.",
    "number.integer": "Phone field must contain only numbers.",
  }),
});

export const userChangePhoneValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await userChangePhoneSchema.validateAsync(req.body, { abortEarly: false });
    const isPhoneInUse = await checkUniquePhone(req);
    if (!isPhoneInUse) {
      return next();
    }

    const data = formatResponse(
      400,
      true,
      { phone: "The phone field must contain a unique value." },
      null
    );
    res.status(400).json(data);
    return;
  } catch (error: any) {
    const { details } = error;
    let errorObj = errorValidatorResponse(details);
    if (!errorObj.phone) {
      const isPhoneInUse = await checkUniquePhone(req);
      if (isPhoneInUse) {
        errorObj = {
          phone: "The phone field must contain a unique value.",
          ...errorObj,
        };
      }
    }

    const data = formatResponse(400, true, errorObj, null);
    res.status(400).json(data);
    return;
  }
};

const checkUniquePhone = async (req: Request) => {
  return await userRegisterService.checkUniquePhone(
    req.body.phone,
    req.decodedToken.data.id
  );
};
