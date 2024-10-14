import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const assignedClientsListPackageWiseSchema = Joi.object({
  package_id: Joi.string().required().messages({
    "any.required": "Client id field is required.",
    "string.empty": "Client id field is required.",
  }),

  status: Joi.number().integer().valid(0, 1, 2, 3).messages({
    "any.required": "The status field is required.",
    "any.only": "The status field must be one of: 0,1,2,3.",
    "number.base": "The status field must be one of: 0,1,2,3.",
    "number.integer": "The status field must be one of: 0,1,2,3.",
  }),
});

export const assignedClientsListPackageWiseValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = assignedClientsListPackageWiseSchema.validate(req.query, {
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
