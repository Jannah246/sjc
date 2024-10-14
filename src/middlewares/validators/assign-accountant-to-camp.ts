import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const assignAccountantsToCampSchema = Joi.object({
  camp_id: Joi.string().required().messages({
    "any.required": "camp id is required.",
    "string.empty": "camp id is required.",
  }),

  accountants: Joi.string().required().messages({
    "any.required": "Account ids is required.",
    "string.empty": "Account ids is required.",
  }),
});

export const assignAccountantToCampValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await assignAccountantsToCampSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    const error = await checkDeviceCodeArr(req);
    if (!error) {
      return next();
    }

    const data = formatResponse(400, true, { accountants: error }, null);
    res.status(400).json(data);
    return;
  } catch (error: any) {
    const { details } = error;
    let errorObj = errorValidatorResponse(details);
    if (!errorObj.accountants) {
      const error = await checkDeviceCodeArr(req);
      if (error) {
        errorObj = { ...errorObj, accountants: error };
      }
    }

    const data = formatResponse(400, true, errorObj, null);
    res.status(400).json(data);
    return;
  }
};

const checkDeviceCodeArr = async (req: Request) => {
  const regularExpression = new RegExp("^[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*$");
  if (!regularExpression.test(req.body.accountants)) {
    return "Accountant ids required with out space and comma separated values";
  }

  return "";
};
