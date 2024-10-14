import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const assignedPackageListCampWiseSchema = Joi.object({
  camp_ids: Joi.string().required().messages({
    "any.required": "Camp id field is required.",
    "string.empty": "Camp id field is required.",
  }),

  status: Joi.number().integer().valid(0, 1, 2, 3).messages({
    "any.only": "The status field must be one of: 0,1,2,3.",
    "number.base": "The status field must be one of: 0,1,2,3.",
    "number.integer": "The status field must be one of: 0,1,2,3.",
  }),
});

export const assignedPackageListCampWiseValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await assignedPackageListCampWiseSchema.validateAsync(req.query, {
      abortEarly: false,
    });
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
  const camp_ids: string = req.query.camp_ids
    ? req.query.camp_ids.toString()
    : "";
  const regularExpression = new RegExp("^[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*$");
  if (!regularExpression.test(camp_ids)) {
    return "Camp ids required with out space and comma separated values";
  }
};
