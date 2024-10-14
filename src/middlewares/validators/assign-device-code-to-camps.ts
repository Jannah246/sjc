import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const assignDeviceCodeToCampsSchema = Joi.object({
  pos_device_code: Joi.string().required().messages({
    "any.required": "Pos device code is required.",
    "string.empty": "Pos device code is required.",
  }),
  camp_ids: Joi.string().required().messages({
    "any.required": "camp ids is required.",
    "string.empty": "camp ids is required.",
  }),
});

export const assignDeviceCodeToCampsValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await assignDeviceCodeToCampsSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    const error = await checkDeviceCodeArr(req);
    if (!error) {
      return next();
    }

    const data = formatResponse(400, true, { camp_ids: error }, null);
    res.status(400).json(data);
    return;
  } catch (error: any) {
    const { details } = error;
    let errorObj = errorValidatorResponse(details);
    if (!errorObj.camp_ids) {
      const error = await checkDeviceCodeArr(req);
      if (error) {
        errorObj = { ...errorObj, camp_ids: error };
      }
    }

    const data = formatResponse(400, true, errorObj, null);
    res.status(400).json(data);
    return;
  }
};

const checkDeviceCodeArr = async (req: Request) => {
  const regularExpression = new RegExp("^[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*$");
  if (!regularExpression.test(req.body.camp_ids)) {
    return "Camp ids required with out space and comma separated values";
  }

  return "";
};
