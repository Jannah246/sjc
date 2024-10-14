import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const getCampByAccountantSchema = Joi.object({
  accountant_id: Joi.string().required().messages({
    "any.required": "Account id field is required.",
    "string.empty": "Account id is required.",
  }),

  status: Joi.number().integer().valid(0, 1, 2, 3).messages({
    "any.only": "The status field must be one of: 0,1,2,3.",
    "number.base": "The status field must be one of: 0,1,2,3.",
    "number.integer": "The status field must be one of: 0,1,2,3.",
  }),
});

export const getCampByAccountantValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = getCampByAccountantSchema.validate(req.query, {
    abortEarly: false,
  });
  if (error) {
    const { details } = error;
    const data = formatResponse(
      400,
      false,
      errorValidatorResponse(details),
      null
    );
    res.status(400).json(data);
    return;
  }
  next();
};
