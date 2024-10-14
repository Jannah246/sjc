import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const userPlaceOrderSchema = Joi.object({
  package_id: Joi.string().required().messages({
    "any.required": "Package id is required.",
    "string.empty": "Package id is required.",
  }),
});

export const userPlaceOrderValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = userPlaceOrderSchema.validate(req.body, {
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
