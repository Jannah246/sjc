import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const assignClientSchema = Joi.object({
  client_ids: Joi.string().required().messages({
    "any.required": "Client id field is required.",
    "string.empty": "Client id field is required.",
  }),
  internet_package_id: Joi.string().required().messages({
    "any.required": "Internet package id field is required.",
    "string.empty": "Internet package id field is required.",
  }),
});

export const assignClientValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await assignClientSchema.validateAsync(req.body, { abortEarly: false });
    const error = checkClientIdArr(req);
    if (!error) {
      return next();
    }

    const data = formatResponse(400, false, { camp_ids: error }, null);
    res.status(400).json(data);
    return;
  } catch (error: any) {
    const { details } = error;
    let errorObj = errorValidatorResponse(details);
    if (!errorObj.client_ids) {
      const error = checkClientIdArr(req);
      if (error) {
        errorObj = { ...errorObj, client_ids: error };
      }
    }

    const data = formatResponse(400, false, errorObj, null);
    res.status(400).json(data);
    return;
  }
};

const checkClientIdArr = (req: Request) => {
  const regularExpression = new RegExp("^[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*$");
  if (!regularExpression.test(req.body.client_ids)) {
    return "Client ids required with out space and comma separated values";
  }
};
