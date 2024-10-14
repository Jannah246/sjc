import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const endUserManualActiveSchema = Joi.object({
  order_id: Joi.string().required().messages({
    "any.required": "Order id is required.",
    "string.empty": "Order id is required.",
  }),
});

export const manualActivePackageValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = endUserManualActiveSchema.validate(req.body, {
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
