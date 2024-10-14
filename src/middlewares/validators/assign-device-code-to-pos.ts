import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const assignDeviceCodeToPosSchema = Joi.object({
  pos_device_codes: Joi.string().required().messages({
    "any.required": "Pos device codes is required.",
    "string.empty": "Pos device codes is required.",
  }),
  pos_id: Joi.string().required().messages({
    "any.required": "pos id is required.",
    "string.empty": "pos id is required.",
  }),
});

export const assignDeviceCodeToPosValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await assignDeviceCodeToPosSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    const error = await checkDeviceCodeArr(req);
    if (!error) {
      return next();
    }

    const data = formatResponse(400, true, { pos_device_codes: error }, null);
    res.status(400).json(data);
    return;
  } catch (error: any) {
    const { details } = error;
    let errorObj = errorValidatorResponse(details);
    if (!errorObj.pos_device_codes) {
      const error = await checkDeviceCodeArr(req);
      if (error) {
        errorObj = { pos_device_codes: error, ...errorObj };
      }
    }

    const data = formatResponse(400, true, errorObj, null);
    res.status(400).json(data);
    return;
  }
};

const checkDeviceCodeArr = async (req: Request) => {
  const regularExpression = new RegExp("^[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*$");
  if (!regularExpression.test(req.body.pos_device_codes)) {
    return "Device code ids required with out space and comma separated values";
  }

  return "";
};
