import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";
import { Obj } from "../../types/interfaces";

const assignDeviceCodeToPosSchema = Joi.object({
  camp_ids: Joi.string().required().messages({
    "any.required": "camp ids is required.",
    "string.empty": "camp ids is required.",
  }),
  camp_categories: Joi.string().required().messages({
    "any.required": "camp categories is required.",
    "string.empty": "camp categories is required.",
  }),

  pos: Joi.string().required().messages({
    "any.required": "pos id is required.",
    "string.empty": "pos id is required.",
  }),
});

export const assignCampToPosValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await assignDeviceCodeToPosSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    const error = await checkDeviceCodeArr(req);
    const categoryError = await checkCategory(req);
    if (!error && !categoryError) {
      return next();
    }
    const err: Obj = {};
    if (error) {
      err.camp_ids = error;
    }
    if (categoryError) {
      err.camp_categories = categoryError;
    }

    const data = formatResponse(400, true, err, null);
    res.status(400).json(data);
    return;
  } catch (error: any) {
    const { details } = error;
    let errorObj = errorValidatorResponse(details);
    if (!errorObj.camp_categories) {
      const error = await checkCategory(req);
      if (error) {
        errorObj = { camp_categories: error, ...errorObj };
      }
    }

    if (!errorObj.camp_ids) {
      const error = await checkDeviceCodeArr(req);
      if (error) {
        errorObj = { camp_ids: error, ...errorObj };
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

const checkCategory = async (req: Request) => {
  const regularExpression = new RegExp("^[1-3](,[1-3])*$");
  if (!regularExpression.test(req.body.camp_categories)) {
    return "Camp categories required with out space and comma separated values.The camp categories  field must be one of: 1,2,3.";
  }

  return "";
};
