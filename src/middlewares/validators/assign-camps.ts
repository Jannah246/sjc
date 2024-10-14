import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const assignCampsSchema = Joi.object({
  package_id: Joi.string().required().messages({
    "any.required": "Package id field is required.",
    "string.empty": "Package id field is required.",
  }),
  camp_ids: Joi.string().required().messages({
    "any.required": "Camp id field is required.",
    "string.empty": "Camp id field is required.",
  }),
});

export const assignCampsValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await assignCampsSchema.validateAsync(req.body, { abortEarly: false });
    const error = checkCampsIdArr(req);
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
      const error = checkCampsIdArr(req);
      if (error) {
        errorObj = { ...errorObj, camp_ids: error };
      }
    }

    const data = formatResponse(400, true, errorObj, null);
    res.status(400).json(data);
    return;
  }
};

const checkCampsIdArr = (req: Request) => {
  const regularExpression = new RegExp("^[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*$");
  if (!regularExpression.test(req.body.camp_ids)) {
    return "Camp ids required with out space and comma separated values";
  }
};
