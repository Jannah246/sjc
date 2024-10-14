import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const deviceHistorySchema = Joi.object({
  pos_device_code: Joi.string().required().messages({
    "any.required": "Pos device code is required.",
  }),

  device_name: Joi.string().required().messages({
    "any.required": "Pos device name is required.",
  }),

  device_model: Joi.string().required().messages({
    "any.required": "Pos device model is required.",
  }),

  device_mac_address: Joi.string().required().messages({
    "any.required": "Pos device mac address is Required.",
  }),
});

export const deviceCodeHistoryValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = deviceHistorySchema.validate(req.body, {
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
